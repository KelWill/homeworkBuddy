var app = angular.module('student', []);

app.controller('teachers', function($scope, $http){
  $scope.teachers = "HELLO!"
  // $http({method: 'get', url: '/allteachers'}).success(function(data, status, headers, config){
  //   console.log(data);
  //   $scope.teachers = data;
  // }).error(function(error){
  //   console.log(error);
  // })
})

 

