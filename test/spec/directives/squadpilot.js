'use strict';

describe('Directive: squadPilot', function () {

  // load the directive's module
  beforeEach(module('kosApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<squad-pilot></squad-pilot>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the squadPilot directive');
  }));
});
