//signup.js

function signUp(){
    var attributeList = [];
 
    var dataEmail = {
        Name : 'email',
        Value : $('#emailInputRegister').val() // your email here
    };
    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : '...' // your phone number here with +country code and no delimiters in front
    };
    var attributeEmail = 
    new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = 
    new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
     
    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
     
    var cognitoUser;
    userPool.signUp('username', 'password', attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}
