// Contact class

class Contact {

	constructor(req, res, db) {
		this.req = req;
		this.res = res;
		this.db = db;
	}

	sendMsg() {
		this.db.query('INSERT INTO ay_contactmsgs SET ?', this.req.body, (err, result) => {
			if(err) throw err;
			this.res.json("success");
		}); 
	}
}

module.exports = Contact;
