import React, { Component } from 'react';
import Products from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Thanks from './components/Thanks'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import {getKey} from './repository';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

getKey().then((res) => {
  if(res){
    localStorage.setItem('stripeKey', res);
  }
});

const stripePromise = loadStripe(localStorage.getItem('stripeKey'));

class App extends Component {

  logOut(){
    localStorage.removeItem('x-access-token');
  }
  
  render() {
    return (
    <Elements stripe={stripePromise}>
      <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <div className="container">
                <Link className="navbar-brand" to="/">iDonate</Link>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/">Products</Link>
                    <Link className="nav-item nav-link" to="/cart">Cart</Link>

                  </div>
                </div>
              </div>
            </nav>
            <div className="container">
              <br/>
              <Route exact path="/" component={Products} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/thanks" component={Thanks} />
            </div>
          </div>
        </Router>
      </Elements>
    );
  }
}

export default App;
