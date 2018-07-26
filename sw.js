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

const version = "0046"; // 07/25/2018 
const cacheName = `kyles-projects-${version}`;
//console.log("Cache Name:",cacheName);
//sessionStorage.setItem("version",cacheName);
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([

        /********************  TOP  ********************/
        `/`,
        `/index.html`,
        `/404.html`,

        /********************  PAGES  ********************/
        `/pages/navbar.html`,
        

        /********************  CSS  ********************/
        `/css/styles.css`,
        '/css/app-styles.css',
        `/css/reset.css`,
        `/css/pong.css`,
        `/css/minesweeper.css`,
        `/css/tictactoe.css`,

        /********************  APP  ********************/
        '/app/index.html',
        '/app/minesweeper.html',
        '/app/neckercube.html',
        '/app/pong.html',
        '/app/rollingsquare.html',
        '/app/traffic.html',
        '/app/info.html',

        /********************  JS  ********************/
        `/js/website.js`,
        `/js/tabletop.js`,

        /********************  P5JS  ********************/
        '/p5js/p5.js',
       
        '/p5js/pong/index.html',
        '/p5js/pong/pong.js',

        '/p5js/minesweeper/index.html',
        '/p5js/minesweeper/minesweeper.js',
        
        '/p5js/rollingcube/index.html',
        '/p5js/rollingcube/rollingcube.js',

        '/p5js/neckercube/index.html',
        '/p5js/neckercube/neckercube.js',

        '/p5js/trafficlight/index.html',
        '/p5js/trafficlight/trafficlight.js',

        /********************  SPLASH  ********************/
        `/splashscreens/ipadpro1_splash.png`,
        `/splashscreens/ipadpro2_splash.png`,
        `/splashscreens/iphone5_splash.png`,
        `/splashscreens/iphone6_splash.png`,
        `/splashscreens/iphoneplus_splash.png`,
        `/splashscreens/iphonex_splash.png`,
        `/splashscreens/ipad_splash.png`,

        /********************  IMAGES  ********************/
        `/images/icon.png`,
        `/images/icon-info.png`,
        `/images/icon-blank.png`,
        `/images/icon-pong.png`,
        `/images/icon-cube.png`,
        `/images/icon-minesweeper.PNG`,
        `/images/icon-rollingcube.png`,
        `/images/icon-traffic.png`,

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
