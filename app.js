var app = angular.module('KesfetApp', ["firebase","ui.router", "angularMoment", "toaster", "ngAnimate"]);

app.run(function(amMoment) {
    amMoment.changeLocale('tr');
});

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("/", {
            url: '/',
            templateUrl: "pages/home.html",
            controller: "ListController"
        })
        .state("register", {
            url: '/register',
            templateUrl: "pages/register.html",
            controller: "AuthController"
        })
        .state("sign-in", {
            url: '/sign-in',
            templateUrl: "pages/sign-in.html",
            controller: "AuthController"
        })
        .state("reset-pass", {
            url: '/reset-pass',
            templateUrl: "pages/reset-pass.html",
            controller: "AuthController"
        })
        .state("change-pass", {
            url: '/change-pass',
            templateUrl: "pages/change-pass.html",
            controller: "AuthController"
        })
        .state("share-link", {
            url: '/share-link',
            templateUrl: "pages/share-link.html",
            controller: "AddController"
        })
        .state("link", {
            url: '/link/:postId',
            templateUrl: "pages/link.html",
            controller: "LinkController"
        });
});

app.factory("Getir", function($firebaseArray, $firebaseObject, $firebaseAuth){
  var ref = new Firebase('https://kesfet-io.firebaseio.com');

  var Getir = {
    posts: function(){
      return ref.child("posts");
    },
    postsAr: function(){
      return $firebaseArray(ref.child("posts"));
    },
    postOb: function(item){
      return $firebaseObject(ref.child("posts").child(item));
    },
    puanlarAr: function(){
      return $firebaseArray(ref.child("puanlar"));
    },
    puanlarOb: function(item){
      return $firebaseObject(ref.child("puanlar").child(item));
    },
    puan: function(item){
      return ref.child("puanlar").child(item);
    },
    puanOb: function(item){
      return $firebaseObject(ref.child("puanlar").child(item));
    },
    yorumlarOb: function(item){
      return $firebaseObject(ref.child("yorumlar").child(item));
    },
    yorumlarAr: function(item){
      return $firebaseArray(ref.child("yorumlar").child(item));
    },
    yorumOb: function(item, item2){
      return $firebaseObject(ref.child("yorumlar").child(item).child(item2));
    },
    yorumPuan: function(item, item2){
      return ref.child("yorumlar").child(item).child(item2).child("yorumPuanlar");
    },
    profiler: function(){
      return ref.child("profile");
    },
    uyeCek: function(item){
      return ref.child("profile").orderByChild("nameLow").equalTo(item);
    },
    profilOb: function(item){
      return $firebaseObject(ref.child("profile").child(item));
    },
    auth: function(){
      return $firebaseAuth(ref);
    }
  };

  return Getir;
});

app.factory("PuanVerme", function(Auth, $location, toaster, Getir){
  var puanVerme = {
    puanVer: function(postid, yorumid){
        var currentUser = Auth.user.profile;
        var kontrol;
        if(currentUser){
            var postPuan;
            var sonPuanlar;
            if(yorumid){
              postPuan = Getir.yorumPuan(postid, yorumid);
            }else{
              postPuan = Getir.puan(postid);
            }
            var id = currentUser.id;
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
            kontrol=false;
        }
        return kontrol;
    }
  };

  return puanVerme;
});

app.controller('ListController',
    function($scope, $location, toaster, PuanVerme, Getir){
        $scope.posts = Getir.postsAr();
        $scope.puanlar = Getir.puanlarAr();

        $scope.currentPage = 0;
        $scope.pageSize = 10;

        $scope.posts.$loaded().then(function(item) {
          $scope.numberOfPages=function(){
            return Math.ceil(item.length/$scope.pageSize);
          }
        });

        $scope.predicate = "-puanSayisi";

        $scope.puanVer = function(item){
            if(PuanVerme.puanVer(item)){
              var postam = Getir.postOb(item);
              postam.$bindTo($scope, "data").then(function() {
                $scope.data.puanSayisi++;
              });
            }
        };


    }
);

app.controller('LinkController',
    function($scope, $stateParams, Auth, $location, toaster, PuanVerme, Getir){
        var postId = $stateParams.postId;

        var post = Getir.postOb(postId);
        $scope.yorumlar = Getir.yorumlarAr(postId);
        var puanlar = Getir.puanOb(postId);
        var yorumlar = Getir.yorumlarOb(postId);

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
                var yorum = Getir.yorumOb(item, item2);
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
            return currentUser.id == post.kesfedenId || currentUser.id == "simplelogin:42";
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

        $scope.yorumSil = function(item, item2){
          var yorum = Getir.yorumOb(item, item2);
          yorum.$destroy();
          yorum.$save();
          var yazi = Getir.postOb(item);
          yazi.$bindTo($scope, "data").then(function() {
            $scope.data.yorumSayisi--;
          });
        };

        $scope.yorumSilGoster = function(item){
          if(item == currentUser.name || currentUser.name == "Mert"){
            return true;
          }
        }
    }
);

app.controller('AddController',
    function($scope, $location, Auth, toaster, Getir) {

        $scope.posts = Getir.postsAr();

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
          console.log(currentUser);

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

app.factory('Auth', function(Getir){

    var auth = Getir.auth();

    var Auth = {
        user: {},

        createProfile: function(uid, user){
            var profile = {
                name: user.name,
                email: user.email,
                nameLow: user.name.toLowerCase(),
                id: uid
            };

            var profileRef = Getir.profiler();

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
            Auth.user.profile = Getir.profilOb(authData.uid);
        }else{
            if(Auth.user && Auth.user.profile){
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    return Auth;

});

app.controller('AuthController', function($scope, $location, Auth, toaster, Getir, $q){
    /*if(Auth.signedIn()){
      $location.path('/');
    }*/

    $scope.register = function(user){
        var userNameLow = user.name.toLowerCase();
        var uyeList = Getir.uyeCek(userNameLow);
        var def = $q.defer();

        var deger = function(){
          uyeList.once('value', function(snapshot){
            def.resolve(snapshot.val());
          });
            return def.promise;
        }

        deger().then(function(whatIWant){
          if(whatIWant === null){
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
          }else{
            toaster.pop('error',"Bu kullanıcı adı ile daha önce kayıt olunmuş.");
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
