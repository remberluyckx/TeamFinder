var app = angular.module("myApp", []);

app.controller("appController", function ($scope) {

//var ref = new Firebase('https://glowing-inferno-9012.firebaseio.com/');

var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
var usersRef = ref.child("users");

$scope.loginMail = "";
$scope.loginPassword = "";
$scope.username = "Guest";
$scope.authMessage = "";
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
    getUserName();
  }
});
  
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
        if (e.keyCode == 13) {
          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          ref.push({name:name, text:text});
          $('#messageInput').val('');
        }
      });
ref.on('child_added', function(snapshot) {
         var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };
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

