(function () {
  var session = angular.module('learningSystem.session');
  session.service('sessionService', ['$http',
                                                         '$stateParams',
                                                          function ($http,
                                                                         $stateParams) {

    var urlBase = 'http://localhost:3001/api/v1';
    var sessionService = {};

    sessionService.save = function (session) {
      return $http.post(urlBase + '/sessions', { session: session });
    };

     sessionService.getAll = function () {
      return $http.get(urlBase + '/sessions');
    };

    sessionService.update = function (session, id) {
      // session's id param is not allowed in SessionController
      delete session.id;
      return $http.put(urlBase + '/sessions/' + id, {session: session});
    };

    return sessionService;
  }]);
})();101