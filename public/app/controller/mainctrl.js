var app = angular.module('mainCtrl',['mainService','ngResource','ngMaterial','md.data.table']);


app.controller('profileCtrl',function($route,$mdDialog,$rootScope,$location,$scope,Auth){

    var app = this;

    Auth.profile().then(function(data){
        app.profile = data.data.data;
    });

  // function DialogController($scope, $mdDialog) {
  //   $scope.hide = function() {
  //     $mdDialog.hide();
  //   };

  //   $scope.cancel = function() {
  //     $mdDialog.cancel();
  //   };

  //   $scope.answer = function(answer) {
  //     $mdDialog.hide(answer);
  //   };
  // }

  // $scope.profile = function(ev) {
  //   Auth.profile().then(function(data){
  //         app.profile = data;
  //         $mdDialog.show({
  //         controller: DialogController,
  //         templateUrl: 'profile.html',
  //         parent: angular.element(document.body),
  //         targetEvent: ev,
  //         clickOutsideToClose:true,
  //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
  //       })
  //       .then(function(answer) {
  //         $scope.status = 'You said the information was "' + answer + '".';
  //       }, function() {
  //         $scope.status = 'You cancelled the dialog.';
  //       });
  //     });
  //   };

});

app.controller('navCtrl',function($route,$mdDialog,$rootScope,$location,$scope,Auth){

    var app = this;

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  $scope.profile = function(ev) {
    Auth.profile().then(function(data){
          app.profile = data;
          $mdDialog.show({
          controller: DialogController,
          templateUrl: 'profile.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      });
    };

    $rootScope.$on('$routeChangeStart',function(){
        if(Auth.isLoggedIn()){
            app.logged=true;
            Auth.getUser().then(function(data){
                app.email = data.data.email;
            })
        }else{
            app.logged=false;            
        }
    });

    app.logout = function(){
        Auth.logout();
        $route.reload();
    }
});

app.controller('fullCtrl',function($rootScope,$location,$scope,Auth){

	var app = this;
    $rootScope.$on('$routeChangeStart',function(){

        if($location.path()=="/"){
            
        }
        else if(Auth.isLoggedIn()){
			// console.log("logged in");
			Auth.getUser().then(function(data){

                if(data.data.email=="yamin@endureair.com"){
                    $location.path('/data');
                }else{
                    $location.path('/hackathon');
                    // console.log(data.data.email);
                    app.email = data.data.email;                    
                }

			})
		}else{
			// console.log("not logged in");
			$location.path('/login');
		}
        if($location.hash()=="_=_"){$location.hash(null);}
	});


    $scope.check = function(){
        console.log("asd");
    }
});

app.controller('loginCtrl',function($timeout,$route,$scope,$mdDialog,$location,Auth,$compile){
	var logapp = this;

    $scope.registerForm = false;
    $scope.forgotPass = false;

    logapp.submitted=false;

    var html='',
    el = document.getElementById('member');
    elv = document.getElementById('mem');

    logapp.change = function(){
        console.log("checked",logapp.reg);
        angular.element(el).remove();
        html = "";
        // console.log(app.user.teamMember);
        for(var i=0;i<logapp.reg.teamMember;i++){
            html += '<div layout-gt-sm="row" layout-padding><md-input-container class="md-block"><label>First Name</label><input ng-model="login.reg.firstname['+i+']" type="text" name="firstname" required=""/></md-input-container><md-input-container class="md-block"><label>Last Name</label><input ng-model="login.reg.lastname['+i+']" type="text" name="lastname" required=""/></md-input-container><md-input-container class="md-block"><label>Mobile Number</label><input ng-model="login.reg.mobileno['+i+']" type="number" name="mobileno" required=""/></md-input-container></div>  '; 
        };
        angular.element(elv).html('');
        angular.element(elv).append($compile('<div id="member">'+html+'</div>')($scope) )
    }

	logapp.submit = function(loginData){
        logapp.loading = true;
      logapp.submitted=true;
  		Auth.login(logapp.user).then(function(data){
			// console.log(data.data.success);
			if(data.data.success){
				logapp.successMsg = data.data.message;
            	logapp.errorMsg = '';
            	// console.log("asdad");
				$location.path('/hackathon');
			}else{
          logapp.errorMsg = data.data.message;
          logapp.successMsg = '';
			}
	        logapp.loading = false;
          logapp.submitted=false;
		});
    $timeout(function() {
      logapp.errorMsg=false;
    }, 2000);
	};



    app.popup = function(message) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title("Hi, ")
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            // .targetEvent()
        );
    };

    logapp.register = function(loginData){
        logapp.loading = true;
        logapp.submitted=true;
        Auth.register(logapp.reg).then(function(data){
            // console.log(data.data.success);
            if(data.data.success){
                logapp.successMsg = data.data.message;
                logapp.errorMsg = '';
                app.popup(data.data.message);
                $route.reload();

            }else{
                logapp.errorMsg = data.data.message;
                logapp.successMsg = '';
            }
            logapp.loading = false;
            logapp.submitted=false;
        });
    };


});

app.controller('formCtrl',function($scope,$sce,$mdDialog,$location,Auth,AuthToken,$compile){

	   var app = this;

       // $scope.getNumber = function(num) {
       //      return new Array(num);   
       //  }

       //  $scope.renderHtml = function (htmlCode) {
       //      return $sce.trustAsHtml(htmlCode);
       //  };
            app.submitted=false;


	app.submit = function(formData){
            app.submitted=true;
        app.user.token = AuthToken.getToken();
		Auth.submitForm(app.user).then(function(data){
            // console.log(data.data);
			if(data.data.success){
                app.popup1(data.data.message);
            }else{
                app.popup(data.data.message);
            }
          app.submitted=false;
		});
	}

	app.popup = function(message) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title("Hi, ",app.user.firstname)
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            // .targetEvent()
        );
    };

    app.popup1 = function(message) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Hi, ",app.user.firstname)
            .textContent(message)
            .ariaLabel('Lucky day')
            .ok('LogOut')

        $mdDialog.show(confirm).then(function() {
            app.logout();
        }, function() {
            app.logout();
        });
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            // console.log("logout")
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

	app.logout = function(){
		Auth.logout();
		$location.path("/login");
	}

});


app.controller('dataCtrl',function($scope,$mdDialog,$location,Auth,AuthToken){

    var app = this;
    $scope.number = 5;
    $scope.regUser=0;
    $scope.subUser=0;
    app.logout = function(){
        Auth.logout();
        $location.path("/login");
    }

    Auth.formData().then(function(data){
        console.log(data.data);
        $scope.names = data.data.message;
        $scope.regUser = data.data.usersNumber;
        $scope.subUser = data.data.userSubmitted;
    });

});
