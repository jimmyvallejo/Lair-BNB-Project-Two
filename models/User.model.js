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
      default: 'https://i.pinimg.com/originals/ab/85/8f/ab858fbfd2c5aa35bf96350498d695ca.jpg'},
    
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);