
var app = angular.module("myProfile", []);

app.controller("profileController", function ($scope) {

var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
console.log("uid: " + ref.auth.uid);
});