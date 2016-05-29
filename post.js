////Post system////

var app = angular.module("myPost", []);

app.controller("postController", function ($scope, $http) {
    var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
    var usersRef = ref.child("users");

    $scope.titleInput = "";
    $scope.descriptionInput = "";
    $scope.roleInput = "";
    $scope.posts = [];
    $scope.myPosts = [];
    $scope.username = "";

    //tabs voor navigatie


   
    var authData = ref.getAuth();
    var uID = authData.uid;

    console.log("uid:" , uID);

  // get username
        usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function (snapshot) {
            key = snapshot.key();
            $scope.user = snapshot.val();
            if ($scope.user) {
                $scope.username = $scope.user.first_name + " " + $scope.user.last_name;               
            }
        });    


    var postRef = ref.child("posts");

    $scope.getAllPosts = function(){
        $http.get("http://localhost:3000/fireapi/posts")
    .success(function(posts){
        $scope.posts = posts;         
        console.log(posts);   
        //filterMyPosts(); 
    })
    .error(function(err){       
        console.log("Node server niet opgestart");
    });
    }
    

    $scope.filterMyPosts = function(){
        console.log("in my posts filter");        
        //var posts = $scope.posts;
        var posts= $($scope.posts).filter(function (i,n){return n.uID==uID});
        console.log(posts);
        console.log(posts.key);        
        for(var i = 0; i < $scope.posts.length; i++){
            console.log($scope.posts[i]);
            if($scope.posts.uID == uID){
                $scope.myPosts.push($scope.posts[i]);                
            }
        }
    }
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
    var newPost = {
       title: $scope.titleInput,
       description: $scope.descriptionInput,
       role: $scope.roleInput,
       uID: uID,
       postNR: uID + "_" + countPosts()
    };
        $scope.titleInput = "";
        $scope.descriptionInput = "";
        $scope.roleInput = "";        
        console.log("in create post"); 
        console.log(newPost);
        $http.post("http://localhost:3000/fireapi/posts/" + newPost.postNR, newPost)
        .then(function(newPost){
             
            console.log("new post added" );
            console.log(newPost);           
            $scope.$apply(); 
        })
        .catch(function(err){       
            console.log("post niet gelukt", err);
        });
    }  
    $scope.deletePost = function(args){
        postRef.orderByChild("postNR").equalTo(args.toString()).on("child_added", function(snapshot)
        {           
            var post = snapshot.val();
        /*    console.log(snapshot.key());
            $http({
                method: 'DELETE',
                url:'http://localhost:3000/fireapi/deletepost',
                data:snapshot.key()                
            }) ; */
           $http.delete("http://localhost:3000/fireapi/posts/"+ post.postNR,
           {
            key:snapshot.key()
           })
            .then(function(data){
                console.log(data);
            })
            .catch(function(err){
                console.log("error", err);
            }) 
        });
        
      
    }

 /*   $scope.createPost = function(){

        postRef.push({
            title: $scope.titleInput,
            description: $scope.descriptionInput,
            role: $scope.roleInput,
            uID: uID,
            postNR: uID+"_"+ countPosts()
        });
        $scope.$apply();
    }  */

   /* postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();
        if(post.uID == uID){
            console.log(post.uID);
            $scope.posts.push(post);
            console.log(post.role,  post.description,  post.title, snapshot.key());
        }
        
        $scope.$digest();
    }); */

    $scope.showPosts = function(args){
        $scope.myPosts = [];

        postRef.on('child_added', function(snapshot) {
        var post = snapshot.val();                    
            if(args === "mine"){
                if(post.uID == uID)
                    $scope.myPosts.push(post);        
            }
          /*  else{
                $scope.posts.push(post);    
            }c*/                    
        
        //$scope.$digest();
        $scope.$apply();
    });        
    }

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

