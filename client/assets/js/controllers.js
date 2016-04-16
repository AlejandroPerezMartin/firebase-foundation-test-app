app.controller('startController', function ($scope, myAuth, $state, $firebaseAuth, userService) {
    $scope.grabAuth = myAuth.grabAuth;

    $scope.theUser = userService.getCurrentUser();
    $scope.allUsers = userService.getUser();

    var tmpID;

    if ($scope.grabAuth) {
        tmpID = $scope.theUser.fbID;
    } else {
        $state.go('login');
    }

    $scope.logOut = function () {
        userService.clearCurrent();

        if (tmpID) {
            userService.userOffline(tmpID);
        }

        myAuth.authRef.$unauth();
        $state.go('login');
    };
});

app.controller('registerController', function ($scope, $state, myAuth, userService) {
    $scope.cancelRegister = function () {
        $state.go('login');
    };

    $scope.regUser = function () {
        myAuth.authRef.createUser({
            email: $scope.loginEmail,
            password: $scop.loginPassword
        }).then(function (userData) {
            $scope.saveUser = userService.addUser(userData.uid, $scope.loginEmail);
            $state.go('home');
        }).catch(function (error) {
            alert(error);
        });
    };
});

app.controller('loginController', function ($scope, $state, myAuth, userService) {

    var tmpUser = {};

    $scope.loginUser = function () {
        myAuth.authRef.$authWithPassword({
            email: $scope.loginEmail,
            password: $scope.loginPassword
        }).then(function (authData) {
            $scope.authData = authData;
            if ($scope.authData) {
                $scope.loggedIn = userService.getUser();

                $scope.loggedIn.$loaded().then(function () {
                    for (var i = $scope.loggedIn.length - 1; i >= 0; i--) {
                        if ($scope.loggedIn[i].loginID == $scope.authData.uid) {
                            tmpUser = {
                                fbID: $scope.loggedIn[i].$id,
                                loginID: $scope.loggedIn[i].loginID,
                                user: $scope.loggedIn[i].user
                            };

                            userService.userOnline(tmpUser.fbID);
                            userService.setCurrentUser(tmpUser);
                            $state.go('home');
                        }
                    }
                });
            } else {
                $state.go('home');
            }
        }).catch(function (error) {
            alert('Authentication error');
            console.log(error);
        });
    };

    $scope.registerUser = function () {
        $state.go('register');
    };
});
