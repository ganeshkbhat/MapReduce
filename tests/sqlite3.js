const { expect } = require('chai');
const sinon = require('sinon');
const { Worker, isMainThread } = require('worker_threads');
const { searchInDatabase, runSearchAcrossDatabases } = require('./sqlite3'); // Replace with your actual code module

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
