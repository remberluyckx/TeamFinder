////Post system////

var app = angular.module("myPost", []);

app.controller("postController", function ($scope) {
    var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
    var usersRef = ref.child("users");

    $scope.titleInput = "";
    $scope.descriptionInput = "";
    $scope.roleInput = "";

    var authData = ref.getAuth();
    var uID = authData.uid;

    console.log("uid:" , uID);

    var postRef = ref.child("posts");

    $scope.createPost = function(){

        postRef.push({
            title: $scope.titleInput,
            description: $scope.descriptionInput,
            role: $scope.roleInput,
            uID: uID
        });
    }

    postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        displayPosts(post.title, post.description, post.role, post.uID);
    });

    function displayPosts(title, description, role, myUID) {
        if (myUID == uID)
        $('<div/>').text("Looking for: " + role).prepend($('<p/>').text(description)).prepend($('<h1/>').text(title+': ')).appendTo($('#postsDiv'));
        $('#postsDiv')[0].scrollTop = $('#postsDiv')[0].scrollHeight; //scrollbar wordt geplaatst bij eerste post op pagina
    };

});

