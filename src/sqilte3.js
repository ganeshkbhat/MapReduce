/**
 *
 */

// https://github.com/TryGhost/node-sqlite3/wiki/API

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
        const worker = new Worker(__filename, {
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

function searchInDatabase(filePath, query, preCallback) {
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

function mapreduce(filePaths, searchQuery) {

    const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
    const sqlite3 = require('sqlite3');

    if (isMainThread) {
        // const filePaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
        // const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';

        const preCallback = results => {
            // Modify or process results before pushing them to the results array
            return results.map(result => {
                // Example: Add a property to each result
                return { ...result, processed: true };
            });
        };

        runSearchAcrossDatabases(filePaths, searchQuery, preCallback, results => {
            results.forEach(result => {
                console.log(result);
            });
        });
    } else {
        const { filePath, query, preCallback } = workerData;
        searchInDatabase(filePath, query, preCallback)
            .then(results => {
                parentPort.postMessage(results);
            })
            .catch(error => {
                console.error(error);
                parentPort.postMessage([]);
            });
    }

}

module.exports.mapreduce = mapreduce;
module.exports.runSearchAcrossDatabases = runSearchAcrossDatabases;
module.exports.searchInDatabase = searchInDatabase;
