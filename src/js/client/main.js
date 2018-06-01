require.config({
    'findNestedDependencies': true,
    'waitSeconds': 200,
    'urlArgs': "bust=" + (new Date).getTime(),
    baseUrl: "js/client",
    paths: {
        'config'  : '../config/local',
        'dd'      : 'components/dd',
        'key'     : 'components/key',

        'async'   : '../vendor/requirejs-plugins/src/async',
        'socket'  : '../vendor/socket.io-client/dist/socket.io.min',
        // 'jquery'  : '../vendors/jquery/dist/jquery.min',
        '_'       : '../vendor/lodash/dist/lodash.min',
        'md5'     : '../vendor/jshash/build/md5.min',

        //angular
        'angular'               : '../vendor/angular/angular.min',
        'ngResource'            : '../vendor/angular-resource/angular-resource.min',
        'uiRouter'              : '../vendor/angular-ui-router/release/angular-ui-router.min',
        'uiRouterStateHelper'   : '../vendor/angular-ui-router.stateHelper/statehelper.min',
        'ngAnimate'             : '../vendor/angular-animate/angular-animate.min',
        'ngEventEmitter'        : '../vendor/angular-event-emitter/angular-event-emitter',
        //angular

        'Viva'                  : '../vendor/vivagraphjs/dist/vivagraph.min'
    },
    shim: {
        'angular': {
            deps: ['config'],
            exports: 'angular'
        },
        '_': {
            exports: '_'
        },
        'app': {
            deps: [/*'jquery', */'_']
        },
        'routes': {
            deps: ['angular', 'uiRouter', 'uiRouterStateHelper']
        },
        'uiRouter': {
            deps: ['angular'],
            exports: 'uiRouter'
        },
        'uiRouterStateHelper': {
            deps: ['angular', 'uiRouter'],
            exports: 'uiRouterStateHelper'
        },
        'ngResource': {
            deps: ['angular'],
            exports: 'ngResource'
        },
        'ngAnimate': {
            deps: ['angular'],
            exports: 'ngAnimate'
        },
        'dd': {
            export: 'dd'
        },
        'key': {
            deps: ['md5'],
            export: 'key'
        },
    },
    priority: [
        "angular"
    ]
});

require([
    'angular',
    'app',
    'routes',
], function(angular, app, routes) {
    'use strict';

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['angApp']);
    });
});
