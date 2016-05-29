
var stripeFire = require("stripe-fire")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
var chargesRef = new Firebase("https://boiling-torch-9537.firebaseio.com/charges");

var charges = stripeFire.charges("https://boiling-torch-9537.firebaseio.com/charges", function(err, charge) {
    // Called after a create/update charge request is sent to Stripe 
}, "ACCESS_TOKEN", function(chargeData) {
    // Called before a create/update charge request is sent to Stripe 
    console.log("Chargedata: " + chargeData);
    return chargeData;
});


 
// Create a charge 
chargesRef.push({
    amount: 10,
    currency: "EUR",
    card: "token"
});
 
// Update a charge 
chargesRef.child("ChargeName").update({
    description: "Updating description"
});