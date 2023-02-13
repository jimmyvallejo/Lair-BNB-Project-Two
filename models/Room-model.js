const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", default: "63e97eb439585f341f83b907'"},
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    test: String
  });

module.exports = model('Room', roomSchema);