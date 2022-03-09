const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenceSchema = new Schema({
	title: String,
	amount: Number,
	creditor: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	creditorName: {
		type: String,
		ref: 'User'
	},
	debitors: [
		{
			// type: Schema.Types.ObjectId,
			// ref: 'User'
			_id:
				{
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
			name:
			{
				type: String,
				ref: 'User'
			},
			debitorDebt: Number
		}
	]
});

const Expence = mongoose.model('Expence', expenceSchema);
module.exports = Expence;