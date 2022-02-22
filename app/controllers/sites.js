import Archiver from "archiver";
import sites from "../../core/sites.js";

const controllersSites = {
  scrape: sites.scrape,
  list: sites.list,
  find: function (params) {
    return sites.find(params.dirname);
  },

  download: function scrape(params, req, res) {
    return sites.getFullPath(params.dirname).then(function (fullPath) {
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-disposition":
          "attachment; filename=" + params.dirname + ".zip",
      });

      var zip = Archiver("zip");
      zip.pipe(res);
      zip.directory(fullPath, false).finalize();
    });
  },
};
export default controllersSites;
