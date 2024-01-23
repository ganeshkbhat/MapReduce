var sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
    runQueries(db);
});

function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    console.log("Getting newdb", newdb);
    newdb.exec(`
    create table hero (
        hero_id int primary key not null,
        hero_name text not null,
        is_xman text not null,
        was_snapped text not null
    );
    insert into hero (hero_id, hero_name, is_xman, was_snapped)
        values (1, 'Spiderman', 'N', 'Y'),
               (2, 'Tony Stark', 'N', 'N'),
               (3, 'Jean Grey', 'Y', 'N');

    create table hero_power (
        hero_id int not null,
        hero_power text not null
    );

    insert into hero_power (hero_id, hero_power)
        values (1, 'Web Slinging'),
               (1, 'Super Strength'),
               (1, 'Total Nerd'),
               (2, 'Total Nerd'),
               (3, 'Telepathic Manipulation'),
               (3, 'Astral Projection');
        `, () => {
        runQueries(newdb);
    });
}

function runQueries(db) {
    db.all(`select hero_name, is_xman, was_snapped from hero h
   inner join hero_power hp on h.hero_id = hp.hero_id
   where hero_power = ?`, "Total Nerd", (err, rows) => {
        console.log("runQueries err ", err);
        console.log("runQueries rows ", rows);
        rows.forEach(row => {
            console.log(row.hero_name + "\t" + row.is_xman + "\t" + row.was_snapped);
        });
    });
}
