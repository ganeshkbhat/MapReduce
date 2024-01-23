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

// https://www.npmjs.com/package/sqlite3
const sqlite3 = require('sqlite3');

// https://www.npmjs.com/package/odbc
const obdc = require("odbc");

// // https://www.npmjs.com/package/jdbc
// const JDBC = require('jdbc');
// const jinst = require('jdbc/lib/jinst');

function mapreduce(connectionPaths, query, driverCallback, preCallback = (r) => r, projection = (r) => r) {
    const allResults = [];
    driverCallback = driverCallback || function (filePath) {
        function executeQuery(err) {
            if (!!err) {
                return err;
            }
            db.all(query, [], (err, results) => {
                if (err) {
                    console.error(err);
                } else {
                    results = preCallback(results);
                    allResults.push(...results);
                }
                db.close();
            });
        }
        const db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE, executeQuery);
    };
    connectionPaths.forEach(driverCallback);
    return projection(allResults);
}

async function mapreduceAsync(connectionPaths, query, driverCallback, preCallback = (r) => r, projection = (r) => r) {
    const allResults = [];

    driverCallback = driverCallback || function (filePath, query) {
        const db = new sqlite3.Database(filePath);
        return new Promise((resolve, reject) => {
            db.all(query, [], (err, results) => {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    new Promise.all(connectionPaths.forEach(driverCallback));
    return projection(allResults);
}

module.exports.mapreduce = mapreduce;
module.exports.mapreduceAsync = mapreduceAsync;
