const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
	title: String,
	description: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	expences: [
		{
			// type: String
			type: Schema.Types.ObjectId,
			ref: 'Expence'
		}
	]
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;