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
    
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);