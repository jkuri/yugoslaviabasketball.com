import "zone.js/dist/zone-node";

import { ngExpressEngine } from "@nguniversal/express-engine";
import * as express from "express";
import { join, resolve } from "path";
import { readFile } from "fs";

import { AppServerModule } from "./src/main.server";
import { APP_BASE_HREF } from "@angular/common";
import { existsSync } from "fs";

const DIST_FOLDER = join(process.cwd(), "dist/browser");

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const indexHtml = existsSync(join(DIST_FOLDER, "index.original.html"))
    ? "index.original.html"
    : "index.prod.html";

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    "html",
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set("view engine", "html");
  server.set("views", DIST_FOLDER);

  server.get("/api/players", (req, res) => {
    fetchPlayers()
      .then((data) => res.json(JSON.parse(data)))
      .catch((err) => res.json({ error: err }));
  });

  server.get("/api/players/:id", (req, res) => {
    fetchPlayer(Number(req.params.id))
      .then((data) => res.json(data))
      .catch((err) => res.json({ error: err }));
  });

  // Serve static files from /browser
  server.get(
    "*.*",
    express.static(DIST_FOLDER, {
      maxAge: "1y",
    })
  );

  // All regular routes use the Universal engine
  server.get("*", (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4444;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

function fetchPlayers(): Promise<any> {
  return new Promise((res, reject) => {
    readFile(
      resolve(DIST_FOLDER, "..", "..", "data", "players.json"),
      (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          res(data.toString());
        }
      }
    );
  });
}

function fetchPlayer(id: number): Promise<any> {
  return new Promise((res, reject) => {
    readFile(
      resolve(DIST_FOLDER, "..", "..", "data", "players.json"),
      (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          const json = JSON.parse(data.toString());
          const info = json[id - 1];
          const lastname = info.lastname
            .toLowerCase()
            .replace(/[čć]/gi, "c")
            .replace(/[š]/gi, "s")
            .replace(/[đ]/gi, "d")
            .replace(/[ž]/gi, "z");

          readFile(
            resolve(DIST_FOLDER, "..", "..", "data", `${lastname}.json`),
            (e: NodeJS.ErrnoException, d: Buffer) => {
              if (err) {
                reject(err);
              } else {
                const stats = JSON.parse(d.toString());
                res({ info, stats });
              }
            }
          );
        }
      }
    );
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || "";
if (moduleFilename === __filename || moduleFilename.includes("iisnode")) {
  run();
}

export * from "./src/main.server";
