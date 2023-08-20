/**
 * 
 */

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
        const db = new sqlite3.Database(filePath);
        db.all(query, [], (err, results) => {
            if (err) {
                console.error(err);
            } else {
                results = preCallback(results);
                allResults.push(...results);
            }
            db.close();
        });
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

    connectionPaths.forEach(driverCallback);
    return projection(allResults);
}

const connectionPaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';
const searchResults = mapreduce(connectionPaths, searchQuery);

searchResults.forEach(result => {
    console.log(result);
});

module.exports.mapreduce = mapreduce;
module.exports.mapreduceAsync = mapreduceAsync;
