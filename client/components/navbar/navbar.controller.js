'use strict';

angular.module('myreaderApp')
  .controller('NavbarCtrl', function ($scope, $location, $state, Auth) {
    // $scope.menu = [{
    //   'title': 'Home',
    //   'link': '/'
    // },
    // {
    //   'title': '分类',
    //   'link': '/cate/'
    // }];
    $scope.menu = [];
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.gotosearch = function(){
      $state.go('searchbook')
    }
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });