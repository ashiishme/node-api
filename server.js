/**
 * Name: Node JS API
 * Description: Node JS API Server for front end technologies.
 * Author: Ashish Yadav
 * Author URI: https://www.ashiish.me
 */


// includes express
const express = require('express');
// includes cors
const cors = require('cors');
// includes body parser
const bodyparser = require('body-parser');
// includes multer
const multer = require('multer');
// includes json web token
const jwt = require('jsonwebtoken');

// Server configuration
let mysql = require('./config/config');
// Post controller
let posts = require('./controllers/Posts');
// Contact controller
let contact = require('./controllers/Contact');

// multer config
let storage = multer.diskStorage({
	destination: './src/assets',
	filename: (req, file, callback) => {
		let oldName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
		let ext = file.originalname.split('.').pop();
		callback(null, oldName + "-" + Date.now() + "." + ext);
	}
});

let upload = multer({ storage: storage });
let app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


// Token verification for unauthorized api calls
function verifyToken(req, res, next) {
	if(!req.headers.authorization) {
		return res.status(401).send('Unauthorized Request');
	}
	let token = req.headers.authorization.split(' ')[1];
	if(token === 'null') {
		return res.status(401).send('Unauthorized Request');
	}
	let payload = jwt.verify(token, 'ASHISH_SECRET');
	if(!payload) {
		return res.status(401).send('Unauthorized Request');
	}
	next();
}

// api endpoints 

// returns all posts
app.get('/posts', (req, res) => {
	new posts(req, res, mysql.conn).getPosts();
});

// returns single post
app.get('/post/:id', (req, res) => {
	new posts(req, res, mysql.conn).singleBlogPost(req.params.id);
});

// submit posts to server, requires authentication
app.post('/addposts', verifyToken, (req, res) => {
	new posts(req, res, mysql.conn).addPosts();
});

// submit contact msg to server
app.post('/contact', (req, res) => {
	new contact(req, res, mysql.conn).sendMsg();
});

// login
app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let sql = "SELECT * FROM ay_users WHERE ay_user_email = ?";
	mysql.conn.query(sql, username, (err, result) => {
		if(err) {
			throw err;
			res.status(400).send("Something Went Wrong!");
		}
		if(result.length > 0) {
			if(result[0].ay_user_password == password) {
				let id = result[0].ay_user_id;
				let role = result[0].ay_user_role;
				let random = Math.floor(Math.random() * 100);
				let sub = username + id + role + random;
				let payload = { subject: sub};
				let token = jwt.sign(payload, 'ASHISH_SECRET');
				res.send({"status": "success", "token": token});
			} else {
				res.status(204).send({"status": "not match"});
			}
		} else {
			res.status(204).send({"status": "not found"});
		}
	});
});

// upload image, require authentication
app.post('/upload', upload.single('avatar'), verifyToken, function (req, res) {
	res.json("success");
});


app.listen(process.env.PORT || 3000, () => {
	console.log("Started");
});