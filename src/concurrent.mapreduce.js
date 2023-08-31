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

const concurrency = require("concurrency.js");
const sqlmr = require("./mapreduce");

const mapreduce = sqlmr.mapreduce;
const mapreduceAsync = sqlmr.mapreduceAsync;

concurrency.concurrencyThreadsAsync();

module.exports.cMapReduce = cMapReduce;
module.exports.cMapReduceAsync = cMapReduceAsync;
