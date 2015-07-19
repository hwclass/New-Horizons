app.controller('LinkController',
    function($scope, $stateParams, Auth, $location, toaster, GivePoint, FB){
        var postId = $stateParams.postId;

        var post = FB.postOb(postId);
        $scope.comments = FB.commentsAr(postId);
        var points = FB.pointOb(postId);
        var comments = FB.commentsOb(postId);

        $scope.post = post;

        var currentUser = Auth.user.profile;

        $scope.postComment = function(){
            if(currentUser){
                $scope.comments.$add({
                    "user": currentUser.name,
                    "userId": currentUser.id,
                    "date": Firebase.ServerValue.TIMESTAMP,
                    "numberOfPoint": 0,
                    "text": $scope.comment.replace(/\r?\n/g, '<br />')
                });

                $scope.post.numberOfComment++;
                $scope.post.$save();


                $scope.comment = "";
            }else{
                $location.path('/sign-in');
                toaster.pop('error',"You should sign in for to comment.");
            }
        };

        $scope.commentGivePoint = function(item, item2){
            if(GivePoint.givePoint(item, item2)){
                var currentComment = FB.commentOb(item, item2);
                currentComment.$bindTo($scope, "data").then(function() {
                  $scope.data.numberOfPoint++;
                });
            }
        };

        $scope.givePoint = function(item){
          if(GivePoint.givePoint(item)){
            $scope.post.numberOfPoint++;
            $scope.post.$save();
          }
        };

        $scope.showDelete = function(){
          if(currentUser){
            return currentUser.id == post.userId || currentUser.id == "simplelogin:42";
          }else{
            return false;
          }
        }

        $scope.delete = function() {
            post.$remove();
            points.$remove();
            comments.$remove();
            toaster.pop('success',"Link was deleted successfully!");
            $location.path('/');
        };

        $scope.deleteComment = function(item, item2){
          var currentComment = FB.commentOb(item, item2);
          currentComment.$destroy();
          currentComment.$save();
          var currentPost = FB.postOb(item);
          currentPost.$bindTo($scope, "data").then(function() {
            $scope.data.numberOfComment--;
          });
        };

        $scope.showCommentDelete = function(item){
          if(item == currentUser.name || currentUser.name == "Mert"){
            return true;
          }
        }
});
