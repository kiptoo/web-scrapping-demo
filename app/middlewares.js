import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import config from "../config/app.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var engine = ejs.renderFile;

const middlewares = function (app) {
  app.engine("html", engine);
  // app.use(bodyParser.json());
  app.use(express.json());
  app.set("views", path.resolve(__dirname, "views"));
  app.use(express.urlencoded({ extended: false }));

  app.use(
    config.staticPath,
    express.static(path.resolve(__dirname, "../public"))
  );
  app.get(config.staticPath + "/*", function (req, res) {
    res.status(404).send("Not found");
  });
};

export default middlewares;
