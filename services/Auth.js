app.factory('Auth', function(FB){

    var auth = FB.auth();

    var Auth = {
        user: {},

        createProfile: function(uid, user){
            var profile = {
                name: user.name,
                email: user.email,
                nameLow: user.name.toLowerCase(),
                id: uid
            };

            var profileRef = FB.profile();

            return profileRef.child(uid).set(profile);
        },

        login: function(user){
            return auth.$authWithPassword(
                {email: user.email, password: user.password}
            );
        },

        register: function(user){
            return auth.$createUser({email: user.email, password: user.password}).then(function(){
                return Auth.login(user);
            }).then(function(data){
                return Auth.createProfile(data.uid, user);
            });
        },

        logout: function(user){
            auth.$unauth();
        },

        changePassword: function(user){
            return auth.$changePassword({email: user.email, oldPassword: user.oldpass, newPassword: user.newpass});
        },

        resetPass: function(item){
          return auth.$resetPassword({email: item});
        },

        signedIn: function(){
            return !!Auth.user.provider;
        }
    };

    auth.$onAuth(function(authData){
        if(authData){
            angular.copy(authData, Auth.user);
            Auth.user.profile = FB.profileOb(authData.uid);
        }else{
            if(Auth.user && Auth.user.profile){
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    return Auth;

});
