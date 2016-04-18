////Projects ////

var app = angular.module("projects", []);

app.controller("projectsController", function ($scope) {
    var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
    var usersRef = ref.child("users");

    $scope.titleInput = "";
    $scope.descriptionInput = "";
    $scope.roleInput = "";

    var authData = ref.getAuth();
    //var uID = authData.uid;

    //console.log("uid:" , uID);

    var postRef = ref.child("posts");

    postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        displayPosts(post.title, post.description, post.role, post.uID);
    });

    function displayPosts(title, description, role, myUID) {
        //if (myUID == uID)
        $('<div/>').text("Looking for: " + role).prepend($('<p/>').text(description)).
        prepend($('<h1/>').text(title+': ')).appendTo($('#projectsDiv'));
        $('#projectsDiv')[0].scrollTop = $('#projectsDiv')[0].scrollHeight; //scrollbar wordt geplaatst bij eerste post op pagina
    };

});

