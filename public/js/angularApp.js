


// Declare app level module which depends on filters, and services

var myApp = angular.module("myApp", ['ngRoute', 'ngResource'])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/main', {
      templateUrl: 'partials/main',
      controller:'myCtrl'
    }).
    when('/test', {
      templateUrl: 'partials/test',
      controller: 'myCtrl'
    }).
    otherwise({
      redirectTo: '/main'
    });

  $locationProvider.html5Mode(true);
});





myApp.controller("myCtrl", function ($scope){
	$scope.test = "testing";


});


// var app = angular.module('myApp', []).
// config(function ($routeProvider, $locationProvider) {
//   $routeProvider.
//     when('/view1', {
//       templateUrl: 'partials/partial1',
//       controller: 'MyCtrl1'
//     }).
//     otherwise({
//       redirectTo: '/view1'
//     });

//   $locationProvider.html5Mode(true);
// }).

// /* Controllers */

// controller('AppCtrl', function ($scope, $http) {

// $http({
//   method: 'GET',
//   url: '/api/name'
// }).
// success(function (data, status, headers, config) {
//   $scope.name = data.name;
// }).
// error(function (data, status, headers, config) {
//   $scope.name = 'Error!';
// });



