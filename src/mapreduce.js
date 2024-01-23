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
    driverCallback = driverCallback || function (filePath, query) {
        function executeQuery(err) {
            if (!!err) {
                return err;
            }
            db.all(query, [], function (err, results) {
                if (err) {
                    console.error(err);
                } else {
                    results = preCallback(results);
                    allResults.push(...results);
                }
                db.close();
            }.bind(null, allResults));
        }
        const db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE, executeQuery.bind(null, allResults));
    }.bind(null, allResults);
    new Promise.all(connectionPaths.forEach((v) => driverCallback(v, query)));
    return projection(allResults);
}

async function mapreduceAsync(connectionPaths, query, driverCallback, preCallback = (r) => r, projection = (r) => r) {
    const allResults = [];

    driverCallback = driverCallback ? driverCallback instanceof  || function (filePath, query) {
        
        return new Promise((resolve, reject) => {
            driverCallback(...args).bind(null, resolve, reject);    
        });
    }.bind(null, allResults);;

    new Promise.all(connectionPaths.forEach((v) => driverCallback(v, query)));
    return projection(allResults);
}

module.exports.mapreduce = mapreduce;
module.exports.mapreduceAsync = mapreduceAsync;
