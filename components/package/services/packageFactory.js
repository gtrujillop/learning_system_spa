(function () {
   var package = angular.module('learningSystem.package');
   package.factory("packageFactory", [function() {

    var factory = {
      package: {},
    };

    factory.getPackage = function () {
      return factory.package;
    };

    factory.setPackage = function(package) {
      factory.package = package;
    }

    return factory;
  }]);
 })();
