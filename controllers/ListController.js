app.controller('ListController',
    function($scope, $location, toaster, GivePoint, FB){
        $scope.posts = FB.postsAr();
        $scope.puanlar = FB.pointsAr();

        $scope.currentPage = 0;
        $scope.pageSize = 10;

        $scope.posts.$loaded().then(function(item) {
          $scope.numberOfPages=function(){
            return Math.ceil(item.length/$scope.pageSize);
          }
        });

        $scope.predicate = "-lastPoint";

        $scope.givePoint = function(item){
            if(GivePoint.givePoint(item)){
              var currentPost = FB.postOb(item);
              currentPost.$bindTo($scope, "data").then(function() {
                $scope.data.numberOfPoint++;
              });
            }
        };

        var postRef = FB.posts();

        postRef.once('value', function(snapshot) {
          var now = moment();
          snapshot.forEach(function(childSnapshot) {
            var child = childSnapshot.val();
            var postTime = moment(child.date);
            var hours = moment.duration(now - postTime).asHours();

            var num = child.numberOfPoint-1;
            var newhours = hours + 2.00;

            var denum = Math.pow(newhours, 1.8);
            var result = num/denum;

            childSnapshot.ref().update({ lastPoint: result });
          });
        });


    }
);
