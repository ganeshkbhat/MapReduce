/**
 *
 */

// https://github.com/TryGhost/node-sqlite3/wiki/API


/**
 *
 *
 * @param {*} filePaths
 * @param {*} searchQuery
 * @param {*} preCallback
 * @param {*} projection
 */
function mapreduce(filePaths, searchQuery, preCallback, projection) {

    const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
    const sqlite3 = require('sqlite3');

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

    if (isMainThread) {
        // const filePaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
        // const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';

        // let preCallback
        preCallback = preCallback || function (results) {
            // Modify or process results before pushing them to the results array
            return results.map(result => {
                // Example: Add a property to each result
                return { ...result, processed: true };
            });
        };

        // let projection
        projection = projection || function (results) {
            results.forEach(result => {
                console.log(result);
            });
        }

        runSearchAcrossDatabases(filePaths, searchQuery, preCallback, projection);
    } else {
        const { filePath, query, preCallback } = workerData;
        searchInDatabase(filePath, query, preCallback)
            .then(results => {
                console.log("results: ", results);
                parentPort.postMessage(results);
            })
            .catch(error => {
                console.error(error);
                parentPort.postMessage([]);
            });
    }
}

module.exports.mapreduce = mapreduce;
