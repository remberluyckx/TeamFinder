var express = require("express");
var firebase = require("firebase");
var stripe = require("stripe")("sk_test_9kJKYI4YAE8G9usRZtX3cqCK");


//var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
var app = express();
var request = require("request");
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var postsURL = "https://boiling-torch-9537.firebaseio.com/posts.json?print=pretty";
var usersURL = "https://boiling-torch-9537.firebaseio.com/users.json?print=pretty";
var allPosts ="";
var allUsers = "";

var ref = new firebase("https://boiling-torch-9537.firebaseio.com");
var postRef = ref.child("posts");


app.use(express.static(__dirname ));
request({
	url:usersURL, json:true
}, function(error, response, body){
	if(!error && response.statusCode === 200){	
	console.log("loaded users");	
		allUsers = body;
	}
	else{
		console.log("Error: ", error);
	}
}); 

//var stripeToken = request.body.stripeToken;

console.info("users: " + allUsers);
var lijst = null;
	


//app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

app.get('/', function(req, res) {
        res.sendFile("index.html"); // load the single view file (angular will handle the page changes on the front-end)
    });

app.get("/fireapi/posts", function  (req, res) {
	request({  // http.get
	url:postsURL, json:true
}, function(error, response, body){
	if(!error && response.statusCode === 200){	
		console.log("loaded posts");	
		res.json(body);
	}
}); 
	
});
app.post("/fireapi/posts/:postNR", function  (req, res) {
	console.log("in post api");
	console.log(req.body);
	request({
  	url: "https://boiling-torch-9537.firebaseio.com/posts.json",
  	method: "POST",
  	json:req.body	
	});
});
app.delete('/fireapi/posts/:postNR', function  (req, res) {
	console.log("in delete api");		
	var postnr = req.params.postNR;
	console.log(postnr);
	postRef.orderByChild("postNR").equalTo((postnr).toString()).on("child_added", function(snapshot)
        {    
        console.log("in orderByChild")       ;
            var key = snapshot.key();
            console.log(key);
			postRef.child(key).remove();			
        });
	res.send("post deleted");
	

});

app.get("/fireapi/pay", function  (req, res) {

	//
});
app.listen(3000);