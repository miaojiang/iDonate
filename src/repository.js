import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export function getProducts() {
	return axios.get(`${BASE_URL}/api/products`)
		.then(response => response.data);
}

export function getCartProducts(cart) {
	return axios.post(`${BASE_URL}/api/products`, {cart})
		.then(response => response.data);
}


export function getKey() {
	return axios.get(`${BASE_URL}/api/stripe-key`)
        .then((response) => response.data.stripePublishableKey );
}

export function getSecret() {
	return axios.post(`${BASE_URL}/api/payment-intent`)
        .then((response) => response.data.clientSecret );
}

