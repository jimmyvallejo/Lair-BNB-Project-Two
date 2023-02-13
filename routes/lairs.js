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


    router.get('/create-lair', isLoggedIn, (req, res, next) => {
        res.render('lairs/create-lair.hbs');
      });
    
    
router.post('/create-lair', isLoggedIn, (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Rooms.create({
        name,
        imageUrl,
        description,
        owner: req.session.user._id
    })
    .then((createdRoom) => {
        console.log(createdRoom)
        res.redirect('/lairs')
    })
    .catch((err) => {
        console.log(err)
    })

})

router.get('/edit/:id', isOwner, (req, res, next) => {

    Rooms.findById(req.params.id)
    .then((foundRoom) => {
        res.render('lairs/edit-room.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/edit/:id', (req, res, next) => {
    const { name, description, imageUrl } = req.body
    Rooms.findByIdAndUpdate(req.params.id, 
        {
            name, 
            imageUrl,
            description
            
        },
        {new: true})
    .then((updatedRoom) => {
        console.log(updatedRoom)
        res.redirect(`/lairs/details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
}) 

module.exports = router;