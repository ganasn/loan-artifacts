var poolData = {
    UserPoolId : 'us-west-2_c8Uw0viF4', // your user pool id here
    ClientId : '5k606c3n8o7en4rci5flnb5hn9' // your app client id here
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var accessToken;
var idToken;

var albumBucketName = 'serverlesstestwebapp';
var bucketRegion = 'us-west-2';
var IdentityPoolId = 'us-west-2:6621b327-8e72-4ce5-8adb-fc250ce2c06a';
var cognitoIdp = 'cognito-idp:us-west-2:103525954564:userpool/us-west-2_c8Uw0viF4';

// var s3 = new AWS.S3();