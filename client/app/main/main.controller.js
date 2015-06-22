'use strict';

angular.module('myreaderApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {
    $scope.books = [];
    $scope.shudans = [];
    var allbooks = [];
    var slidepage = 0;
    $scope.maincards =[
      {"name":"分类","image_url":"","action":"/cate","icon":"mdi-editor-format-list-bulleted"},
      {"name":"排行","image_url":"","action":"/rank","icon":"mdi-action-trending-up"},
      {"name":"精选","image_url":"","action":"/selection","icon":"mdi-av-equalizer"},
      {"name":"搜索","image_url":"","action":"/search","icon":"mdi-action-search"}
    ]
    $http.get('/api/books/mainpage').success(function(books) {
      allbooks = _.chain(books).groupBy(function(element, index){
                  return Math.floor(index/3);
                }).toArray()
                .value();
      $scope.books = allbooks[slidepage];
      // $interval(function(){
      //   slidepage = slidepage+1==3?0:slidepage+1;
      //   $scope.books = allbooks[slidepage];
      // },5000)
    });
    $http.get('/api/shudans/').success(function(shudans) {
      $scope.shudans = shudans;
    });
    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });

angular.module('myreaderApp')
  .controller('CateCtrl', function ($scope, $http) {
    $scope.cates = [];
    
    $http.get('/api/cates').success(function(cates) {
      $scope.cates = cates;
    });

  });
angular.module('myreaderApp')
  .controller('BookCateCtrl', function ($scope, $stateParams, $http) {
    var cate_code = $stateParams.cate_code
    $scope.books = [];
    $scope.page = 0;
    $scope.loadmorebook = function(){
      $scope.page +=1;
      $http.get('/api/books/cate/'+cate_code+'?page='+$scope.page).success(function(books) {
        angular.forEach(books, function(value, key){
          $scope.books.push(value)
        });
      });
    }
    $http.get('/api/books/cate/'+cate_code).success(function(books) {
      $scope.books = books;

      
    });

  });
angular.module('myreaderApp')
  .controller('BookDetailCtrl', function ($scope, $stateParams, $http, $location, $anchorScroll, underscore) {
    var id = $stateParams.id
    $scope.catalog = {}
    $scope.catalogshow = false;
    $scope.catalogloaded = false;
    $http.get('/api/books/'+id).success(function(book) {
      $scope.book = book;
    });
    $scope.loadCatalog = function(){
      if($scope.catalogloaded){
        $scope.catalogshow = true;
      }else{
        $http.get('/api/books/catalog/'+id).success(function(catalog) {
          $scope.catalog = catalog;
          $scope.catalogshow = true;
          $scope.catalogloaded = true;
        })
      }
    }
    $scope.hideCatalog = function(){
      $scope.catalogshow = false;
    }
    $scope.filter2 = function(p){
        if (p.catalog_i !== null){
            return true;
        } else{
            return;
        }
    };
    $scope.gototop = function(){
      $location.hash('top');

      // call $anchorScroll()
      $anchorScroll();
    }
    $scope.starttoread = function(){
      var path = "/readcapture/";
      if(!$scope.catalogloaded){
        
        $http.get('/api/books/catalog/'+id).success(function(catalog) {
          $scope.catalog = catalog;
        })
        .then(function(){
          $scope.catalog.catalog = _.sortBy($scope.catalog.catalog, 'catalog_i');
          path = path + $scope.catalog._id + '-' + $scope.catalog.catalog[0].catalog_i+':'+$scope.book._id;
          $location.path( path );
        })
      }else{
        path = path + $scope.catalog._id + '-' + $scope.catalog.catalog[0].catalog_i+':'+$scope.book._id;
        $location.path( path );
      }

    }
  });
  
  angular.module('myreaderApp')
  .controller('ReadCaptureCtrl', function ($scope, $stateParams, $http, $location, $anchorScroll,$timeout) {
    var mixid = ($stateParams.id).split(':')[0]
    //$scope.centertext = 'text-center'
    $scope.capture = {};
    $scope.bookid = ($stateParams.id).split(':')[1]
    $scope.loading = true;
    $scope.loaderr = false;
    loadCapture(mixid);
    $scope.gototop = function(){
      $location.hash('top');

      // call $anchorScroll()
      $anchorScroll();
    }
    $scope.nextCapture = function(){
      var nextid = $scope.capture.catalog_id+'-'+$scope.capture.catalog_next
      $scope.loading = true ;
      loadCapture(nextid)
    }
    $scope.preCapture = function(){
      var nextid = $scope.capture.catalog_id+'-'+$scope.capture.catalog_pre
      $scope.loading = true ;
      loadCapture(nextid)
    }
    function loadCapture(mixid){
      $http.get('/api/catalogs/capture/'+mixid,{timeout: 9000}).success(function(capture) {
        $scope.loading = false;
        $scope.capture = capture;
        $scope.loaderr = false;
        
      }).error(function(data, status, header, config) {
              
         $scope.loading = false;
         $scope.loaderr = true;
         $timeout(function(){
            $scope.loaderr = false;
         },1500);
        });
    }
  });
angular.module('myreaderApp')
  .controller('SearchBookCtrl', function ($scope, $http, underscore) {
    $scope.books = [];
    $scope.page = 0;
    $scope.searchname = ''
    $scope.nomore = true;
    $scope.searchBook = function(){
      $http.get('/api/books/?searchname='+$scope.searchname+'&page='+$scope.page).success(function(books) {
          if(books.length == 0){
            $scope.nomore = true;
          }else{
            $scope.nomore = false;
          }
          $scope.books = books;
        });
    }
    $scope.loadmorebook = function(){
      $scope.page +=1;
      $http.get('/api/books/?searchname='+$scope.searchname+'&page='+$scope.page).success(function(books) {
          if(books.length == 0){
            $scope.nomore = true;
          }
          $scope.books = $scope.books.concat(books)
         
        });
    }

  });