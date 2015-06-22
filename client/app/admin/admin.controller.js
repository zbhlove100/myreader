'use strict';

angular.module('myreaderApp')
  .controller('AdminCtrl', function ($scope, $http, $state, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.adminshudan = function(){
       $state.go('admin.shudan');
    }
    $scope.adminbook = function(){
       $state.go('admin.book');
    }
    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  })
  .controller('AdminBookCtrl', function ($scope, $http, $state, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.books = [];
    $scope.result = {}
    $scope.page = 0;
    $scope.searchname = '';
    $scope.searchbook = function(){
      $http.get('/api/books/searchandcount/?page='+$scope.page+'&searchname='+$scope.searchname).success(function(books) {
        angular.forEach(books, function(value, key){
          $scope.books.push(value)
        });
      });
    }
    $http.get('/api/books/searchandcount/?page='+$scope.page).success(function(books) {
      $scope.result = books;

      
    });
  })
  .controller('AdminShudanCtrl', function ($scope, $http, $state, Auth, User, $timeout,underscore) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.result = [];
    $scope.page = 0;
    $scope.actionresult = '';
    $scope.createshudan = function(){
       $state.go('admin.createshudan');
    }
    $scope.editshudan = function(shudan){
       $state.go('admin.editshudan',{'id':shudan._id});
    }
    
    $scope.deleteshudan = function(shudan){
        shudan.active = false;
        $http.delete('/api/shudans/'+shudan._id, shudan).success(function(data) {
          $scope.actionresult = 'delete ' +shudan.name+ 'success!';
          $scope.result.shudans = underscore.without($scope.result.shudans, underscore.findWhere($scope.result.shudans, {_id: shudan._id}));
          $timeout(function(){
            $scope.actionresult = "";
          },1500);
        });

    }
  
    $http.get('/api/shudans/searchandcount/?page='+$scope.page).success(function(shudans) {
      $scope.result = shudans;

      
    });
  })
  .controller('createShudanCtrl', function ($scope, $http, $state, Auth, User, underscore) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.shudan = {};
    $scope.booklist = [];
    $scope.errors = {};
    $scope.bookresult = {};
    $scope.bookpage = 0;
    $scope.bookname = "";
    $scope.create = function(form){
      $scope.submitted = true;
      if(form.$valid) {
        $scope.shudan.books = underscore.pluck($scope.booklist, '_id');
        $scope.shudan.active = true;
        $http.post('/api/shudans/', $scope.shudan).success(function(books) {
          $state.go('admin.shudan');
        });
      }
    }
    $scope.searchbook = function(){
        $scope.bookpage = 0
        $http.get('/api/books/searchandcount/?searchname='+$scope.bookname+'&page='+$scope.bookpage).success(function(books) {
          $scope.bookresult = books;
        });
    }
    $scope.searchmorebook = function(action){
        if(action=='pre'){
          $scope.bookpage = $scope.bookpage-1==-1?0:$scope.bookpage-1;
        }else if(action=='next'){
          $scope.bookpage +=1;
        }
        
        $http.get('/api/books/searchandcount/?searchname='+$scope.bookname+'&page='+$scope.bookpage).success(function(books) {
          if(books.books.length!=0){
            $scope.bookresult = books;
          }
          
        });
    }
    $scope.addbooktobooklist = function(book){
      if(!underscore.contains($scope.booklist,book)){

        $scope.booklist.push(book);
      }
    }
    $scope.removebookfrombooklist =function(book){
      $scope.booklist = underscore.without($scope.booklist, underscore.findWhere($scope.booklist, {_id: book._id}));
    }
  

  })
.controller('editShudanCtrl', function ($scope, $http, $state, $stateParams, Auth, User, underscore, $timeout) {

    $scope.shudan = {};
    $scope.booklist = [];
    $scope.errors = {};
    $scope.bookresult = {};
    $scope.bookpage = 0;
    $scope.bookname = "";
    $scope.actionresult = '';
    $http.get('/api/shudans/'+$stateParams.id).success(function(shudan) {
      $scope.shudan = shudan;
      $scope.booklist = shudan.books
      
    });
    $scope.update = function(form){
      $scope.submitted = true;
      if(form.$valid) {
        $scope.shudan.books = underscore.pluck($scope.booklist, '_id');
        $scope.shudan.active = true;
        $http.put('/api/shudans/'+$scope.shudan._id, $scope.shudan).success(function(books) {
          $scope.actionresult = 'update ' +$scope.shudan.name+ 'success!';
          $timeout(function(){
            $scope.actionresult = "";
          },3500);
        }).error(function(data, status, header, config) {
        console.log(data)
         $scope.actionresult = 'update ' +$scope.shudan.name+ '失败!'+data;
          $timeout(function(){
            $scope.actionresult = "";
          },3500);
        });
      }
    }
    $scope.searchbook = function(){
        $scope.bookpage = 0
        $http.get('/api/books/searchandcount/?searchname='+$scope.bookname+'&page='+$scope.bookpage).success(function(books) {
          $scope.bookresult = books;
        });
    }
    $scope.searchmorebook = function(action){
        if(action=='pre'){
          $scope.bookpage = $scope.bookpage-1==-1?0:$scope.bookpage-1;
        }else if(action=='next'){
          $scope.bookpage +=1;
        }
        
        $http.get('/api/books/searchandcount/?searchname='+$scope.bookname+'&page='+$scope.bookpage).success(function(books) {
          if(books.books.length!=0){
            $scope.bookresult = books;
          }
          
        });
    }
    $scope.addbooktobooklist = function(book){
      if(!underscore.contains($scope.booklist,book)){

        $scope.booklist.push(book);
      }
    }
    $scope.removebookfrombooklist =function(book){
      $scope.booklist = underscore.without($scope.booklist, underscore.findWhere($scope.booklist, {_id: book._id}));
    }
   

  })
  
  ;
