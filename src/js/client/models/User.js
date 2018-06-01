define(['dd', '_'], function (dd, _) {

    'use strict';

    return ['Model', 'Socket', 'LocalMemory', 'Helper', function (Model, Socket, LocalMemory, Helper) {
        
        var service = {};

        service.model       = Model.instance('User', {socket: 'user'});

        service.model.initAction('login');
        service.model.initAction('register');
        service.model.initAction('forgot');
        service.model.initAction('reset');
        service.model.initAction('logout');
        service.model.initAction('online');
        service.model.initAction('onlineAdd');
        service.model.initAction('onlineRemove');
        service.model.initAction('photo');
        service.model.initAction('uploadPhoto');
        service.model.initAction('removePhoto');
        service.model.initAction('log');

        service.user        = service.model.observe();
        service.online      = service.model.observeList();
        service.photos      = service.model.observeList();

        service.getRoleList = function() {
            return {
                member      : 'Member',
                contributor : 'Instructor',
                editor      : 'Disciple',
                moderator   : 'Council',
                admin       : 'Admin'
            }
        };

        service.getAccessRoleList = function() {
            return {
                10: 'member',
                20: 'contributor',
                30: 'editor',
                40: 'moderator',
                50: 'admin'
            }
        };

        service.getAccessList = function() {
            return {
                10: 'Member',
                20: 'Instructor',
                30: 'Disciple',
                40: 'Council',
                50: 'Admin'
            }
        };

        /******************************************************************************************************************/

        service.user.get = function() {
            if (_.isEmpty(service.user.object)) {
                service.user.object = LocalMemory.loadObj('user');
            }
            return service.user.object;
        };

        service.user.set = function(user) {
            Helper.updateObject(service.user.get(), user);
            LocalMemory.saveObj('user', service.user.get());
            return service.user.get();
        };

        service.user.clear = function() {
            LocalMemory.clearCurrentMemory('user');
            service.user.object = {};
            return true;
        };

        service.logout = function() {
            service.model.logout({}, function(user) {});
        };

        service.model.on('logout', function(user) {
            service.user.clear();
            service.user.set(user);
            Helper.redirect('/login');
        });

        service.model.on('update', function(user) {
            service.user.set(user);
            Helper.safeApply();
        });

        service.model.on('uploadPhoto', function(photo) {
            service.photos.add(photo);
            Helper.safeApply();
        });

        service.model.on('removePhoto', function(photo) {
            service.photos.remove(photo.id);
            Helper.safeApply();
        });

        service.model.on('onlineAdd', function(user) {
            service.online.add(user);
        });

        service.model.on('onlineRemove', function(user) {
            if (_.isObject(user)) {
                service.online.add(user);
            } else {
                service.online.remove(user);
            }
        });

        service.isNotConnected = function() {
            return Socket.isNotConnected;
        };

        service.connectSocket = function(callback) {
            if (Socket.isNotConnected) {
                // init socket connection
                Socket.init(function() {
                    // Socket.sendSecureSocket('User.connect', service.user.get());
                    // Socket.onSecureSocket('User.onConnect', function(data) {
                    //     service.user.set(data);
                    //     callback();
                    // });
                    callback();
                });
            }
        };

        service.isAuthUser = function() {
            return !_.isEmpty(service.user.get()) && service.user.get().access_token && service.user.get().access_token.length > 0;
        };
        service.isGuest = function() {
            return !service.isAuthUser();
        };
        service.isAdmin = function() {
            return service.user.get().role == 'admin';
        };

        /******************************************************************************************************************/

        return service;
    }];
});