//newUserVerify.js

$('#verifyForm').submit(function (e){
   
	e.preventDefault();
	
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
		Username: $('#emailInputVerify').val(),
		Pool: userPool
});
	

  cognitoUser.confirmRegistration($('#codeInputVerify').val(), true, function(err, result) {
      if (err) {
          alert(err);
          return;
      }
			console.log('call result: ' + result);
			window.location.href = 'userLogin.html'
  });
});