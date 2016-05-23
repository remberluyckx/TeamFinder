////Post system////

var app = angular.module("myPost", []);

app.controller("postController", function ($scope) {
    var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
    var usersRef = ref.child("users");

    $scope.titleInput = "";
    $scope.descriptionInput = "";
    $scope.roleInput = "";
    $scope.posts = [];

    //tabs voor navigatie


   
    var authData = ref.getAuth();
    var uID = authData.uid;

    console.log("uid:" , uID);

    var postRef = ref.child("posts");
    
    var countPosts = function()
    {   
        var counter = 0;
        postRef.orderByChild("uID").equalTo(uID.toString()).on("child_added", function(snapshot)
        {
            counter++;
        });
        return counter;
    };

    $scope.createPost = function(){

        postRef.push({
            title: $scope.titleInput,
            description: $scope.descriptionInput,
            role: $scope.roleInput,
            uID: uID,
            postNR: counter + uID
        });
    }

    postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        $scope.posts.push(post);
        console.log(post.role,  post.description,  post.title, snapshot.key());
        $scope.$digest();
    });

    $scope.add = function(item)
    {
        console.log(item);
        window.alert(item);
    };

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

});

