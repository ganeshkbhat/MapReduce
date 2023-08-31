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



const sql = require("./src/mapreduce");

const connectionPaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';
const searchResults = sql.mapreduce(connectionPaths, searchQuery);

searchResults.forEach(result => {
    console.log(result);
});

console.log(sql.mapreduce([":memory:", "path/to/file.sqlite"], 'SELECT * FROM your_table WHERE your_condition;'));


