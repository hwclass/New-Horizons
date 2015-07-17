app.controller('AddController',
    function($scope, $location, Auth, toaster, FB) {

        $scope.posts = FB.postsAr();

        var currentUser = Auth.user.profile;

        var base = function (item){
            var parser = document.createElement('a');
            parser.href = item;

            return parser.hostname;
        };

        $scope.technology = false;
        $scope.science = false;

        var isUnique = function(item){
          var list = $scope.posts;
          if(list.length == 0){
            return true;
          }
          for(var i=0; i < list.length; i++){
            if(list[i][item] == $scope[item]){
              if(item == "link"){
                toaster.pop('error',"This link was already shared!");
                return false;
              }else if(item == "title"){
                toaster.pop('error',"This title was already shared!");
                return false;
              }
            }else{
              return true;
            }
          }
        }

        $scope.NewPost = function(){

          if(isUnique("link") && isUnique("title")){
            $scope.posts.$add(
                {
                    "link": $scope.link,
                    "title": $scope.title,
                    "categories": {technology: $scope.technology, science: $scope.science},
                    "linkBase": base($scope.link),
                    "date": Firebase.ServerValue.TIMESTAMP,
                    "user": currentUser.name,
                    "userId": currentUser.id,
                    "numberOfPoint": 0,
                    "lastPoint":0,
                    "numberOfComment":0
                }
            );

            toaster.pop('success',"Link was added successfully!");
            $location.path('/');
          }
        }
    }
);
