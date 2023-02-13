const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    userName:{
       type: String,
       required:[true, "User name is required. "],
       unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
      },
    password: String,
    imageUrl: {type: String, 
      default: 'http://clipart-library.com/img1/1590703.jpg'},
    
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);