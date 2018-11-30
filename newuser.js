//signup.js

var cognitoUser;
$('#registrationForm').submit(function (e){

    
        e.preventDefault();
        
        var attributeList = [];
        var email = $('#emailInputRegister').val();
    
    
        var dataEmail = {
            Name : 'email',
            Value : email
        };
        
    
        if($('#passwordInputRegister').val() === $('#password2InputRegister').val()) {
            var password = $('#passwordInputRegister').val();
        }
        else {
            alert('Passwords do not match');
        }

        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail); 
        attributeList.push(attributeEmail);
      
        userPool.signUp(email, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            window.location.href = 'newUserVerify.html';
        });
});
