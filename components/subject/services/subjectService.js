(function () {
  var subject = angular.module('learningSystem.subject');
  subject.service('subjectService', ['$http',
                                                             '$stateParams',
                                                              function ($http,
                                                                             $stateParams) {

    var urlBase = 'http://localhost:3001/api/v1';
    var subjectService = {};

    subjectService.getAll = function () {
      return $http.get(urlBase + '/subjects');
    };
    
    return subjectService;
  }]);
})();