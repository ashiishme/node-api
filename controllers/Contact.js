<<<<<<< HEAD
/**
 * @class Contact
 */
=======
// Contact class
>>>>>>> c89c152dae965a7975c7cf719e38da7a275b7e95

class Contact {

	constructor(req, res, db) {
		this.req = req;
		this.res = res;
		this.db = db;
	}

	// submit contact msg
	sendMsg() {
		this.db.query('INSERT INTO ay_contactmsgs SET ?', this.req.body, (err, result) => {
			if(err) throw err;
			this.res.json("success");
		}); 
	}
}

module.exports = Contact;
