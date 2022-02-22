import scrapeWebsite from "website-scraper";
import PuppeteerPlugin from "website-scraper-puppeteer";
import path from "path";
import format from "string-template";
import { promises as fs } from "fs";
import url from "url";
import Promise from "bluebird";
import _ from "lodash";
import config from "../config/files.js";
import defaults from "../config/scraper.js";
// var fs = require("fs");
function getSiteDirname(siteUrl) {
  var urlObj = url.parse(siteUrl);
  var domain = urlObj.host;
  return domain + "-" + new Date().getTime();
}

function getSiteFullPath(siteDirname) {
  return path.resolve(config.directory, siteDirname);
}

function getSitesDirectories() {
  var root = config.directory;
  var directories = [];
  console.log("root", root);
  return fs
    .readdir(root)
    .then(function (files) {
      console.log("files", files);

      return Promise.map(files, function (file) {
        console.log("file", file);
        console.log("file fullpath", root + "/" + file);
        return fs
          .stat(root + "/" + file)
          .then(function (stat) {
            let dir = stat.isDirectory();
            console.log("file isDirectory", dir);
            if (dir == true) {
              directories.push(file);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
        .then(function () {
          return Promise.resolve(directories);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function buildSiteObject(directory) {
  let data = {
    directory: directory,
    previewPath: format(config.previewPath, { directory: directory }),
    downloadPath: format(config.downloadPath, { directory: directory }),
  };

  console.log("buildSiteObject data", data);

  return data;
}

function getNotFoundError(directory) {
  return {
    errors: {
      directory: "Site " + directory + " was not found",
    },
  };
}

var service = {
  scrape: async function scrape(options) {
    var siteDirname = getSiteDirname(options.body.url);
    var siteFullPath = getSiteFullPath(siteDirname);

    var scraperOptions = _.extend({}, defaults, {
      // url: options.body.url,
      urls: options.body.urls,
      directory: siteFullPath,
      urlFilter: (url) => url.startsWith(options.body.url),
      plugins: [
        new PuppeteerPlugin({
          launchOptions: { headless: false } /* optional */,
          scrollToBottom: { timeout: 900000, viewportN: 10 } /* optional */,
          blockNavigation: true /* optional */,
        }),
      ],
      // If defaults object has request property, it will be superseded by options.request
      request: options.body.request,
      recursive: true,
      maxRecursiveDepth: 2,
      requestConcurrency: 3,
    });

    let data = await scrapeWebsite(scraperOptions).then(function () {
      console.log("done scrapeWebsite ");
      // return Promise.resolve(buildSiteObject(siteDirname));
      let resp = buildSiteObject(siteDirname);
      console.log("resp scrapeWebsite ", resp);
      // return resp;
      return Promise.resolve(resp);
    });

    console.log("data scrapeWebsite ", data);

    return data;
  },

  list: function list() {
    return getSitesDirectories()
      .then(function (directories) {
        console.log("directories ", directories);
        var list = directories.map(buildSiteObject);
        console.log("list ", list);
        return Promise.resolve(list);
      })
      .catch((err) => {
        console.log("getFullPath err", err);
      });
  },

  find: function find(dirname) {
    return getSitesDirectories()
      .then(function (directories) {
        console.log("find dirname", dirname);
        console.log("find directories", directories);
        var found = _.find(directories, function (el) {
          return el === dirname;
        });
        console.log("find directories found", found);

        if (!found) {
          return Promise.reject(getNotFoundError(dirname));
        }

        return Promise.resolve(buildSiteObject(found));
      })
      .catch((err) => {
        console.log("find err", err);
      });
  },

  getFullPath: function getFullPath(dirname) {
    return getSitesDirectories()
      .then(function (directories) {
        console.log("directories", directories);
        var exists = directories.indexOf(dirname) > -1;

        if (!exists) {
          return Promise.reject(getNotFoundError(dirname));
        }

        return Promise.resolve(getSiteFullPath(dirname));
      })
      .catch((err) => {
        console.log("getFullPath err", err);
      });
  },
};

// module.exports = service;
export default service;
