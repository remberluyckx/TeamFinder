
var app = angular.module("myProfile", []);

app.controller("profileController", function ($scope) {
var ref = new Firebase("https://boiling-torch-9537.firebaseio.com");
var usersRef = ref.child("users");
//$scope.username = "test";
var key = null;
var pageLoaded = true;
$scope.user;
$scope.username;
$scope.firstName ;
$scope.lastName ;


var authData = ref.getAuth();
var uID = authData.uid;

console.log("uid:" , uID);

// get logged in user
/*usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function(snapshot){
		key = snapshot.key();
		console.log("in here");
		$scope.user = snapshot.val();
		if($scope.user){
		$scope.username =  $scope.user.first_name + " " + $scope.user.last_name;
		console.log("snapshot: " , $scope.user);
		console.log("username: ", $scope.username);		
	}
		
		//$scope.$digest();
	}); */


	$scope.$watch("user",function(newValue,oldValue) {
        if(newValue !== oldValue && newValue !== null){
        	$scope.username = newValue.first_name+ " " + newValue.last_name;
        	console.log("oldValue value: ", oldValue);
        	console.log("new Value: ", newValue);
        }
    }, true);
var getUserName = function(){
	usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function(snapshot){
		key = snapshot.key();
		$scope.user = snapshot.val();
		if($scope.user){
			$scope.username =  $scope.user.first_name;	
		}
		if(pageLoaded){
			$scope.$digest();
			pageLoaded = false;
		}
		
		//key();		
		console.log("went through 1st getUserName()");		
		console.log("username: ", $scope.username);
	})	
	console.log("went through 2nd getUserName()");
}

$scope.showUserName = function(){
	getUserName();

	console.log("show name: ", $scope.username);
}
 


// push/set userData
$scope.saveProfile = function(){
console.log("firstname: ", $scope.user.first_name);	
console.log("key: ", key);
if($scope.user.first_name === null ) $scope.user.first_name = "";
if($scope.user.last_name === null ) $scope.user.last_name = "";
if($scope.user.specialty === null) $scope.user.specialty = "";
	//$scope.user.uid;

	//usersRef.orderByChild("uid").equalTo(uID.toString()).on("child_added", function(snapshot){
	//		console.log("snapshot: ", snapshot.key() );
	//		key = snapshot.key()
			//console.log("Key: ", key);
			if(!$scope.user ){
					
				usersRef.push({
						uid: uID,
						first_name: $scope.firstName,
						last_name: $scope.lastName,
						specialty: $scope.specialty
				});
				console.log("saved new profile");
				}
				else {
					//console.log("key: ", key)
					usersRef.child(key).set({	
						uid: $scope.user.uid,					
						first_name: $scope.user.first_name,
						last_name: $scope.user.last_name,
						specialty: $scope.user.specialty
					});
	
					console.log("updated profile");
				}
	//	});			
}
$scope.removeProfile = function(){
	usersRef.child(key).remove();
}

$scope.deleteAccount = function(){
	email = ref.getAuth().password.email;	 
    password = $scope.loginPassword;
    ref.removeUser({
        email    : email,
        password : password
    }, function(error) {
        if (error === null) {
        	usersRef.child(key).remove();
            console.log("User removed successfully");
        } else {
            console.log("Error removing user:", error);
        }
    });
}

getUserName();
});