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

const { expect } = require('chai');
const sinon = require('sinon');
const { Worker, isMainThread } = require('worker_threads');
const { searchInDatabase, runSearchAcrossDatabases } = require('./test_sqlite.mapreduce'); // Replace with your actual code module

describe('searchInDatabase', () => {
    it('should fetch and process results from database', async () => {
        const mockResults = [{ id: 1, name: 'Item 1' }];
        const mockDatabase = {
            all: (query, params, callback) => callback(null, mockResults),
            close: () => { },
        };

        const mockDatabaseConstructor = sinon.fake.returns(mockDatabase);
        sinon.replace(sqlite3, 'Database', mockDatabaseConstructor);

        const preCallback = sinon.stub().returns(mockResults);
        const filePath = 'mock/db.sqlite';
        const query = 'SELECT * FROM items;';
        const results = await searchInDatabase(filePath, query, preCallback);

        expect(mockDatabaseConstructor.calledOnce).to.be.true;
        expect(mockDatabase.all.calledOnce).to.be.true;
        expect(preCallback.calledOnce).to.be.true;
        expect(preCallback.getCall(0).args[0]).to.deep.equal(mockResults);
        expect(results).to.deep.equal(mockResults);

        sinon.restore();
    });
});

describe('searchInDatabase - 2', () => {
    it('should fetch and process results from database', async () => {
        const mockResults = [{ id: 1, name: 'Item 1' }];
        const mockDatabase = {
            all: (query, params, callback) => callback(null, mockResults),
            close: () => {},
        };

        const mockDatabaseConstructor = sinon.fake.returns(mockDatabase);
        sinon.replace(sqlite3, 'Database', mockDatabaseConstructor);

        const preCallback = sinon.stub().returns(mockResults);
        const filePath = 'mock/db.sqlite';
        const query = 'SELECT * FROM items;';
        
        // Use bind to pass the preCallback name and its arguments
        const results = await searchInDatabase(filePath, query, preCallback.bind(null, mockResults));

        expect(mockDatabaseConstructor.calledOnce).to.be.true;
        expect(mockDatabase.all.calledOnce).to.be.true;
        expect(preCallback.calledOnce).to.be.true;
        expect(results).to.deep.equal(mockResults);

        sinon.restore();
    });
});

describe('runSearchAcrossDatabases', () => {
    it('should collect and process results from multiple databases', done => {
        const filePaths = ['mock/db1.sqlite', 'mock/db2.sqlite'];
        const searchQuery = 'SELECT * FROM items;';
        const preCallback = sinon.stub().returnsArg(0);

        const mockWorker = {
            on: (event, handler) => {
                if (event === 'message') {
                    handler([{ id: 1, name: 'Item 1' }]);
                }
            },
            postMessage: () => { },
        };

        sinon.replace(Worker.prototype, 'on', mockWorker.on);
        sinon.replace(Worker.prototype, 'postMessage', mockWorker.postMessage);

        runSearchAcrossDatabases(filePaths, searchQuery, preCallback, results => {
            expect(results).to.deep.equal([{ id: 1, name: 'Item 1' }, { id: 1, name: 'Item 1' }]);
            expect(preCallback.calledTwice).to.be.true;

            sinon.restore();
            done();
        });
    });
});
