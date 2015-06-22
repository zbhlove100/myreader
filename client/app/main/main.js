'use strict';

angular.module('myreaderApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
      $stateProvider
      .state('cate', {
        url: '/cate',
        templateUrl: 'app/main/cate.html',
        controller: 'CateCtrl'
      });
      $stateProvider
      .state('bookcate', {
        url: '/cate/:cate_code',
        templateUrl: 'app/main/bookcate.html',
        controller: 'BookCateCtrl'
      });
      $stateProvider
      .state('bookdetail', {
        url: '/bookdetail/:id',
        templateUrl: 'app/main/bookdetail.html',
        controller: 'BookDetailCtrl'
      });
      $stateProvider
      .state('readcapture', {
        url: '/readcapture/:id',
        templateUrl: 'app/main/readcapture.html',
        controller: 'ReadCaptureCtrl'
      });
      $stateProvider
      .state('searchbook', {
        url: '/search',
        templateUrl: 'app/main/searchbook.html',
        controller: 'SearchBookCtrl'
      });
      
  });