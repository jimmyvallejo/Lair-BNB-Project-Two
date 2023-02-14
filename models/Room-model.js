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
      type: String,
      required:[true, "Image is required. "],
      unique: true,
   },
    price: Number,
    owner: { type: Schema.Types.ObjectId, ref: "User", default: "63e97eb439585f341f83b907'"},
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    test: String
  });

module.exports = model('Room', roomSchema);