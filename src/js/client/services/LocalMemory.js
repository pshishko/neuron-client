define(['dd'], function(dd) {

    'use strict';

    return [function() {
        return {
            saveObj: function(objKey, obj) {
                window.localStorage.setItem(objKey, JSON.stringify(obj));
                return true;
            },
            loadObj: function(objKey) {
                var object = JSON.parse(window.localStorage.getItem(objKey));
                return object ? object : {};
            },
            clearCurrentMemory: function(objKey){
                window.localStorage.removeItem(objKey);
                return true;
            },
            clearMemory: function(){
                return window.localStorage.clear();
            }
        };
    }];
});