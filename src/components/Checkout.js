import React from 'react';
import { getCartProducts } from '../repository';
import CardSection from './CardSection';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';

class Checkout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			total: 0
		}
	}

	componentWillMount() {
		let cart = localStorage.getItem('cart');
		if (!cart) return;
		getCartProducts(cart).then((products) => {
			let total = 0;
			for (var i = 0; i < products.length; i++) {
				total += products[i].price * products[i].qty;
			}
			this.setState({ products, total });
		});
	}

	disablePayButton(value){
		const btn = document.getElementById('pay-btn');
		btn.disabled = value;
	}

	getCustomerName(){
		const name = document.getElementById('name');
		return name.value;
	}

	resetState(){
		this.disablePayButton(false);
		localStorage.removeItem('clientSecret');
		localStorage.removeItem('cart');
	}
	handleSubmit = async (event) => {
		this.disablePayButton(true);
		event.preventDefault();

		const { stripe, elements } = this.props
		const name = this.getCustomerName();
		let clientSecret = localStorage.getItem('clientSecret');

		if (!stripe || !elements || !clientSecret) {
			alert('We encountered a technical issue.');
			return;
		}

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: name
				},
			}
		});

		if (result.error) {
			// Show error to your customer (e.g., insufficient funds)
			alert("Payment failed:" + result.error.message);
			this.disablePayButton(false);
		} else {
			// The payment has been processed!
			if (result.paymentIntent.status === 'succeeded') {
				// Show a success message to your customer
				// There's a risk of the customer closing the window before callback
				// execution. Set up a webhook or plugin to listen for the
				// payment_intent.succeeded event that handles any business critical
				// post-payment actions.
				this.resetState();
				window.location = './thanks';
			}
		}
	}

	render() {
		return (
			<div name="cardSection" className="container">
			<h3 className="card-title">Payment Method</h3>
			<form onSubmit={this.handleSubmit}>
				<label htmlFor="name">
					<span>Name: </span>
					<input id="name" className="field" type="text" placeholder="Enter your name" required/>
				</label>
				<CardSection />
				<br></br>
				<button id="pay-btn" className="btn btn-primary float-left" disabled={!this.props.stripe}>Pay</button>
			</form>
			</div>
		  );
	}
}

export default function InjectedCheckout() {
	return (
	  <ElementsConsumer>
		{({stripe, elements}) => (
		<div>
		  	<Checkout  stripe={stripe} elements={elements} />
		  </div>
		)}
	  </ElementsConsumer>
	);
  }