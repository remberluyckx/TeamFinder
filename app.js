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

    var getUserName = function () {
        usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function (snapshot) {
            key = snapshot.key();
            $scope.user = snapshot.val();
            if ($scope.user) {
                $scope.username = $scope.user.first_name + " " + $scope.user.last_name;
                $scope.$digest();
            }
        });
    }

    var getUser = function () {
        usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function (snapshot) {
            key = snapshot.key();
            $scope.user = snapshot.val();
        });
    }


    var checkIfRegistered = function (uID) {
        usersRef.orderByChild("uid").equalTo(uID).on("child_added", function (snapshot) {
            console.log("user already exists");
            //uID = snapshot.val().uid;
            return true;
        })
    }

    if (ref.getAuth()) {
        uID = ref.getAuth().uid;
        $scope.uid = uID;
        getUserName();
        console.log("user email:", ref.getAuth().email);
    }
    console.log("uid", uID);

    $scope.register = function () {
        ref.createUser({
            email: $scope.loginMail,
            password: $scope.loginPassword
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                usersRef.push({
                    uid: userData.uid,
                    email: $scope.loginMail
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
            function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    uID = authData.uid;
                    console.log("Authenticated successfully with payload:" + uID, authData);                    
                    console.log("uid: " + uID);
                    $scope.$digest();
                    getUserName();
                    window.location.href = "post.html";
                }
            });
        //$scope.$digest();
    }

//logout
    $scope.logout = function () {
        ref.unauth();
        $scope.user = null;
        $scope.username = "guest";
        console.log("logged out");
        // google sign out
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }


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
    $scope.forgotPass = function () {
        email = $scope.forgotEmail;
        ref.resetPassword({
            email: email
        }, function (error) {
            if (error === null) {
                console.log("Password reset email sent successfully");
            } else {
                console.log("Error sending password reset email:", error);
            }
        });
    }

// Chat system //

    $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13 && $('#messageInput').val() != "") {
            var text = $('#messageInput').val();
            chatRef.push({name: $scope.username, text: text});
            $('#messageInput').val('');
        }
    });
    chatRef.limitToLast(6).on('child_added', function (snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
    });
    function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

    // Facebook like button
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.6&appId=2050929358466509";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    //Facebook login
    $scope.fblogin = function () {
        //var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
        ref.authWithOAuthPopup("facebook", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                uID = authData.uid;
                if (checkIfRegistered(uID) === false) {
                    addFacebookUser(authData.facebook);
                    console.log("added account");
                }
                else {
                    console.log("account already exists");
                }
                $scope.username = authData.facebook.displayName;
                getUser();
                $scope.$apply();
            }
        }, {
            scope: "email" // the permissions requested
        });
    }

// Google signin 
    $scope.googleLogin = function () {

        console.log("in google sign in function");

        ref.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    uID = authData.uid;
                    if (checkIfRegistered(uID) === false) {
                        addGoogleUser(authData.google.cachedUserProfile);
                    }
                    $scope.username = authData.google.displayName;

                    getUser();
                    $scope.$apply();
                    // getGoogleUserName();
                }

            },
            {
                remember: "sessionOnly",
                scope: "email"
            }
        );

    };
    var addGoogleUser = function (profile) {
        usersRef.push({

            first_name: profile.given_name,
            last_name: profile.family_name,
            email: profile.email,
            uid: uID
        })
        console.log("User created");
    }

    var addFacebookUser = function (profile) {
        usersRef.push({

            first_name: profile.cachedUserProfile.first_name,
            last_name: profile.cachedUserProfile.last_name,
            email: profile.email,
            uid: uID
        })
        console.log("User created");
    }

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

