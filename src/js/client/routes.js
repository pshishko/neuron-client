define('routes', ['angular', 'app', 'dd'], function (angular, app, dd) {

	'use strict';

	app.run(['Auth', function (Auth) {
        Auth.init(); 
	}]);

	return app.config(['stateHelperProvider', function (stateHelperProvider) {
		stateHelperProvider.state({
			url: '/loading',
			name: 'loading',
			templateUrl: 'template/layout/loading.tpl.html'
		})/*.state({
			name: 'auth',
			templateUrl: 'template/layout/clear.tpl.html',
			children: [
				{
					name: 'login',
					url: '/login',
					templateUrl: 'template/auth/login.tpl.html',
					controller: 'UserController'
				},
				{
					name: 'register',
					url: '/register',
					templateUrl: 'template/auth/register.tpl.html',
					controller: 'UserController'
				}
			]
		})*/.state({
            name: 'main',
            templateUrl: '../../template/layout/main.tpl.html',
            children: [
                {
                    url: '/',
                    name: 'neuron',
                    views: {
                        content: {
                            templateUrl: '../../template/neuron/main.tpl.html'
                        }
                    },
                    // controller: 'NeuronController'
                }
            ]
        });
	}]);
});