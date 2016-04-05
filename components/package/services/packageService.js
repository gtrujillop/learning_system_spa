(function () {
  var package = angular.module('learningSystem.package');
  package.service('packageService', ['$http',
                                                             '$stateParams',
                                                              function ($http,
                                                                             $stateParams) {

    var urlBase = 'http://localhost:3001/api/v1';
    var packageService = {};

    packageService.getAll = function () {
      return $http.get(urlBase + '/packages');
    };

    packageService.getByUser = function (userId) {
      return $http.get(urlBase + '/users/' + userId + '/packages');
    };

    packageService.save = function(package) {
      return $http.post(urlBase + '/packages', { package: package })
    }

    return packageService;
  }]);
})();