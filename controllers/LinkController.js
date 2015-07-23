app.controller('LinkController',
    function($scope, $stateParams, Auth, $location, toaster, GivePoint, FB){
        var postId = $stateParams.postId;

        var post = FB.postOb(postId);
        $scope.comments = FB.commentsAr(postId);
        var points = FB.pointOb(postId);
        var comments = FB.commentsOb(postId);
        var commentPoints = FB.commentPointsOb(postId);

        $scope.post = post;

        $scope.postComment = function(){
          var currentUser = Auth.user.profile;
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
                currentComment.$loaded().then(function(item){
                  item.numberOfPoint++;
                  item.$save();
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
          var currentUser = Auth.user.profile;
          if(currentUser){
            return currentUser.id == post.userId || currentUser.id == "simplelogin:1";
          }else{
            return false;
          }
        }

        $scope.delete = function() {
            points.$remove();
            comments.$remove();
            commentPoints.$remove();
            post.$remove();
            toaster.pop('success',"Link was deleted successfully!");
            $location.path('/');
        };

        $scope.deleteComment = function(item, item2){
          var currentComment = FB.commentOb(item, item2);
          currentComment.$destroy();
          currentComment.$save();
          var currentPost = FB.postOb(item);
          currentPost.$loaded().then(function(item){
            item.numberOfComment--;
            item.$save();
          });
        };

        $scope.showCommentDelete = function(item){
          var currentUser = Auth.user.profile;
          if(currentUser === undefined){
            return false;
          }else if(item == currentUser.name || currentUser.id == "simplelogin:1"){
            return true;
          }
        }
});
