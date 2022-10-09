require('dotenv').config()
const { UMAIL, UPASS } = process.env
var nodemailer = require('nodemailer')

class Emailer {
	#transporter = nodemailer.createTransport({
        host:"19.213.109.208.host.secureserver.net",
        port:465,
        secure:true,
		auth: {
			user: UMAIL,
			pass: UPASS,
		},
	})

	constructor() {}
	/**
	 * Sends an email to the intended recipient.
	 * @param {*} to - The recipient or recipient array for the email
	 * @param {*} sub - The subject of the email
	 * @param {*} body - The body of the email
	 */
	sendMail(to, sub, body) {
		let mailOptions = {
			to: to,
			from: UMAIL,
			subject: sub,
			text: body,
		}
		this.#transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.error(error)
				throw error
			} else {
				console.log('Email sent: ' + info.response)
			}
		})
	}
}

module.exports = new Emailer()