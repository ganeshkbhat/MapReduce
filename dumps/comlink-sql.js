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

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const sqlite3 = require('sqlite3');
const comlink = require('comlink');

async function searchInDatabase(filePath, query, preCallback) {
    const db = new sqlite3.Database(filePath);
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, results) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(preCallback(results));
            }
        });
    });
}

function runSearchAcrossDatabases(filePaths, searchQuery, preCallback, callback) {
    const numThreads = filePaths.length;
    const results = [];

    function handleWorkerMessage(message) {
        results.push(...message);
        if (results.length === numThreads) {
            callback(results);
        }
    }

    for (let i = 0; i < numThreads; i++) {
        const worker = new Worker(process.argv[1], {
            workerData: { filePath: filePaths[i], query: searchQuery, preCallback },
        });

        worker.on('message', handleWorkerMessage);
        worker.on('error', err => {
            console.error(err);
        });

        worker.on('exit', code => {
            if (code !== 0) {
                console.error(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    }
}

if (isMainThread) {
    const filePaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
    const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';

    let preCallback
    preCallback = preCallback || function (results) {
        // Modify or process results before pushing them to the results array
        return results.map(result => {
            // Example: Add a property to each result
            return { ...result, processed: true };
        });
    };

    let projection
    projection = projection || function (results) {
        results.forEach(result => {
            console.log(result);
        });
    }

    runSearchAcrossDatabases(filePaths, searchQuery, preCallback, projection);
} else {
    const { filePaths, query, preCallback } = workerData;
    const preCallbackFunction = comlink.proxy(comlink.transferHandlers.get('function').decode(preCallback));

    searchInDatabase(filePaths, query, preCallbackFunction)
        .then(results => {
            parentPort.postMessage(results);
        })
        .catch(error => {
            console.error(error);
            parentPort.postMessage([]);
        });
}
