'use strict';

describe('Controller: AnimateCtrl', function () {

  // load the controller's module
  beforeEach(module('kosApp'));

  var AnimateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnimateCtrl = $controller('AnimateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AnimateCtrl.awesomeThings.length).toBe(3);
  });
});
