var app = angular.module('hackathon',['ngRoute','ngMaterial','ngAnimate','ngAria','ngMessages','mainCtrl','mainService','mainService'])


app.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'app/views/login.html',
            controller:'loginCtrl as login',
            authenticated:false
        })
        .when('/hackathon', {
            templateUrl: 'app/views/form.html',
            controller : 'formCtrl as userform',
            authenticated:true
        })
        .when('/verify/:vtoken', {
            templateUrl: 'app/views/done.html',
            authenticated:true
        })
        .when('/data', {
            templateUrl: 'app/views/data.html',
            controller : 'dataCtrl as data',
            authenticated:-1
        })
        .when('/', {
            templateUrl: 'app/views/about.html',
            authenticated:false
        })
        .otherwise({
            redirectTo:'/'
        });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});

app.controller('mainCtrl', function($scope){
	$scope.number = 1;
    
	$scope.check = function () {
		$scope.number = $scope.selectedno;
		console.log($scope.number);
		$scope.getNumber = function(num) {
		    return new Array(num);   
		}
	};

});

app.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthTokenInject');
})


// app.run(["$rootScope","Auth","$location",function($rootScope,Auth,$location){
//     $rootScope.$on("$routeChangeStart",function(event,next,current){
//         console.log(next.$$route.authenticated);


//         // if(next.$$route.authenticated==true){
//         //     if(!Auth.isLoggedIn()){
//         //         event.preventDefault();
//         //         $location.path("/");
//         //     }
//         // }else if(next.$$route.authenticated==false){
//         //     if(Auth.isLoggedIn()){
//         //         event.preventDefault();
//         //         $location.path("/login");
//         //     }
//         // }else{
//         //     console.log("authentication doesn't matter");
//         // }
//     });

// }]);