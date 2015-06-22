'use strict';

angular.module('myreaderApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ngUnderscore',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  .filter('statusfilter', function () {
    return function (item) {
        return item==0?"连载中":"完结";
    };
  })
  .filter('replaceChineseSymbol', function () {
    return function (item) {
        return item.replace(/—/g,'-');
    };
  })
  // .directive('loading',   ['$http' ,function ($http)
  //   {
  //       return {
  //           restrict: 'A',
  //           template: '<div class="loading"><i class="fa fa-spinner fa-pulse"></i>LOADING...</div>',
  //           link: function (scope, elm, attrs)
  //           {
  //               scope.isLoading = function () {
  //                   return $http.pendingRequests.length > 0;
  //               };
 
  //               scope.$watch(scope.isLoading, function (v)
  //               {
  //                   if(v){
  //                       //$('.loading-modal').modal('show');
  //                       elm.show();
  //                   }else{
  //                       //$('.loading-modal').modal('hide');
  //                       elm.hide();
  //                   }
  //               });
  //           }
  //       }
  //     }
  //   ])
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });