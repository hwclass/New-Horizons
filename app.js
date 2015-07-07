var app = angular.module('KesfetApp', ["firebase","ui.router", "angularMoment", "toaster", "ngAnimate"]);

app.run(function(amMoment) {
    amMoment.changeLocale('tr');
});

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("/", {
            url: '/',
            templateUrl: "pages/home.html"
        })
        .state("kayit", {
            url: '/kayit',
            templateUrl: "pages/invitation.html",
            controller: "AuthController"
        })
        .state("giris", {
            url: '/giris',
            templateUrl: "pages/login.html",
            controller: "AuthController"
        })
        .state("unuttum", {
            url: '/unuttum',
            templateUrl: "pages/unuttum.html",
            controller: "AuthController"
        })
        .state("change", {
            url: '/change',
            templateUrl: "pages/change.html",
            controller: "AuthController"
        })
        .state("linkekle", {
            url: '/link-ekle',
            templateUrl: "pages/linkekle.html",
            controller: "ListController"
        })
        .state("link", {
            url: '/link/:postId',
            templateUrl: "pages/link.html",
            controller: "LinkController"
        });
});

app.factory("ref", function(){
    return new Firebase('https://kesfet-io.firebaseio.com');
});

app.factory("PuanVerme", function(ref, $firebaseArray, Auth, $location, toaster){
  var puanVerme = {
    puanVer: function(postid, yorumid){
        var currentUser = Auth.user.profile;
        if(currentUser){
            var postPuan;
            if(yorumid){
              postPuan = ref.child("yorumlar").child(postid).child(yorumid).child("yorumPuanlar");
            }else{
              postPuan = ref.child("puanlar").child(postid);
            }
            var id = currentUser.id;
            var kontrol;
            postPuan.once('value', function (snapshot){
                if(!snapshot.hasChild(id)){
                    var yeniPuan = postPuan.child(id);

                    yeniPuan.set({
                        "puanSahibi": currentUser.name,
                        "puanTarihi": Firebase.ServerValue.TIMESTAMP
                    });
                    kontrol=true;
                }else{
                  toaster.pop('error',"Zaten puan vermişsin!");
                  kontrol=false;
                }
            });
        }else{
            $location.path('/kayit');
            toaster.pop('error',"Puan vermek için giriş yapmalısınız.");
            kontrol= false;
        }
        return kontrol;
    }
  };

  return puanVerme;
});

app.controller('ListController',
    function($scope, ref, $firebaseArray, $firebaseObject, Auth, $location, toaster, PuanVerme){
        $scope.posts = $firebaseArray(ref.child("posts"));
        $scope.puanlar = $firebaseArray(ref.child("puanlar"));

        $scope.predicate = "-puanSayisi";

        $scope.puanVer = function(item){
            if(PuanVerme.puanVer(item)){
              var post = $firebaseObject(ref.child("posts").child(item));
              post.$bindTo($scope, "data").then(function() {
                $scope.data.puanSayisi++;
              });
            }
        };
    }
);

app.controller('LinkController',
    function($scope, ref, $stateParams, $firebaseObject, $firebaseArray, Auth, $location, toaster, PuanVerme){
        var postId = $stateParams.postId;

        var post = $firebaseObject(ref.child("posts").child(postId));
        $scope.yorumlar = $firebaseArray(ref.child("yorumlar").child(postId));
        var puanlar = $firebaseObject(ref.child("puanlar").child(postId));
        var yorumlar = $firebaseObject(ref.child("yorumlar").child(postId));

        $scope.post = post;

        var currentUser = Auth.user.profile;

        $scope.yorumYap = function(){
            if(currentUser){
                $scope.yorumlar.$add({
                    "yorumSahibi": currentUser.name,
                    "yorumSahibiId": currentUser.id,
                    "yorumTarihi": Firebase.ServerValue.TIMESTAMP,
                    "yorumPuanSayisi": 0,
                    "text": $scope.yorum
                });

                $scope.post.yorumSayisi++;
                $scope.post.$save();


                $scope.yorum = "";
            }else{
                $location.path('/kayit');
                toaster.pop('error',"Yorum yapmak için giriş yapmalısınız.");
            }
        };

        $scope.yorumPuanVer = function(item, item2){
            if(PuanVerme.puanVer(item, item2)){
                var yorum = $firebaseObject(ref.child("yorumlar").child(item).child(item2));
                yorum.$bindTo($scope, "data").then(function() {
                  $scope.data.yorumPuanSayisi++;
                });
            }
        };

        $scope.puanVer = function(item){
          if(PuanVerme.puanVer(item)){
            $scope.post.puanSayisi++;
            $scope.post.$save();
          }
        };

        $scope.silGoster = function(){
          if(currentUser){
            return currentUser.id == post.kesfedenId || currentUser.id == "simplelogin:43";
          }else{
            return false;
          }
        }

        $scope.sil = function() {
            post.$destroy();
            post.$save();
            yorumlar.$destroy();
            yorumlar.$save();
            puanlar.$destroy();
            puanlar.$save();
            toaster.pop('success',"Link başarıyla silindi!");
            $location.path('/');
        };
    }
);

app.controller('AddController',
    function($scope, ref, $location, $firebaseArray, Auth, toaster) {

        $scope.posts = $firebaseArray(ref.child("posts"));

        var currentUser = Auth.user.profile;

        var base = function (item){
            var parser = document.createElement('a');
            parser.href = item;

            return parser.hostname;
        };

        $scope.teknoloji = false;
        $scope.bilim = false;

        var isUnique = function(item){
          var list = $scope.posts;
          if(list.length == 0){
            return true;
          }
          for(var i=0; i < list.length; i++){
            if(list[i][item] == $scope[item]){
              if(item == "link"){
                toaster.pop('error',"Bu link daha önce eklenmiş!");
                return false;
              }else if(item == "baslik"){
                toaster.pop('error',"Bu başlık daha önce eklenmiş!");
                return false;
              }
            }else{
              return true;
            }
          }
        }

        $scope.NewPost = function(){

          if(isUnique("link") && isUnique("baslik")){
            $scope.posts.$add(
                {
                    "link": $scope.link,
                    "baslik": $scope.baslik,
                    "kategoriler": {teknoloji: $scope.teknoloji, bilim: $scope.bilim},
                    "linkkok": base($scope.link),
                    "tarih": Firebase.ServerValue.TIMESTAMP,
                    "kesfeden": currentUser.name,
                    "kesfedenId": currentUser.id,
                    "puanSayisi": 0,
                    "sonPuan":0,
                    "yorumSayisi":0
                }
            );

            toaster.pop('success',"Link başarıyla eklendi!");
            $location.path('/');
          }
        }
    }
);

app.factory('Auth', function(ref, $firebaseAuth, $firebaseObject){

    var auth = $firebaseAuth(ref);

    var Auth = {
        user: {},

        createProfile: function(uid, user){
            var profile = {
                name: user.name,
                email: user.email,
                id: uid
            };

            var profileRef = ref.child("profile");

            return profileRef.child(uid).set(profile);
        },

        login: function(user){
            return auth.$authWithPassword(
                {email: user.email, password: user.password}
            );
        },

        register: function(user){
            return auth.$createUser({email: user.email, password: user.password}).then(function(){
                return Auth.login(user);
            }).then(function(data){
                return Auth.createProfile(data.uid, user);
            });
        },

        logout: function(user){
            auth.$unauth();
        },

        changePassword: function(user){
            return auth.$changePassword({email: user.email, oldPassword: user.oldpass, newPassword: user.newpass});
        },

        resetPass: function(item){
          return auth.$resetPassword({email: item});
        },

        signedIn: function(){
            return !!Auth.user.provider;
        }
    };

    auth.$onAuth(function(authData){
        if(authData){
            angular.copy(authData, Auth.user);
            Auth.user.profile = $firebaseObject(ref.child("profile").child(authData.uid));
        }else{
            if(Auth.user && Auth.user.profile){
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    return Auth;

});

app.controller('AuthController', function($scope, $location, $firebaseArray, $firebaseObject, Auth, ref, toaster){
    /*if(Auth.signedIn()){
      $location.path('/');
    }*/

    $scope.register = function(user){
        Auth.register(user).then(function(){
            toaster.pop('success',"Register successfully!");
            $location.path('/');
        }, function(error){
            switch (error.code) {
               case "EMAIL_TAKEN":
                 toaster.pop('error',"Bu email ile daha önce kayıt olunmuş.");
                 break;
               case "INVALID_EMAIL":
                 toaster.pop('error',"Email adresiniz doğru yazılmamış.");
                 break;
               default:
                 toaster.pop('error',"Error logging user in:", error);
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

app.controller('NavController', function($scope, $location, Auth, toaster){
    $scope.signedIn = Auth.signedIn;

    $scope.logout= function(){
        Auth.logout();
        toaster.pop('success',"Logged out!");
        $location.path('/');
    }
});
