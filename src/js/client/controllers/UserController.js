define(['pr'], function(pr) {
	'use strict';

	return ['$rootScope', '$scope', 'User', 'Socket', '$timeout', function($rootScope, $scope, User, Socket, $timeout) {
		$scope.user = {};

		$scope.go = function(link) {
			$scope.activeUserTab = link;
			Socket.updateActivity();
		};

		$scope.login = function() {
			if ($scope.UserForm.$valid) {
				$scope.isLoading = true;
				$timeout(function() {
					User.login($scope.user);
					$scope.UserForm.$setPristine();
				}, 1000);
			} else {
				$scope.setFormToDirty($scope.UserForm);
			}
		};

		$scope.register = function() {
			if ($scope.UserForm.$valid) {
				$scope.isLoading = true;
				$timeout(function() {
					User.register($scope.user);
					$scope.UserForm.$setPristine();
				}, 1000);
			} else {
				$scope.setFormToDirty($scope.UserForm);
			}
		};

		$scope.$on('authError', function (e, errorMessage) {
			notify({ message:errorMessage, classes: 'error'} );
			$scope.isLoading = false;
			$scope.$apply();
		});

		$scope.$watch('user', function(newVal, oldVal){
			$scope.$emit('user', newVal);
		}, true);

		$scope.$on('onUpdateMember', function(e, member){
			$scope.member = member;
		});
		$scope.$on('isLoading', function(e, isLoading){
			$scope.isLoading = isLoading;
		});

		$scope.$apply();
	}];
});