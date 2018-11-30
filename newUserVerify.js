//newUserVerify.js

$('#verifyForm').submit(function (e){
   
  e.preventDefault();

  cognitoUser.confirmRegistration($('#codeInputVerify'), true, function(err, result) {
      if (err) {
          alert(err);
          return;
      }
      console.log('call result: ' + result);
  });
});