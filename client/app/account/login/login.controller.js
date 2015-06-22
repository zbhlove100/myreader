'use strict';

angular.module('myreaderApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(user) {
          // Logged in, redirect to home

          
          $location.path('/sysadmin');
          
          
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
