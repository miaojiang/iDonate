# Sample React app that integrates with Stripe Payment Intents API

This sample app integrates with the Stripe Payment Intents API. The front end is built with React and the backend is built with Node.js. The app allows users to make donations to a curated list of charities. 

The app takes one-time payment using the Stripe Payment Intents API. It supports card payments with or without 3D auth. The backend server also listens to webhook events and logs successful payment to a csv file.

## Prerequisite

You will need to following to run this demo: 

- [Node.js](http://nodejs.org) >=10.0.0
- [Stripe account](https://dashboard.stripe.com/register)
- [Stripe CLI](https://github.com/stripe/stripe-cli#installation)

## Get Started

### Clone the repository
```gh repo clone miaojiang/iDonate```

```cd iDonate```

### Install dependencies using npm
```npm install```

### Authenticate with the Stripe CLI and start the webhook forwarding
```stripe login```
```stripe listen --forward-to http://localhost:5000/webhook```

### Update the configuration file with your Stripe credentials
Update ```./server/config.js``` file with your Stripe publishable key, secret key, and webhook signing secret.

### Start both frontend and backend
```npm run dev```

## Using the app

On the home page, users will see a curated list of charities. They can decide which charities to donate to by adding them to the cart. They can view the cart and proceed to the payment page, where they will provide their name and card information.

Upon receiving the ```payment_intent.succeeded``` webhook event, the order is logged to the orders.csv file.

### Credits
I have never used React before and learned it by following [this](https://dzone.com/articles/create-a-simple-shopping-cart-using-react-and-node) awesome tutorial created by George Anderson.