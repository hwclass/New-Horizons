var app = angular.module('NewHorizonsApp', ["firebase","ui.router", "angularMoment", "toaster", "ngAnimate"]);

app.run(function(amMoment) {
    amMoment.changeLocale('en');
});

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("/", {
            url: '/',
            templateUrl: "pages/home.html",
            controller: "ListController",
            data : { pageTitle: 'New Horizons' }
        })
        .state("register", {
            url: '/register',
            templateUrl: "pages/register.html",
            controller: "AuthController",
            data : { pageTitle: 'New Horizons - Register' }
        })
        .state("sign-in", {
            url: '/sign-in',
            templateUrl: "pages/sign-in.html",
            controller: "AuthController",
            data : { pageTitle: 'New Horizons - Sign In' }
        })
        .state("reset-pass", {
            url: '/reset-pass',
            templateUrl: "pages/reset-pass.html",
            controller: "AuthController",
            data : { pageTitle: 'New Horizons - Reset Password' }
        })
        .state("change-pass", {
            url: '/change-pass',
            templateUrl: "pages/change-pass.html",
            controller: "AuthController",
            data : { pageTitle: 'New Horizons - Change Password' }
        })
        .state("share-link", {
            url: '/share-link',
            templateUrl: "pages/share-link.html",
            controller: "AddController",
            data : { pageTitle: 'New Horizons - Share Link' }
        })
        .state("link", {
            url: '/link/:postId',
            templateUrl: "pages/link.html",
            controller: "LinkController",
            data : { pageTitle: 'New Horizons - Link' }
        });
});

// Filter for textarea
app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.run([ '$rootScope', '$state', '$stateParams',
function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);
