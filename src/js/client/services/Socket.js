define(['dd', 'config', 'socket', '_'], function (dd, config, socket, _) {

    'use strict';

    return  ['Crypt', '$once', '$on', '$emit', function (Crypt, $once, $on, $emit) {

        var service = {};

        service.socket = null;
        service.events = [];
        var queueEvents = {};

        service.isNotConnected = function() {
            return !service.socket;
        };

        service.init = function (authCallback) {
            if (service.isNotConnected) {
                service.socket = socket.connect((config.ssl ? 'https://' : 'http://') + config.socketDomain, {
                    secure      : config.ssl,
                    transports  : ['websocket', 'polling']
                });
                clearEvents();
                registerSocketEvents(authCallback);
            }
        };

        service.onSocket = function(callback) {
            $on('onSocket', function(e, action, data) {
                callback(action, data);
            });
        };
        service.onSocketSend = function(callback) {
            $on('sendSocket', function(e, action, data) {
                callback(action, data);
            });
        };

        service.onSecureSocket = function (action, callback) {
            if (service.socket) {
                service.events.push(action);
                service.socket.on(action, function(data) {
                    var decryptedData = Crypt.decrypt(data);
                    $emit('onSocket', action, decryptedData);
                    callback(decryptedData);
                });
            } else {
                queueEvents[action] = callback;
            }
        };

        service.sendSecureSocket = function (action, data) {
            $emit('sendSocket', action, data);
            service.socket.emit(action, Crypt.encrypt(data));
        };

        service.registerModelEvents = function(modelName, model) {
            _.each(model, function(callback, method) {
                if (method.indexOf('on') === 0) {
                    service.onSecureSocket(modelName + '.' + method, callback);
                }
            })
        };

        /******************************************************************************************************************/
        // Private section

        var registerSocketEvents = function (authCallback) {
            service.socket.on('connect', function () {
                dd('Socket Connected ...');

                authCallback();
                registerQueueEvents();

                $emit('onSocket', 'connect', {});

                service.socket.on('disconnect', function () {
                    // clearEvents();
                    dd('Socket Disconnect ...');
                    $emit('onSocket', 'disconnect', {});
                });
            });
        };

        var registerQueueEvents = function() {
            _.each(queueEvents, function(callback, action) {
                service.onSecureSocket(action, callback);
                delete(queueEvents[action]);
            });
        }

        var clearEvents = function() {
            _.each(service.events, function(event) {
                service.socket.removeListener(event);   
            });
            service.events = ['disconnect'];
        };

        /******************************************************************************************************************/

        return service;
    }];
});