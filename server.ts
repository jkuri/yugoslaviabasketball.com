import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join, resolve } from 'path';
import { readFile } from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4444;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

app.get('/api/players', (req, res) => {
  fetchPlayers()
    .then(data => res.json(JSON.parse(data)))
    .catch(err => res.json({ error: err }));
});

app.get('/api/players/:id', (req, res) => {
  fetchPlayer(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.json({ error: err }));
});

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

function fetchPlayers(): Promise<any> {
  return new Promise((res, reject) => {
    readFile(resolve(DIST_FOLDER, '..', 'data', 'players.json'), (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) {
        reject(err);
      } else {
        res(data.toString());
      }
    });
  });
}

function fetchPlayer(id: number): Promise<any> {
  return new Promise((res, reject) => {
    readFile(resolve(DIST_FOLDER, '..', 'data', 'players.json'), (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data.toString());
        const info = json[id - 1];
        const lastname = info.lastname
          .toLowerCase()
          .replace(/[čć]/ig, 'c')
          .replace(/[š]/ig, 's')
          .replace(/[đ]/ig, 'd')
          .replace(/[ž]/ig, 'z');

        readFile(resolve(DIST_FOLDER, '..', 'data', `${lastname}.json`), (e: NodeJS.ErrnoException, d: Buffer) => {
          if (err) {
            reject(err);
          } else {
            const stats = JSON.parse(d.toString());
            res({ info, stats });
          }
        });
      }
    });
  });
}
