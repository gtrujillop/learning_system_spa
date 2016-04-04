(function () {
  var user = angular.module('learningSystem.user');
  user.service('userService', ['$http',
                                               '$stateParams',
                                                function ($http,
                                                               $stateParams) {

    var urlBase = 'http://localhost:3001/api/v1';
    var userService = {};

    userService.getAll = function () {
      return $http.get(urlBase + '/users');
    };

    userService.save = function(user) {
      return $http.post(urlBase + '/users', { user: user })
    };

    userService.getEnrollments = function() {
      return $http.get(urlBase + '/user_sessions/')
    };

    userService.enroll = function(enrollment) {
      return $http.post(urlBase + '/user_sessions', enrollment)
    };

    return userService;
  }]);
})();
