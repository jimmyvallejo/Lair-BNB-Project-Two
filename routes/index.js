var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const testLairss = require("../Seed/testLairs");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const User = require('../models/User.model')




const storeItems = new Map()

testLairss.forEach((lair, index) => {
  storeItems.set(index + 100, { priceInCents: lair.price * 100, name: lair.name })
})



router.post("/create-checkout-session", async (req, res) => {
  console.log(req.body.items, "These are body items")
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id + 100);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: req.body.items[0].quantity,
        }
      }),
      success_url: `https://lairbnb.fly.dev/success`,
      cancel_url: `https://lairbnb.fly.dev/cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});



router.get('/success', async function(req, res, next) {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const userEmail = user.email;
  
  
  res.render('index', { errorMessage: `Thank you for your purchase! You will recieve an email shortly at ${userEmail} with your receipt`});

});


router.get('/cancel', async function(req, res, next) {
  
  res.render('index', { errorMessage: `Your payment has failed please return to Lair selection and try again`});

});



module.exports = router;
