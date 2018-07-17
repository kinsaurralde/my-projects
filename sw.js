/*
 *
 *  Air Horner
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

const version = "0.6.11";
const cacheName = `airhorner-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([

        /********************  TOP  ********************/
        `/`,
        `/index.html`,
        `/404.html`,
        `/pong.html`,
        `/minesweeper.html`,
        `/files.html`,
        `/graphing-calculator.html`,
        `/necker-cube.html`,
        `/traffic-light.html`,

        /********************  PAGES  ********************/
        `/pages/navbar.html`,
        `/pages/pong.html`,
        `/pages/minesweeper.html`,
        `/pages/files.html`,
        `/pages/graphing-calculator.html`,
        `/pages/necker-cube.html`,
        `/pages/traffic-light.html`,

        /********************  CSS  ********************/
        `/css/styles.css`,
        `/css/reset.css`,
        `/css/pong.css`,
        `/css/minesweeper.css`,
        `/css/tictactoe.css`,

        /********************  JS  ********************/
        `/js/website.js`,
        `/js/tabletop.js`,

        /********************  P5JS  ********************/
        '/p5js/pong/index.html',
        '/p5js/pong/index.txt',
        '/p5js/pong/pong.js',

        '/p5js/minesweeper/index.html',
        '/p5js/minesweeper/index.txt',
        '/p5js/minesweeper/pong.js',

        /********************  IMAGES  ********************/
        `/images/projectimg-pong.PNG`,
        `/images/projectimg-cube.png`,
        `/images/projectimg-minesweeper.PNG`,
        `/images/projectimg-rollingcube.png`,
        `/images/projectimg-ap.png`,
        `/images/projectimg-traffic.png`,
        `/images/file.png`

      ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
