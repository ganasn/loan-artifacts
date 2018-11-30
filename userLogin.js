//userLogin.js

$('#loginForm').submit(function (e){
    
    var userId = $('#emailInputSignin').val();
    var userPwd = $('#passwordInputSignin').val();
    
    var authenticationData = {
        Username : userId,
        Password : userPwd
    };
    
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    var userData = {
        Username : userId,
        Pool : userPool
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            accessToken = result.getAccessToken().getJwtToken();
       /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            idToken = result.idToken.jwtToken;
        },

        onFailure: function(err) {
            alert(err);
        },

    });
});