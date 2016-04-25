function onSignIn(googleUser) {
  console.log("in google sign in function");
              // Useful data for your client-side scripts:
              var profile = googleUser.getBasicProfile();
              console.log("ID: " + profile.getId()); // Don't send this directly to your server!
              console.log('Full Name: ' + profile.getName());
              console.log('Given Name: ' + profile.getGivenName());
              console.log('Family Name: ' + profile.getFamilyName());
              console.log("Image URL: " + profile.getImageUrl());
              console.log("Email: " + profile.getEmail());

              // The ID token you need to pass to your backend:
              var id_token = googleUser.getAuthResponse().id_token;
              console.log("ID Token: " + id_token);
};


var app = angular.module("myApp", []);

app.controller("appController", function ($scope) {

//var ref = new Firebase('https://glowing-inferno-9012.firebaseio.com/');

var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
var usersRef = ref.child("users");
var chatRef = ref.child("chat");

$scope.loginMail = "";
$scope.loginPassword = "";
$scope.username = "guest";
$scope.authMessage = "";

$scope.uid = "";

var uID = "";

var getUserName = function(){
  usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function(snapshot){
    key = snapshot.key();
    $scope.user = snapshot.val();
    if($scope.user){
      $scope.username =  $scope.user.first_name + " " + $scope.user.last_name;  
      $scope.$digest();
    }
    });     
}
if(ref.getAuth()){
  uID = ref.getAuth().uid;
  $scope.uid = uID;
  getUserName();
  console.log("user email:", ref.getAuth().password.email);
}
console.log("uid", uID);

$scope.register = function()  {
  ref.createUser({
  email    : $scope.loginMail,
  password : $scope.loginPassword
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    usersRef.push({
            uid: userData.uid
        });
        console.log("saved new empty profile");
  }
});
  console.log("Login-mail: " + $scope.loginMail);
  console.log("Login-password: " + $scope.loginPassword)
}


//Login
$scope.login = function () {
  ref.authWithPassword({
    remember: "sessionOnly",
    email: $scope.loginMail,
    password: $scope.loginPassword
  },
   function(error, authData) {
      if (error) {
    console.log("Login Failed!", error);
  } else {
    uID = authData.uid;
    console.log("Authenticated successfully with payload:" +uID, authData);
    console.log("uid: " + uID);
    $scope.$digest();
    getUserName();
  }
});  
  //$scope.$digest();
}

//logout
$scope.logout = function(){
  ref.unauth();
  $scope.user = null;
  $scope.username = "guest";
  console.log("logged out");
}

///Password change///
$('#changeBtn').click( function() {
    email = $scope.loginMail;
    password = $scope.loginPassword;
    var newPass = $scope.newPassword;
    ref.changePassword({
        email       : email,
        oldPassword : password,
        newPassword : newPass
    }, function(error) {
        if (error === null) {
            console.log("Password changed successfully");
            password = newPass;
        } else {
            console.log("Error changing password:", error);
        }
    });
})

////USER DELETE////
/*$('#deleteBtn').click( function() {
    email = $scope.loginMail;
    password = $scope.loginPassword;
    ref.removeUser({
        email    : email,
        password : password
    }, function(error) {
        if (error === null) {
            console.log("User removed successfully");
        } else {
            console.log("Error removing user:", error);
        }
    });
}) */

///Password reset///
$('#forgotBtn').click(function () {
    email = $scope.loginMail;
    password = $scope.loginPassword;
    ref.resetPassword({
        email : email
    }, function(error) {
        if (error === null) {
            console.log("Password reset email sent successfully");
        } else {
            console.log("Error sending password reset email:", error);
        }
    });
})

// Chat system //

$('#messageInput').keypress(function (e) {
        if (e.keyCode == 13 && $('#messageInput').val() != "") {          
          var text = $('#messageInput').val();                    
          chatRef.push({name:$scope.username, text:text});
          $('#messageInput').val('');
        }
      });
chatRef.limitToLast(6).on('child_added', function(snapshot) {
         var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };

    /////Facebook API//////

// This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        if (response.status === 'connected') {
            testAPI();
            console.log("Logged into your app and Facebook");
        } else if (response.status === 'not_authorized') {
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
            console.log("The person is logged into Facebook, but not your app");
        } else {
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
            console.log("The person is not logged into Facebook, so we're not sure if they are logged into this app or not");
        }
    }

// This function is called when someone finishes with the Login Button

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '2050929358466509',
            cookie     : true,  // enable cookies to allow the server to access the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use graph api version 2.5
        });

        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into your app or not.
        // These three cases are handled in the callback function.

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });

    };

// Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
        });
    }
    //Callback when user logs in with Facebook
    window.loggedIn = function () {
        //console.log("Logged in!");
        testAPI();
    }


///////////////////////

 });

/*ref.authWithOAuthPopup("github", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}, {  
    remember: "sessionOnly",
      scope: "user"
}); */

