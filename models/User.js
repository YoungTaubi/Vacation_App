const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: String,
    email: String,
    imageUrl: {
      type: String,
      // default: '/images/profile_default.jpeg',
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
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
