

const sql = require("./src/sqlite3");

console.log(sql.mapreduce([":memory:", "path/to/file.sqlite"], 'SELECT * FROM your_table WHERE your_condition;'));
