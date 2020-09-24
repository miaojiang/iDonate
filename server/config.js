// A better approach would be using environment variables, rather than having the secrets in files.
// Do not check in this file to GitHub with your actual secrets

var config = {};

config.stripe_publishable_key = 'pk_test_xxx'
config.stripe_secret_key = 'sk_test_xxx';
config.websocket_secret = 'whsec_xxx';
config.order_file = './order.csv';

module.exports = config;