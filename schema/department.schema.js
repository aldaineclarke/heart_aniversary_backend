const { Schema, model} = require('mongoose')

let departmentSchema = new Schema({
	name: { type: String, required: [true, 'Department name blank'] },
})

departmentSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await model('Department')
			.find({ name: this.name })
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

const departmentModel = model('Department', departmentSchema)
module.exports = departmentModel
