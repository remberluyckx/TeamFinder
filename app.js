var app = angular.module("myApp", []);

app.controller("appController", function ($scope) {

//var myDataRef = new Firebase('https://glowing-inferno-9012.firebaseio.com/');

var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");

$scope.loginMail = "";
$scope.loginPassword = "";
$scope.username = "Guest";
$scope.authMessage = "";

$scope.register = function()  {
  ref.createUser({
  email    : $scope.loginMail,
  password : $scope.loginPassword
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
  }
});
  console.log("Login-mail: " + $scope.loginMail);
  console.log("Login-password: " + $scope.loginPassword)
}

$scope.login = function () {
  ref.authWithPassword({
    email: $scope.loginMail,
    password: $scope.loginPassword
  }, function(error, authData) {
      if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
    $scope.username = $scope.loginMail;
  }
});
  
}
///Password change///
$('#changeBtn').click( function() {
    email = $scope.loginMail;
    password = $scope.loginPassword;
    var newPass = $scope.newPassword;
    myDataRef.changePassword({
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
$('#deleteBtn').click( function() {
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
})

///Password reset///
$('#forgotBtn').click(function () {
    email = $scope.loginMail;
    password = $scope.loginPassword
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

///////////////////

////Post system////
    var postRef = myDataRef.child("posts");
$("#postBtn").click( function() {
    var title = $('#titleInput').val();
    var description = $('#descriptionInput').val();
    var role = $('#roleInput').val();

    postRef.push({
            title: title,
            description: description,
            role: role
    });
})

    postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        displayPosts(post.title, post.description, post.role);
    });

    function displayPosts(title, description, role) {
        $('<div/>').text("Looking for: " + role).prepend($('<p/>').text(description)).prepend($('<h1/>').text(title+': ')).appendTo($('#postsDiv'));
        $('#postsDiv')[0].scrollTop = $('#postsDiv')[0].scrollHeight; //scrollbar wordt geplaatst bij eerste post op pagina
    };
//////////////////
});

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

/*myDataRef.authWithOAuthPopup("github", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}, {
    remember: "sessionOnly",
      scope: "user"
}); */

