(function () {
  var user = angular.module('learningSystem.user');
  user.controller("userController", ["$scope",
                                                                     "userService",
                                                                     "packageService",
                                                                     "userFactory",
                                                                     "packageFactory",
                                                                     "$state",
                                                                     "toaster",
                                                                     "$sessionStorage",
                                                                     function($scope,
                                                                                    userService,
                                                                                    packageService,
                                                                                    userFactory,
                                                                                    packageFactory,
                                                                                    $state,
                                                                                    toaster,
                                                                                    $sessionStorage) {

    $scope.user = { is_admin: 0, packages: [] };
    $scope.isLogged = $sessionStorage.isLogged;
    $scope.save = save;
    $scope.addUser= addUser;
    $scope.userPackages = userPackages;
    $scope.addPackage = addPackage;
    $scope.goToSessions = goToSessions;
    $scope.isEnrolled = isEnrolled;
    $scope.enroll = enroll;
    $scope.enrollments = [];

    listUsers();
    getPackages();
    getUserForPackages();
    getEnrollments();
    cleanSession();

    $scope.userPopover = {
      content: '',
      templateUrl: 'userPopoverTemplate.html',
      title: ''
    };

    function save(formIsValid) {
      if (formIsValid && $scope.user.packages.length > 0) {
        userService.save($scope.user).success(function(data){
          toaster.pop('success', "", "user created succesfully.");
          $state.go('userindex');
        }).error(function(data){
          toaster.pop('error', "", "Could not save user.");
        })
      }
    };

    function addUser() {
      $state.go('newuser');
    };

    function listUsers() {
      userService.getAll().success(function(data){
        $scope.users = data;
        if($scope.users.length < 1){
          toaster.pop('warning', "", "No users available")
        }
      }).error(function(){
         toaster.pop('error', "", "Could not retrieve users.");
      })      
    };

    function userPackages(index) {
      if ($scope.users[index].package_count > 0) {
        packageService.getByUser($scope.users[index].id).success(function(data){
          $scope.user = $scope.users[index]
          $scope.user.packages = data;
          $sessionStorage.student = $scope.user;
          $state.go('userpackages', {id: $scope.user.id})
        }).error(function(){
           toaster.pop('error', "", "Could not retrieve packages for this user.");
        })  

      } else {
        toaster.pop('warning', "", "No packages available for this user.");
      }   
    };

    function goToSessions(user, package) {
      packageFactory.setPackage(package);
      $sessionStorage.student = user;
      $sessionStorage.package = package;
      $state.go('userclasses', {id: user.id, package_id: package.id});
    };

    // Enrollment == UserSession
    function getEnrollments() {
      if ($state.current.name !== 'userpackages' && $state.current.name !== 'userclasses') {
        return;
      };
      userService.getEnrollments().success(function(data){
        $scope.enrollments = data;
      }).error(function() {
        toaster.pop('error', "", "Could not retrieve enrollments");
      })
    };

    function isEnrolled(sessionId, userId) {
      var enrolled = false;
      for (var i = 0; i < $scope.enrollments.length; i ++) {
        var enrollment = $scope.enrollments[i];
        if (enrollment.user_id == userId && enrollment.session_id == sessionId) {
          enrolled = true;
          break;
        }    
      }
      return enrolled;
    };

    function enroll(sessionId, userId) {
      var enrollment = {user_session: {session_id: sessionId, user_id: userId, grade: 0.0, session_date: new Date()}};
      userService.enroll(enrollment).success(function() {
        toaster.pop('success', "", "User enrolled successfully.");
        $state.reload();
      }).error(function(){
        toaster.pop('error', "", "User could not be enrolled on this session.");
      })
    }

    function addPackage() {
      $scope.user.packages.push({ package_id: $scope.packages[0].id });
    };

    function getPackages() {
      if ($state.current.name !== 'newuser') {
        return;
      };

      packageService.getAll().success(function(data){
        $scope.packages = data;
        if ($scope.packages.length < 1) {
          toaster.pop('warning', "", "No packages available")
        }
      }).error(function() {
         toaster.pop('error', "", "Could not retrieve packages.");
      })
    }; 

    function getUserForPackages() {
      if ($state.current.name !== 'userpackages' && $state.current.name !== 'userclasses') {
        return;
      };
      
      $scope.user = $sessionStorage.student;
      $scope.package = $sessionStorage.package;

    };

    function cleanSession() {
      if ($state.current.name !== 'userpackages' && $state.current.name !== 'userclasses') {
        delete $sessionStorage.student;
        delete $sessionStorage.package;
      } else {
        return;
      }
    };

  }]);

})();