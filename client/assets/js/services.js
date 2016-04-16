var app = angular.module('testApp');

app.factory('myAuth', function ($firebaseAuth) {
    var ref = new Firebase("https://aletatest.firebaseio.com");

    var fbAuth = $firebaseAuth(ref);
    var getAuth = fbAuth.$getAuth();

    var myAuth = {
        grabAuth: getAuth,
        authRef: fbAuth
    };

    return myAuth;

});

app.factory('userService', function ($firebaseAuth) {
    var myFB = new Firebase("https://aletatest.firebaseio.com/users");
    var fbRef = $firebaseArray(myFB);
    var current = {};

    var userService = {
        addUser: function (id, username) {
            fbRef.$add({
                loginID: id,
                user: username,
                online: 'false'
            });
        },
        setCurrentUser: function (user) {
            current = user;
        },
        getCurrentUser: function () {
            return current;
        },
        getUser: function () {
            return fbRef;
        },
        userOnline: function (id) {
            var theID = fbRef.$getRecord(id);
            theID.online = 'true';
            fbRef.$save(theID);
        },
        userOffline: function (id) {
            var theID = fbRef.$getRecord(id);
            theID.online = 'false';
            fbRef.$save(theID);
        },
        clearCurrent: function () {
            current = '';
        }
    };

    return userService;

});
