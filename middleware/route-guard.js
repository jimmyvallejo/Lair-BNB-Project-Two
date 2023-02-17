
const mongoose = require("mongoose");
const Rooms = require('../models/Room-model')


const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        res.render('users/login.hbs', { errorMessage: 'You must be logged in to access this feature.' });
         
    }
    next();
  };
  
 
const isLoggedOut = (req, res, next) => {
if (req.session.user) {
    return res.redirect('/');
}
next();
};

const isOwner = (req,res,next) => {
    Rooms.findById(req.params.id)
    .populate('owner')
    .then((foundRoom) => {
    
        if (!req.session.user || foundRoom.owner._id.toString() !== req.session.user._id) 
        { 
            res.redirect('/lairs/deleteCheck')
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isOwner,
    };