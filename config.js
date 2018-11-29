var poolData = {
    UserPoolId : 'us-west-2_c8Uw0viF4', // your user pool id here
    ClientId : '5k606c3n8o7en4rci5flnb5hn9' // your app client id here
};
var userPool = 
new AmazonCognitoIdentity.CognitoUserPool(poolData);