const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    password: String,
    email: String,
    imageUrl: {
      type: String,
    },
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    notificationState: Boolean
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
