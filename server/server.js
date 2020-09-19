'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const data = require('./data');
const config = require('./config');
const stripe = require('stripe')(config.stripe_secret_key);
const orderProcessor = require('./orderProcessor');
const processor = new orderProcessor(config.order_file);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//lists available products
app.get('/api/products', (req, res) => { 
  return res.json(data.products);
});

//generates cart
app.post('/api/products', (req, res) => { 
  let products = [], id = null;
  let cart = JSON.parse(req.body.cart);
  if (!cart) return res.json(products)
  for (var i = 0; i < data.products.length; i++) {
    id = data.products[i].id.toString();
    if (cart.hasOwnProperty(id)) {
      data.products[i].qty = cart[id]
      products.push(data.products[i]);
    }
  }
  return res.json(products);
});

 //returns Stripe publishable key
app.get('/api/stripe-key',express.json(), (req, res) => {
  res.send({
    stripePublishableKey: config.stripe_publishable_key
  });
});

// creates a payment intent
app.post("/api/payment-intent", express.json(), async (req, res) => {
    
    // Calculate payment amount on the server side (for simplicity we just use a fixed amount);
    const amount = 1000;
  
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        metadata: { integration_check: "accept_a_payment" },
      });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
});

// handles webhook events
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  //const sig = request.headers['stripe-signature'];
  //const endpointSecret = 'whsec_ILn0IvQn56NAAMqZp8K2KLrT8QWKLr9S';

  let event = request.body;
/*
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
*/
/*   try {
    console.log("here");
    console.log("body" + request.body);
    let newBody = JSON.stringify(request.body);
    event = JSON.parse(newBody);
    console.log("event" + event);
    console.log("done here");
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  } */

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const latestChargeData = paymentIntent.charges.data.filter((c) => c.paid)[0];
      const { amount, created, payment_method } = latestChargeData;
      const order = {
        paymentIntentId,
        created,
        amount,
        payment_method
      };
      processor.processOrder(order);
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      console.log('PaymentMethod was attached to a Customer!');
      break;
    case "payment_intent.payment_failed": 
      console.log("PaymentIntentFailed!");
     break;
    default:
      // Unexpected event type
      return response.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).json({received: true});
});


const PORT = 5000;
app.listen(PORT);

console.log('api running on port ' + PORT + ': ');