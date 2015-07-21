app.factory("FB", function($firebaseArray, $firebaseObject, $firebaseAuth){
  var ref = new Firebase('https://newhorizons.firebaseio.com');

  var FB = {
    posts: function(){
      return ref.child("posts");
    },
    postsAr: function(){
      return $firebaseArray(ref.child("posts"));
    },
    postOb: function(item){
      return $firebaseObject(ref.child("posts").child(item));
    },
    pointsAr: function(){
      return $firebaseArray(ref.child("points"));
    },
    point: function(item){
      return ref.child("points").child(item);
    },
    pointOb: function(item){
      return $firebaseObject(ref.child("points").child(item));
    },
    commentsOb: function(item){
      return $firebaseObject(ref.child("comments").child(item));
    },
    commentsAr: function(item){
      return $firebaseArray(ref.child("comments").child(item));
    },
    commentOb: function(item, item2){
      return $firebaseObject(ref.child("comments").child(item).child(item2));
    },
    commentPoints: function(item, item2){
      return ref.child("commentPoints").child(item).child(item2);
    },
    commentPointsOb: function(item){
      return $firebaseObject(ref.child("commentPoints").child(item));
    },
    profile: function(){
      return ref.child("profile");
    },
    searchUser: function(item){
      return ref.child("profile").orderByChild("nameLow").equalTo(item);
    },
    profileOb: function(item){
      return $firebaseObject(ref.child("profile").child(item));
    },
    auth: function(){
      return $firebaseAuth(ref);
    }
  };

  return FB;
});
