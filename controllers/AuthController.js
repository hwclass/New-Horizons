app.controller('AuthController', function($scope, $location, Auth, toaster, FB, $q){
    /*if(Auth.signedIn()){
      $location.path('/');
    }*/

    $scope.register = function(user){
        var userNameLow = user.name.toLowerCase();
        var searcOnList = FB.searchUser(userNameLow);
        var def = $q.defer();

        var check = function(){
          searcOnList.once('value', function(snapshot){
            def.resolve(snapshot.val());
          });
            return def.promise;
        }

        check().then(function(whatIWant){
          if(whatIWant === null){
            Auth.register(user).then(function(){
                toaster.pop('success',"Register successfully!");
                $location.path('/');
              }, function(error){
                switch (error.code) {
                   case "EMAIL_TAKEN":
                     toaster.pop('error',"There is an another user with this email.");
                     break;
                   case "INVALID_EMAIL":
                     toaster.pop('error',"Invalid e-mail address.");
                     break;
                   default:
                     toaster.pop('error',"Error logging user in:", error);
                 }
            });
          }else{
            toaster.pop('error',"There is an another user with this username.");
          }
        });
    };

    $scope.login = function(user){
        Auth.login(user)
            .then(function(){
                toaster.pop('success',"Logged successfully!");
                $location.path('/');
            }, function(error){
              switch (error.code) {
                 case "INVALID_EMAIL":
                   toaster.pop('error',"The specified user account email is invalid.");
                   break;
                 case "INVALID_PASSWORD":
                   toaster.pop('error',"The specified user account password is incorrect.");
                   break;
                 case "INVALID_USER":
                   toaster.pop('error',"The specified user account does not exist.");
                   break;
                 default:
                   toaster.pop('error',"Error logging user in:", error);
               }
            });
    };

    $scope.resetPass = function(email){
      Auth.resetPass(email).then(function(error) {
        if (error) {
          console.log("Error sending password reset email:", error);
        } else {
          toaster.pop('success',"Password reset email sent successfully");
          $location.path('/login');
        }
      });
    };

    $scope.changePassword = function(user){
      Auth.changePassword(user)
        .then(function(){
          $scope.user.email = "";
          $scope.user.oldpass = "";
          $scope.user.newpass = "";

          toaster.pop('success',"Password changed successfully!");
        }, function(error){
          console.log("Error...")
        });
    }

});
