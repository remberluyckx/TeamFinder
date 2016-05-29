////Projects ////

var app = angular.module("projects", []);

app.controller("projectsController", function ($scope, $http) {
    var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
    var usersRef = ref.child("users");

    $scope.titleInput = "";
    $scope.descriptionInput = "";
    $scope.roleInput = "";

    var authData = ref.getAuth();
    //var uID = authData.uid;

    //console.log("uid:" , uID);

    var postRef = ref.child("posts");

    /*postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        displayPosts(post.title, post.description, post.role, post.uID);
    }); */

    $http.get("http://localhost:3000/fireapi/posts")
    .success(function(posts){
        $scope.posts = posts;         
        console.log(posts);   
        //filterMyPosts(); 
    })
    .error(function(err){       
        console.log("Node server niet opgestart");
    });

});

