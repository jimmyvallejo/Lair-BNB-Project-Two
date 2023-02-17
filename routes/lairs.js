var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');
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
    
    
router.post('/create-lair', isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {

    const { name, description, price,} = req.body

    if (!name || !description || !price ) {
        res.render('lairs/create-lair.hbs', { errorMessage: 'All fields are mandatory.' });
        return;
      }
     
       if(req.file) {
        imageUrl = req.file.path;
       } else {
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1024px-Question_mark_%28black%29.svg.png"
       }

    Rooms.create({
        name,
        imageUrl,
        description,
        price,
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

router.post('/edit/:id', fileUploader.single('imageUrl'),(req, res, next) => {
    const { name, description, price} = req.body
    
    if (!name || !description || !price ) {
        res.render('lairs/edit-room.hbs');
        return;
      }
    
      if(req.file) {
        imageUrl = req.file.path;
       } else {
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1024px-Question_mark_%28black%29.svg.png"
       }


    Rooms.findByIdAndUpdate(req.params.id, 
        {
            name, 
            imageUrl,
            description,
            price
            
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

router.post('/searchbar', (req, res, next) => {
    const query = req.body.query || '';
    console.log('Search query:', query);
    Rooms.find({ $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
    ] })
    .populate('owner')
    .then((foundRooms) => {
        console.log(foundRooms)
        res.render('lairs/allLairs.hbs', { foundRooms });
    })
    .catch((err) => {
        console.log(err)
    })

});


router.get('/book/:id', isLoggedIn ,(req, res, next) => {
    const bookId = req.params.id;
    
    Rooms.findById(req.params.id)
    .populate('owner')
    .then((foundRoom) => {
        res.render('lairs/laircheckout.hbs', foundRoom)
       
    })
    .catch((err) => {
        console.log(err)
    })
})




module.exports = router;