angular.module("app").controller("ViewCtrl", function ($scope, site) {
  console.log("ViewCtrl", $scope.site, site);
  $scope.site = site;
});
