'use strict';

angular.module('myreaderApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shudan', {
        url: '/shudan',
        templateUrl: 'app/shudan/shudan.html',
        controller: 'ShudanCtrl'
      });
      
      $stateProvider
      .state('shudanDetail', {
        url: '/shudan/:id',
        templateUrl: 'app/shudan/shudanDetail.html',
        controller: 'ShudanDetailCtrl'
      });
  });