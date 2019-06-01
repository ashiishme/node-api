// NODE API 

const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');

let mysql = require('./config/config');
let posts = require('./controllers/Posts');
let contact = require('./controllers/Contact');

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

app.get('/posts', (req, res) => {
	new posts(req, res, mysql).getPosts();
});

app.get('/post/:id', (req, res) => {
	new posts(req, res, mysql).getSinglePost(req.params.id);
});

app.post('/addposts', verifyToken, (req, res) => {
	new posts(req, res, mysql).addPosts();
});

app.post('/contact', (req, res) => {
	new contact(req, res, mysql).sendMsg();
});

app.post('/login', (req, res) => {

	let username = req.body.username;
	let password = req.body.password;
	let sql = "SELECT * FROM ay_users WHERE ay_user_email = ?";
	mysql.query(sql, username, (err, result) => {
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

app.post('/upload', upload.single('avatar'), verifyToken, function (req, res) {
	res.json("success");
});


app.listen(process.env.PORT || 3000, () => {
	console.log("Started");
});
