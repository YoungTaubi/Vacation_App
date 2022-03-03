const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenceSchema = new Schema({
	title: String,
	amount: Number,
	creditor: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	debitors: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

const Expence = mongoose.model('Expence', expenceSchema);
module.exports = Expence;