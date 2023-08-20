

const sql = require("./src/mapreduce");

const connectionPaths = ['path/to/db1.sqlite', 'path/to/db2.sqlite'];
const searchQuery = 'SELECT * FROM your_table WHERE your_condition;';
const searchResults = sql.mapreduce(connectionPaths, searchQuery);

searchResults.forEach(result => {
    console.log(result);
});

console.log(sql.mapreduce([":memory:", "path/to/file.sqlite"], 'SELECT * FROM your_table WHERE your_condition;'));

