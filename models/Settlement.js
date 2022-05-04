const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settlementSchema = new Schema({
	creditor: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	debitor: {
		type: Schema.Types.ObjectId,
		ref: 'User'			
	},
	trip: {
		type: Schema.Types.ObjectId,
		ref: 'Trip'
	},
    amount: Number,
    markedAsPaied: Boolean,
    markedAsReceived: Boolean
},
{ timestamps: true }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
module.exports = Settlement;