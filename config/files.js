import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const files = {
  directory: path.resolve(__dirname, "../public/files/"),
  previewPath: "/static/files/{directory}",
  downloadPath: "/sites/{directory}/download",
};
export default files;
// var path = require("path");

// module.exports = {
//   directory: path.resolve(__dirname, "../public/files/"),
//   previewPath: "/static/files/{directory}",
//   downloadPath: "/sites/{directory}/download",
// };
