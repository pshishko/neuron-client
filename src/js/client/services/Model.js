define(['dd', '_'], function (dd, _) {

	'use strict';

	return ['Socket', 'Helper', '$once', '$on', '$emit', function (Socket, Helper, $once, $on, $emit) {
		
		return {
			name : 'Model',
			params : {},
			isLoading : false,
			actions: [
				'view',
				'all',
				'add',
				'update',
				'remove'
			],
			instance : function(name, params) {
				var newModel 	= _.clone(this);
				newModel.name 	= name;
				newModel.params = params;

				if (!params.socket) {
					pr('Model need specify param socket!!!', 1);
				}
				newModel.initActions();
				return newModel;
			},
			observe: function() {
				return {
					object: {},
					get: function() {
						return this.object;
					},
					set: function(object) {
						this.object = Helper.updateObject(this.get(), object);
						// Helper.safeApply();
						return this.object;
					},
					add: function(object) {
						return this.set(Helper.addToObject(this.get(), object.id, object));
					},
					// update: function(id, object) {
					// 	return this.set(Helper.addToObject(this.get(), object.id, object));
					// },
					remove: function(id) {
						return this.set(Helper.removeFromObject(this.get(), id));
					},
					exist: function(id) {
						return !_.isEmpty(this.object[id]);
					}
				};
			},
			observeList: function() {
				var _arguments = arguments;

				var observeService = {
					object: {},
					count: -1,
					total: -1,
					get: function() {
						return this.object;
					},
					set: function(object, total) {
						this.object = Helper.setObject(this.get(), object);
						this.count = _.size(this.object);
						this.total = total;
						Helper.safeApply();
						return this.object;
					},
					add: function(object) {
						if (this.count > 0) { this.count++; }
						if (this.total > 0) { this.total++; }
						Helper.addToObject(this.get(), object.id, object);
						Helper.safeApply();
					},
					view: function (id) {
						return this.exist(id) ? this.get()[id] : false;
					},
					update: function(id, object) {
						Helper.updateObject(this.get()[id], object);
						Helper.safeApply();
					},
					remove: function(id) {
						if (this.count > 0) { this.count--; }
						if (this.total > 0) { this.total--; }
						Helper.removeFromObject(this.get(), id);
						Helper.safeApply();
					},
					exist: function(id) {
						return !_.isEmpty(this.object[id]);
					},
                    clear: function() {
                        if (!_.isEmpty(this.object)) {
                            _.each(this.object, function(item) {
                                observeService.remove(item.id);
                            });
                        }
                    },
					allLoaded: function(limit) {
						if (limit && this.count >= limit) return true;
						return this.total >= 0 && this.total == this.count;
					}
				};

				if (_arguments.length) {
					var objectList = {};
					return function() {
						if (_arguments.length != arguments.length) {
							pr('Count arguments invalid, must be (' + _.values(_arguments).toString() +')', 1);
						}
						var cursorObject = objectList;
						_.each(arguments, function(val, key) {
							if (_.isEmpty(cursorObject[val])) {
								if (_arguments.length == (key + 1)) {
									cursorObject[val] = _.clone(observeService);
									cursorObject[val].object = {};
								} else {
									cursorObject[val] = {};
								}
							}
							cursorObject = cursorObject[val];
						});
						return cursorObject;
					};
				} else {
					return observeService;
				}
			},
			getSocketAction : function(type) {
				return this.name + '.' + this.params.socket + (type ? Helper.ucfirst(type) : '');
			},
			getSocketEvent : function(type) {
				return 'on' + Helper.ucfirst(this.params.socket) + (type ? Helper.ucfirst(type) : '');
			},
			getSocketFailEvent : function(type) {
				return 'onFail' + Helper.ucfirst(this.params.socket) + (type ? Helper.ucfirst(type) : '');
			},
			initActions : function() {
				var _this = this;
				if (Socket.events.indexOf(_this.name) < 0) {
					_.each(_this.actions, function(action) {
						_this.initAction(action);
					});
				}
			},
			initAction: function(action) {
				var _this = this;
				var events = {};
				_this[action] = function(data, callback, failCallback) {
					return _this.send(action, data, callback, failCallback);
				};
				events[_this.getSocketEvent(action)] = function(data) { $emit(_this.getSocketEvent(action), data); };
				events[_this.getSocketFailEvent(action)] = function(data) { $emit(_this.getSocketFailEvent(action), data); };
				Socket.registerModelEvents(_this.name, events);
			},
			send : function(type, data, callback, failCallback) {
				var _this = this;
				_this.isLoading = true;
				Socket.sendSecureSocket(_this.getSocketAction(type), data);
                var occurred = false;

				$once(_this.getSocketEvent(type), function(e, model) {
                    if (occurred) {
                        return true;
                    }
					_this.isLoading = false;
					if (callback) callback(model);
                    occurred = true;
					Helper.safeApply();
				});

				$once(_this.getSocketFailEvent(type), function(e, model) {
                    if (occurred) {
                        return true;
                    }
					_this.isLoading = false;
					if (failCallback) failCallback(model);
                    occurred = true;
					Helper.safeApply();
				});
				return _this;
			},
			on: function(event, callback) {
				$on(this.getSocketEvent(event), function(e, model) {
					callback(model);
				});
				return this;
			},
			onConnect: function(callback) {
				Socket.onSocket(function(action, data) {
					if (
						action == 'User.onConnect' && data.role != 'guest'
						|| action == 'User.onUserLogin'
						|| action == 'User.onUserRegister'
					) {
						callback();
					}
				});
			}
		};
	}];
});