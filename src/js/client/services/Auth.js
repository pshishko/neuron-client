define(['_', 'dd'], function(_, dd) {

    'use strict';

    return  ['$rootScope', '$state', '$location', 'Helper', 'User', function($rootScope, $state, $location, Helper, User, cfpLoadingBar) {

        var service = {};

        var socketConnecting = false;
        
        var publicStates = [
            '/loading',
            '/login',
            '/register',
            '/forgot',
            '/reset/:key',
            '/',
            '^'
        ];

        var loadState = function(callback) {
            var stateStop = $rootScope.$watch(function() { 
                return $state.current;
            }, function(current) {
                if (!current.abstract || !$location.path()) {
                    callback(current);
                    stateStop();
                }
            });
        };

        var isValidState = function(stateUrl) {
            if (_.indexOf(publicStates, stateUrl) >= 0 || User.isAuthUser()) {
                return true;
            } else {
                $state.go('auth.login');
            }
            return false;
        };

        var connectSocket = function() {
            if (User.isNotConnected() && !socketConnecting) {
                var revertPath = _.indexOf(['', '/loading'], $location.path()) < 0 ? $location.path() : '/';
                User.connectSocket(function() {
                    Helper.redirect(revertPath);
                });
                socketConnecting = true;
                $location.path('/loading');
            }
        };

        service.init = function() {
            loadState(function(state) {
                if (isValidState(state.url)) {
                    connectSocket();
                }
            });

            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
                if (isValidState(toState.url)) {
                    connectSocket();   
                } else {
                    event.preventDefault();
                }
            });
        }

        return service;
    }];
});