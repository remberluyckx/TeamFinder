$( document ).ready(function() {
///CHAT SYSTEM///
var myDataRef = new Firebase('https://glowing-inferno-9012.firebaseio.com/');
$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        //myDataRef.set('User ' + name + ' says ' + text);
        //myDataRef.set({name: name, text: text}); // set vervangt telkens zijn vorige waarde
        myDataRef.push({name: name, text: text}); // push append aan een list
        $('#messageInput').val('');
    }
});

// in Firebase, you always read data using callbacks
myDataRef.on('child_added', function(snapshot) { // notify when chat messages arrive
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};
///////////////////

    var email;
    var password;
///USER CREATION///
$('#createBtn').click(function () {
    email = $('#e-mailInput').val();
    password = $('#passwordInput').val();
    myDataRef.createUser({
        email    : email,
        password : password
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });
})
///////////////////

////USER LOGIN/////
$('#loginBtn').click( function() {
    email = $('#e-mailInput').val();
    password = $('#passwordInput').val();
    myDataRef.authWithPassword({
        email    : email,
        password : password
    }, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
})
///////////////////

////USER DELETE////
$('#deleteBtn').click( function() {
    email = $('#e-mailInput').val();
    password = $('#passwordInput').val();
    myDataRef.removeUser({
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
///Password change///
$('#changeBtn').click( function() {
    email = $('#e-mailInput').val();
    password = $('#passwordInput').val();
    var newPass = $('#newPassInput').val();
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
////////////////////

///Password reset///
$('#forgotBtn').click(function () {
    email = $('#e-mailInput').val();
    password = $('#passwordInput').val();
    myDataRef.resetPassword({
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
});