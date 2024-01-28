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



function mapreduce(connectionPaths, query, driverCallback, preCallback = (r) => r, projection = (r) => r) {
    const allResults = [];

    return projection(allResults);
}

async function mapreduceAsync(connectionPaths, query, driverCallback, preCallback = (r) => r, projection = (r) => r) {  }

module.exports.mapreduce = mapreduce;
module.exports.mapreduceAsync = mapreduceAsync;
