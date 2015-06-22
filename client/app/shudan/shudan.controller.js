'use strict';

angular.module('myreaderApp')
  .controller('ShudanCtrl', function ($scope, $http,underscore) {
    $scope.shudans = [];
    $scope.searchname ="";
    $scope.page = 0;
    $scope.nomore = true;
    $scope.loadmore = function(){
    	$scope.page +=1;
    	$http.get('/api/shudans?searchname='+$scope.searchname+'&page='+$scope.page).success(function(shudans) {
    		if(shudans.length ==0){
          $scope.nomore = true;
        }else{
          $scope.nomore = false;
          $scope.shudans = $scope.shudans.concat(shudans)
        }
        
	    });
    }
    $scope.searchshudan = function(){
    	$scope.page =0;
    	$http.get('/api/shudans?searchname='+$scope.searchname+'&page='+$scope.page).success(function(shudans) {
	      $scope.shudans = shudans;
        if(shudans.length == 0){
            $scope.nomore = true;
          }else{
            $scope.nomore = false;
          }
	    });
    }
    $http.get('/api/shudans').success(function(shudans) {
      $scope.shudans = shudans;
      if(shudans.length == 0){
          $scope.nomore = true;
        }else{
          $scope.nomore = false;
        }
    });
  })
  .controller('ShudanDetailCtrl', function ($scope, $stateParams, $http, $location, $anchorScroll, underscore) {
    $scope.shudan = {}
    $scope.gototop = function(){
      $location.hash('top');

      // call $anchorScroll()
      $anchorScroll();
    }
    $http.get('/api/shudans/'+$stateParams.id).success(function(shudan) {
      $scope.shudan = shudan;
    });
  })
  ;
