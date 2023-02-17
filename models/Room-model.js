const { Schema, model } = require('mongoose');

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required:[true, "Name is required. "],
      unique: true,
   },
    description: String,
    imageUrl: {
      type: String
   },
    price: Number,
    owner: { type: Schema.Types.ObjectId, ref: "User"},
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    test: String
  });

module.exports = model('Room', roomSchema);