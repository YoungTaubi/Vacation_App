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
			_id: 
				{
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
			joining: Boolean
		}

	],
	expences: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Expence'
		}
	]
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;