var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { isLoggedIn, isOwner } = require('../middleware/route-guard');

const Rooms = require('../models/Room-model')


router.get('/', (req, res, next) => {

    Rooms.find()
    .populate('owner')
    .then((foundRooms) => {
        res.render('lairs/allLairs.hbs', { foundRooms });
    })
    .catch((err) => {
        console.log(err)
    })

});


router.get('/details/:id', isLoggedIn ,(req, res, next) => {
    Rooms.findById(req.params.id)
    .populate('owner')
    .then((foundRoom) => {
        res.render('lairs/lair-details.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.get('/delete/:id', isOwner, (req, res, next)=> {
Rooms.findByIdAndDelete(req.params.id)
.then((confirmation) => {
   console.log(confirmation)
   res.redirect('/lairs')
}).catch((err) => {
    console.log(err)
})
})

router.get('/deleteCheck', (req, res, next)=> {
    res.render('lairs/deleteCheck.hbs')
    })
    
    




module.exports = router;