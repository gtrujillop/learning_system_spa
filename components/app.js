(function () {
  var mainApp = angular.module('learningSystem', ['ui.router',
                                                  'ui.bootstrap',
                                                  'ngStorage',
                                                  'toaster',
                                                  'learningSystem.home',
                                                  'learningSystem.session',
                                                  'learningSystem.package',
                                                  'learningSystem.subject',
                                                  'learningSystem.user'
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

    if ($sessionStorage === undefined){
      $sessionStorage.isLogged = false;
      $sessionStorage.authToken = '';
      $sessionStorage.user = {};
    };

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
 
    $scope.login = login;
    $scope.logout = logout;
    $scope.user = $sessionStorage.user;
    $scope.isLogged = $sessionStorage.isLogged;
    $scope.listPackages = listPackages;
    $scope.listSessions = listSessions;
    $scope.listUsers = listUsers;

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

    function logout() {
      loginFactory.setAuthStatus(false);
      $sessionStorage.$reset();
      $state.go('home');
    };

    function listSessions() {
      $state.go('classindex');
    };

    function listPackages() {
      $state.go('packageindex');
    };

    function listUsers() {
      $state.go('userindex');
    };
  }]);

  mainApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('home', {
              url: '/home',
              templateUrl: '/home/views/home.html',
              controller: 'homeController'
          })
          .state('newclass', {
              url: '/classes/new',
              templateUrl: '/session/views/newSession.html',
              controller: 'sessionController'
          })
          .state('classindex', {
              url: '/classes',
              templateUrl: '/session/views/sessionList.html',
              controller: 'sessionController'
          })
          .state('newpackage', {
              url: '/packages/new',
              templateUrl: '/package/views/newPackage.html',
              controller: 'packageController'
          })
          .state('packageindex', {
              url: '/packages',
              templateUrl: '/package/views/packageList.html',
              controller: 'packageController'
          })
          .state('newuser', {
              url: '/users/new',
              templateUrl: '/user/views/newUser.html',
              controller: 'userController'
          })
          .state('userindex', {
              url: '/users',
              templateUrl: '/user/views/userList.html',
              controller: 'userController'
          })
          .state('userpackages', {
              url: '/users/:id/packages',
              templateUrl: '/user/views/userPackages.html',
              controller: 'userController'
          })
          .state('userclasses', {
              url: '/users/:id/packages/:package_id/classes',
              templateUrl: '/user/views/userSessions.html',
              controller: 'userController'
          })
        $urlRouterProvider.otherwise('home');
    }]);
})();
