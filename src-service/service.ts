// Setting app mode - this has to happen before anything else
import fs from "fs";
import path from "path";
import http from "http";
import express from "express";
import { defineAllRoutes } from "./routes";
import { info, stringToBoolean } from "./utils";
import { parseLogs } from "./parse-log";
import dotenv from "dotenv";

dotenv.config();

const LOG_PATH =
  process.env.LOG_PATH ||
  path.resolve(path.normalize("C:\\Projects\\DuccBot-Display\\example-logs"));
const FILE_OS_TYPE = process.env.FILE_OS_TYPE || "linux";
const PUBLIC_PATH =
  process.env.PUBLIC_PATH ||
  path.resolve(path.normalize(__dirname + "/../public")); //look at github for last version
const LISTEN_HOST = process.env.LISTEN_HOST || "0.0.0.0";
const LISTEN_PORT = process.env.LISTEN_PORT || "3000";
console.log({
  LOG_PATH,
  LISTEN_HOST,
  LISTEN_PORT,
  PUBLIC_PATH,
  FILE_OS_TYPE,
});

const app = express();

const webServer = http.createServer(app);
app.use(express.static(PUBLIC_PATH));

defineAllRoutes(app);
try {
  app.use((req, res) =>
    res.sendFile(path.resolve(path.normalize(PUBLIC_PATH + `/index.html`)))
  );
} catch (error) {
  app.use((req, res) =>
    res.sendFile(path.resolve(path.normalize(`${__dirname}/public/index.html`)))
  );
}

setInterval(() => {
  parseLogs(LOG_PATH, FILE_OS_TYPE);
}, 2000);

webServer.listen(parseInt(LISTEN_PORT), LISTEN_HOST, () => {
  info(`The openvpn service is listening on [32m${LISTEN_HOST}[0m:[35m${LISTEN_PORT}[0m`);
  info(`|-> Serving conmtent from: [35m${PUBLIC_PATH}[0m`);
});
