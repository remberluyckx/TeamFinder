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
// with the Firebase database, you always read data using callbacks
myDataRef.on('child_added', function(snapshot) { // notify when chat messages arrive
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});
function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};
