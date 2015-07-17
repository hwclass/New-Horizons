var app = angular.module('NewHorizonsApp', ["firebase","ui.router", "angularMoment", "toaster", "ngAnimate"]);

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

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
