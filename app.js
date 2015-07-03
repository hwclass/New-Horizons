var app = angular.module('KesfetApp', ["firebase","ui.router", "angularMoment"]);

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


app.controller('ListController',
    function($scope, ref, $firebaseArray, $firebaseObject, Auth, $location){
        $scope.posts = $firebaseArray(ref.child("posts"));
        $scope.puanlar = $firebaseArray(ref.child("puanlar"));

        $scope.predicate = "-sonPuan";
        var currentUser = Auth.user.profile;

        $scope.yorumsay = function(item){
            var sayi = 0;

            for(i in item){sayi++}

            return sayi;
        };

        $scope.son24Puan = function(item){
            item.sonPuan = 0;
            var suAn = Firebase.ServerValue.TIMESTAMP;
            var myDate = Firebase.ServerValue.TIMESTAMP-86400;
            //myDate.setHours(myDate.getHours() - 24);

            var sayi = 0;
            for(i in item.puan){
                sayi++;
            }

            for(var i = 0; i<sayi;i++){
                if(myDate < item.puan[i].tarih && item.puan[i].tarih < suAn){
                    item.sonPuan++;
                }
            }

        };


        $scope.puanVer = function(item){

            var postPuan = ref.child("puanlar").child(item);
            var post = $firebaseObject(ref.child("posts").child(item));
            var id = currentUser.id;

            if(currentUser){
                postPuan.once('value', function (snapshot){
                    if(!snapshot.hasChild(id)){
                        var yeniPuan = $firebaseArray(postPuan.child(id));

                        yeniPuan.$add({
                            "puanSahibi": currentUser.name,
                            "puanTarihi": Firebase.ServerValue.TIMESTAMP

                        });

                        post.puanSayisi++;
                        post.$save();

                    }else{
                        console.log("Zateen puan vermişsin.");
                    }
                });
            }else{
                $location.path('/kayit');
            }


        };



    }
);

app.controller('LinkController',
    function($scope, ref, $stateParams, $firebaseObject, $firebaseArray, Auth, $location){
        var postId = $stateParams.postId;

        var post = $firebaseObject(ref.child("posts").child(postId));
        var yorumlar = $firebaseArray(ref.child("posts").child(postId).child("yorumlar"));


        $scope.post = post;

        var currentUser = Auth.user.profile;

        $scope.yorumsay = function(item){
            var sayi = 0;

            for(i in item){sayi++}

            return sayi;
        };

        $scope.yorumYap = function(){
            if(currentUser){
                yorumlar.$add({
                    "yorumSahibi": currentUser.name,
                    "yorumSahibiId": currentUser.id,
                    "yorumTarihi": Firebase.ServerValue.TIMESTAMP,
                    "text": $scope.yorum
                });

                $scope.yorum = "";
            }else{
                $location.path('/kayit');
            }
        };

        $scope.puanVer = function(){
            if(currentUser){
                var postPuan = ref.child("puanlar").child(postId);
                var id = currentUser.id;
                postPuan.once('value', function (snapshot){
                    if(!snapshot.hasChild(id)){
                        var yeniPuan = $firebaseArray(postPuan.child(id));

                        yeniPuan.$add({
                            "puanSahibi": currentUser.name,
                            "puanTarihi": Firebase.ServerValue.TIMESTAMP

                        });

                        $scope.post.puanSayisi++;
                        $scope.post.$save();
                    }else{
                        console.log("Zateen puan vermişsin.");
                    }
                });
            }else{
                $location.path('/kayit');
            }
        };
    }
);

app.controller('AddController',
    function($scope, ref, $location, $firebaseArray, Auth) {

        $scope.posts = $firebaseArray(ref.child("posts"));

        var currentUser = Auth.user.profile;

        var base = function (item){
            var parser = document.createElement('a');
            parser.href = item;

            return parser.hostname;
        };

        $scope.teknoloji = false;
        $scope.bilim = false;


        $scope.NewPost = function(){

            $scope.posts.$add(
                {
                    "link": $scope.link,
                    "linkad": $scope.baslik,
                    "kategoriler": {teknoloji: $scope.teknoloji, bilim: $scope.bilim},
                    "linkkok": base($scope.link),
                    "tarih": Firebase.ServerValue.TIMESTAMP,
                    "kesfeden": currentUser.name,
                    "kesfedenId": currentUser.id,
                    "puanSayisi": 0,
                    "sonPuan":1

                }
            );

            $location.path('/');
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

app.controller('AuthController', function($scope, $location, Auth){
    $scope.register = function(user){
        Auth.register(user).then(function(){
            console.log("Register successfully!");
            $location.path('/');
        }, function(err){
            console.log("Error...");
        });
    };

    $scope.login = function(user){
        Auth.login(user)
            .then(function(){
                console.log("Logged seccessfully!");
                $location.path('/');
            }, function(err){
                console.log("Error...");
            });
    }

});

app.controller('NavController', function($scope, $location, Auth){
    $scope.signedIn = Auth.signedIn;

    $scope.logout= function(){
        Auth.logout();
        console.log("Logged out!");
        $location.path('/');
    }
});