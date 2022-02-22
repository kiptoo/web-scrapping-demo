import controller from "app-controller";
import index from "./controllers/index.js";
import sites from "./controllers/sites.js";

const routes = function (app) {
  app.get("/sites", sites.list);
  app.post("/sites", sites.scrape);

  app.get("/sites/:dirname", sites.find);
  app.get("/sites/:dirname/download", sites.download);

  app.get("/", index.index);
  app.get("*", index.index);
};
export default routes;
