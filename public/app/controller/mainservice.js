var app = angular.module('mainService',[]);


app.factory('Auth',function($http,AuthToken){
    var authFactory={};

    authFactory.register= function(data){
        return $http.post('/api/register',data).then(function(data){
            return data;
        });
    }

    authFactory.login= function(data){
        return $http.post('/api/authenticate',data).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
        });
    }

    authFactory.submitForm= function(data){
        return $http.post('/api/user',data).then(function(data){
            return data;
        });
    }

    authFactory.formData= function(){
        return $http.post('/api/formdata').then(function(data){
            return data;
        });
    }

    authFactory.profile= function(){
        return $http.post('/api/profile').then(function(data){
            return data;
        });
    }

    authFactory.isLoggedIn = function(){
        var token = AuthToken.getToken();
        if(token){
            return true;
        }else{
            return false;
        }
    }

    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.post('/api/me');
        }else{
            $q.reject({message:'User has no token'});
        }
    }

    authFactory.logout = function(){
        AuthToken.setToken();
    }

    return authFactory;
});


app.factory('AuthToken',function($window){
    var authTokenFactory={};

    //AuthToken.setToken()
    authTokenFactory.setToken = function(token){
        console.log(token);
        if(token){
            $window.localStorage.setItem('token',token);
        }else{
            $window.localStorage.removeItem('token');
        }
    }

    //AuthToken.getToken()
    authTokenFactory.getToken = function(token){
        return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
})

.factory('AuthTokenInject',function(AuthToken){
    var AuthTokenInject ={};

    AuthTokenInject.request = function(config){
        var token = AuthToken.getToken();

        if(token){
            config.headers['x-access-token'] = token;
        }
        return config
    }

    return AuthTokenInject;
})
