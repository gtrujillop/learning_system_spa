(function () {
  var mainApp = angular.module('learningSystem', ['ui.router',
                                                  'ui.bootstrap',
                                                  'ngStorage',
                                                  'toaster',
                                                  'learningSystem.home'
                                                  // 'learningSystem.user',
                                                  // 'learningSystem.session',
                                                  // 'learningSystem.package',
                                                  // 'learningSystem.sessionResource',
                                                  // 'learningSystem.userPackage',
                                                  // 'learningSystem.userSession',
                                                  // 'learningSystem.userSessionToken'
                                                  ]);

  mainApp.service('loginService', ['$http',
                                   '$rootScope',
                                   '$stateParams',
                                   'loginFactory',
                                   function ($http,
                                             $rootScope,
                                             $stateParams,
                                             loginFactory) {

    var urlBase = 'http://localhost:3001';
    var loginService = {};

    loginService.login = function (user) {
      return $http.post(urlBase + '/auth', user);
    };

    return loginService;
  }]);

   mainApp.factory("loginFactory", ['$sessionStorage', function($sessionStorage) {

    var factory = {
      authToken: {},
      isLogged: {},
      user: {}
    };

    $sessionStorage.isLogged = false;
    $sessionStorage.authToken = '';
    $sessionStorage.user = {};
    factory.isLogged = false;

    factory.getAuthToken = function () {
      return factory.authToken;
    };

    factory.getAuthStatus = function () {
      return factory.isLogged;
    };

    factory.getUser = function () {
      return factory.user;
    }

    factory.setAuthToken = function (token) {
      factory.authToken = token;
      $sessionStorage.authToken = token;
    };

    factory.setAuthStatus = function (status) {
      factory.isLogged = status;
      $sessionStorage.isLogged = status;
    };

    factory.setUser = function(user) {
      factory.user = user;
      $sessionStorage.user = user;
    }

    return factory;
  }]);

   mainApp.controller("loginController", ["$scope",
                                                                 "loginService",
                                                                 "loginFactory",
                                                                 "$state",
                                                                 "toaster",
                                                                 "$sessionStorage",
                                                                 function($scope,
                                                                                loginService,
                                                                                loginFactory,
                                                                                $state,
                                                                                toaster,
                                                                                $sessionStorage) {

    $scope.isLogged = $sessionStorage.isLogged;
 
    $scope.login = login;

    $scope.$watch(function(){return loginFactory.isLogged}, function(newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.user = $sessionStorage.user;
          $scope.isLogged = $sessionStorage.isLogged;
        }
    }, true);

    $scope.dropDownStatus = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dropDownStatus.isopen = !$scope.dropDownStatus.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

    function login(validForm) {
      if (validForm) {
        loginService.login($scope.user)
        .success(function(data) {
          loginFactory.setAuthToken(data.auth_token);
          loginFactory.setAuthStatus(true);
          $scope.isLogged = loginFactory.getAuthStatus();
          $scope.user = data.user;
          loginFactory.setUser($scope.user);
          $scope.status = 'Successfully logged in.'
          toaster.pop('success', "", $scope.status);
        }).error(function() {
          loginFactory.setAuthStatus(false);
          $scope.status = 'user does not exist.'
          toaster.pop('error', "", $scope.status);
        });
      }
    };

  }]);

  mainApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('home', {
              url: '/home',
              templateUrl: '/login/views/home.html',
              controller: 'homeController'
          })
        $urlRouterProvider.otherwise('home');
    }]);
})();
