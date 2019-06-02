/**
 * Configuration file for database
 */

// DEFINE CONSTANTS

let HOST = "localhost";
let DATABASE_NAME = "ashiish";
let DATABASE_USER = "root";
let DATABASE_PASSWORD = "";

let POST_TABLE_NAME = "your_post_table_name";
let CONTACT_TABLE_NAME = "your_contact_table_name";
let USER_TABLE_NAME = "your_user_table_name";

let constants = {
	POST_TABLE_NAME: POST_TABLE_NAME,
	CONTACT_TABLE_NAME: CONTACT_TABLE_NAME,
	USER_TABLE_NAME: USER_TABLE_NAME
};

// includes mysql
let mysql = require("mysql");
// creates connections
let conn = mysql.createConnection({
	host		: HOST,
	user		: DATABASE_USER,
	password	: DATABASE_PASSWORD,
	database	: DATABASE_NAME
});

conn.connect((err) => {
	if(err) throw err;
	console.log("Connected");
});

module.exports = {
	conn,
	constants: constants
};