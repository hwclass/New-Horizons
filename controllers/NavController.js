app.controller('NavController', function($scope, $location, Auth, toaster){
    $scope.signedIn = Auth.signedIn;

    $scope.logout= function(){
        Auth.logout();
        toaster.pop('success',"Logged out!");
        $location.path('/');
    }
});
