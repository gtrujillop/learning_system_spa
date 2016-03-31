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

    // function filterEnrollmentsByUserAndPackage(userId, packageId) {

    // }

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
      $scope.user = userFactory.getUser();
      $scope.package = packageFactory.getPackage();
    };

  }]);

})();