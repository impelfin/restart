const mysql = require("mysql2/promise");

const db = async () => {
    try {
    	// db connection
        let connection = await mysql.createConnection({
            host: "database-1.c9tceinqozeu.ap-northeast-2.rds.amazonaws.com",
            user: "admin",
            password: "admin1234",
            database: "st_db",
        });

	// Select all rows from st_info table
        let [rows, fields] = await connection.query("SELECT * FROM st_info");
        console.log(rows);

	// insert data
        let data = {
            ST_ID : "202004",
            NAME : "Moon",
            DEPT : "Computer"
        };

	// insert data into st_info table
        let [results] = await connection.query(
            "INSERT INTO st_info SET ?",
            data
        );
        // inserted data's id
        let insertId = data.ST_ID;

	// Select all rows from st_info table
        [rows, fields] = await connection.query("SELECT * FROM st_info");
        console.log(rows);

	// update row
        [results] = await connection.query("UPDATE st_info SET DEPT=? WHERE ST_ID=?", [
            "Game",
            insertId,
        ]);

	// Select all rows from st_info table
        [rows, fields] = await connection.query("SELECT * FROM st_info");
        console.log(rows);

	// delete row
        [results] = await connection.query("DELETE FROM st_info WHERE ST_ID=?", [
            insertId,
        ]);

	// Select all rows from st_info table
        [rows, fields] = await connection.query("SELECT * FROM st_info");
        console.log(rows);
    } catch (error) {
        console.log(error);
    }
};

db();
