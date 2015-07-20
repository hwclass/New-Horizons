app.factory("GivePoint", function(Auth, $location, toaster, FB){
  var GivePoint = {
    givePoint: function(postId, commentId){
        var currentUser = Auth.user.profile;
        var control;
        if(currentUser){
            var postPoint;

            if(commentId){
              postPoint = FB.commentsPoints(postId, commentId);
            }else{
              postPoint = FB.point(postId);
            }
            var id = currentUser.id;
            postPoint.once('value', function (snapshot){
                if(!snapshot.hasChild(id)){
                    var newPoint = postPoint.child(id);

                    newPoint.set({
                        "user": currentUser.name,
                        "userId": currentUser.id,
                        "date": Firebase.ServerValue.TIMESTAMP
                    });

                    control=true;
                }else{
                  toaster.pop('error',"You already gave point.");
                  control=false;
                }
            });
        }else{
            $location.path('/sign-in');
            toaster.pop('error',"You should sign in for to give point.");
            control=false;
        }
        return control;
    }
  };

  return GivePoint;
});
