'use strict';

angular.module('myreaderApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/sysadmin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .state('admin.book', {
        url: '/book',
        templateUrl: 'app/admin/bookAdmin.html',
        controller: 'AdminBookCtrl'
      })
      .state('admin.shudan', {
        url: '/shudan',
        templateUrl: 'app/admin/shudan/list.html',
        controller: 'AdminShudanCtrl'
      })
      .state('admin.createshudan', {
        url: '/createshudan',
        templateUrl: 'app/admin/shudan/create.html',
        controller: 'createShudanCtrl'
      })
      .state('admin.editshudan', {
        url: '/editshudan/:id',
        templateUrl: 'app/admin/shudan/edit.html',
        controller: 'editShudanCtrl'
      })
      ;
  });