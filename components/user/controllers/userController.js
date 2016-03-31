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

    listUsers();
    getPackages();
    getUserForPackages();
    getEnrollments();

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
          userFactory.setUser($scope.user);
          $state.go('userpackages', {id: $scope.user.id})
        }).error(function(){
           toaster.pop('error', "", "Could not retrieve packages for this user.");
        })  

      } else {
        toaster.pop('warning', "", "No packages available for this user.");
      }   
    };

     function userSessions(index) {
      if ($scope.users[index].sessions_count > 0) {
        sessionService.getByPackageAndUser($scope.users[index].id).success(function(data){
          $scope.user = $scope.users[index]
          $scope.user.packages = data;
          userFactory.setUser($scope.user);
          $state.go('userpackages', {id: $scope.user.id})
        }).error(function(){
           toaster.pop('error', "", "Could not retrieve packages for this user.");
        })
      } else {
        toaster.pop('warning', "", "No packages available for this user.");
      }   
    };

    function goToSessions(user, package) {
      userFactory.setUser(user);
      packageFactory.setPackage(package);
      $state.go('userclasses', {id: user.id, package_id: package.id});
    };

    // Enrollment == UserSession
    function getEnrollments() {
      if ($state.current.name !== 'userclasses') {
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
      
      if (userFactory.getUser() != {} && packageFactory.getPackage() != {}) {
        $scope.user = userFactory.getUser();
        $scope.package = packageFactory.getPackage();
      } else {
        for (var i = 0; i < $scope.packages.length; i ++) {
          var package = $scope.packages[j];
          if ($state.params.package_id == package.id) {
            $scope.package = package;
            break;
          }
        }

        for (var j = 0; j < $scope.users.length; j ++) {
          var user = $scope.users[j];
           if ($state.params.id == user.id) {
            $scope.user = user;
            break;
          }

        }
      }
    
    };

  }]);
})();