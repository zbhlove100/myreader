'use strict';

describe('Controller: ShudanCtrl', function () {

  // load the controller's module
  beforeEach(module('myreaderApp'));

  var ShudanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShudanCtrl = $controller('ShudanCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
