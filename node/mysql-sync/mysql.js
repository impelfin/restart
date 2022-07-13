var mysql = require("sync-mysql");

var connection = new mysql({
		host : "database-1.c9tceinqozeu.ap-northeast-2.rds.amazonaws.com",
		user : "admin",
		password : "admin1234",
		database : "st_db",
});

// Select all rows from st_info table
let result = connection.query("SELECT * FROM st_info");
console.log(result);

// insert data
let data = {
    ST_ID : 202004,
    NAME : "Moon",
    DEPT : "Computer"
};

// inserted data's id
let insertId = data.ST_ID;

// insert data into st_info table
result = connection.query(
    "INSERT INTO st_info values (?, ?, ?)", [
        insertId,
        data.NAME,
        data.DEPT
]);

// Select all rows from st_info table
result = connection.query("SELECT * FROM st_info");
console.log(result);

// update row
result = connection.query("UPDATE st_info SET DEPT=? WHERE ST_ID=?", [
    "Game",
    insertId
]);

// Select all rows from st_info table
result = connection.query("SELECT * FROM st_info");
console.log(result);

// delete row
result = connection.query("DELETE FROM st_info WHERE ST_ID=?", [
    insertId,
]);

// Select all rows from st_info table
result = connection.query("SELECT * FROM st_info");
console.log(result);
