/**
 * 
 * Package: sql-mapreduce
 * Author: Ganesh B
 * Description: 
 * Install: npm i sql-mapreduce --save
 * Github: https://github.com/ganeshkbhat/mapreduce
 * npmjs Link: https://www.npmjs.com/package/sql-mapreduce
 * File: .js
 * File Description: 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';

async function mapreduceAsync(databaseConnections, query, driverCallback, preCallback = (r) => r, projection = (r) => r, ...a) {
  let allResults = [];
  driverCallback = (driverCallback instanceof Promise) ? driverCallback : function (...args) {
    return new Promise(async function (resolve, reject) {
      try {
        let R = driverCallback(...args);
        let mR = preCallback(R);
        resolve(mR);
      } catch (e) {
        reject(e);
      }
    });
  }.bind(null, preCallback);

  allResults = Promise.allSettled(databaseConnections.forEach(function (d) {
    return driverCallback(d, query, ...a);
  }.bind(null, driverCallback, query, ...a)));
  return projection(allResults);
}

module.exports.mapreduceAsync = mapreduceAsync;
