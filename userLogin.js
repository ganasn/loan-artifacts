//userLogin.js

// var s3 = new AWS.S3({
//     apiVersion: '2006-03-01',
//     params: {Bucket: albumBucketName}
//   });

var s3; 

$('#loginForm').submit(function (e){
    e.preventDefault();
    handleLogin();
}); 


function handleLogin() {
    
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
            AWS.config.region = bucketRegion;
            idToken = result.idToken.jwtToken;
            console.log(idToken);
            console.log(accessToken);
            

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId, 
                Logins: {
                    'cognito-idp:us-west-2:103525954564:userpool/us-west-2_c8Uw0viF4' : result.getIdToken().getJwtToken()
                }
            });

            // alert("User Login: " + AWS.config.credentials.AmazonCognitoIdentity);

            AWS.config.credentials.refresh((error) => {
                if (error) {
                     alert("AWS.config.credentials.refresh " + error);
                } else {
                     // Instantiate aws sdk service objects now that the credentials have been updated.
                     s3.credentials = AWS.config.credentials.get(function (err){
                         if(err) {
                            alert("AWS.config.credentials.get " + error);
                         }
                     });
                     console.log('Successfully logged!');
                     console.log(AWS.config);
                     console.log(s3);                 
                     alert('Breakpoint');
                }
            });

            window.location.href = 'home.html';
        },

        onFailure: function(err) {
            alert(err);
        },

    });
}

function listAlbums() {

    console.log(AWS.config);
    console.log(s3);
    s3.listObjects({Bucket: albumBucketName, Delimiter: '/'}, function(err, data) {
      if (err) {
        return alert('There was an error listing your albums: ' + err.message);
        
      } else {
        var albums = data.CommonPrefixes.map(function(commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var albumName = decodeURIComponent(prefix.replace('/', ''));
          return getHtml([
            '<li>',
              '<span onclick="deleteAlbum(\'' + albumName + '\')">X</span>',
              '<span onclick="viewAlbum(\'' + albumName + '\')">',
                albumName,
              '</span>',
            '</li>'
          ]);
        });
        var message = albums.length ?
          getHtml([
            '<p>Click on an album name to view it.</p>',
            '<p>Click on the X to delete the album.</p>'
          ]) :
          '<p>You do not have any albums. Please Create album.';
        var htmlTemplate = [
          '<h2>Albums</h2>',
          message,
          '<ul>',
            getHtml(albums),
          '</ul>',
          '<button onclick="createAlbum(prompt(\'Enter Album Name:\'))">',
            'Create New Album',
          '</button>'
        ]
        document.getElementById('app').innerHTML = getHtml(htmlTemplate);
      }
    });
  }

  function addPhoto(albumName) {
    var files = document.getElementById('photoupload').files;
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent(albumName) + '//';
  
    var photoKey = albumPhotosKey + fileName;
    s3.upload({
      Key: photoKey,
      Body: file,
      ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
      alert('Successfully uploaded photo.');
      viewAlbum(albumName);
    });
  }
  

  
  function createAlbum(albumName) {
    albumName = albumName.trim();
    if (!albumName) {
      return alert('Album names must contain at least one non-space character.');
    }
    if (albumName.indexOf('/') !== -1) {
      return alert('Album names cannot contain slashes.');
    }
    var albumKey = encodeURIComponent(albumName) + '/';
    s3.headObject({Key: albumKey}, function(err, data) {
      if (!err) {
        return alert('Album already exists.');
      }
      if (err.code !== 'NotFound') {
        return alert('There was an error creating your album: ' + err.message);
      }
      s3.putObject({Key: albumKey}, function(err, data) {
        if (err) {
          return alert('There was an error creating your album: ' + err.message);
        }
        alert('Successfully created album.');
        viewAlbum(albumName);
      });
    });
  }
  
  function viewAlbum(albumName) {
    var albumPhotosKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
      if (err) {
        return alert('There was an error viewing your album: ' + err.message);
      }
      // `this` references the AWS.Response instance that represents the response
      var href = this.request.httpRequest.endpoint.href;
      var bucketUrl = href + albumBucketName + '/';
  
      var photos = data.Contents.map(function(photo) {
        var photoKey = photo.Key;
        var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        return getHtml([
          '<span>',
            '<div>',
              '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
            '</div>',
            '<div>',
              '<span onclick="deletePhoto(\'' + albumName + "','" + photoKey + '\')">',
                'X',
              '</span>',
              '<span>',
                photoKey.replace(albumPhotosKey, ''),
              '</span>',
            '</div>',
          '</span>',
        ]);
      });
      var message = photos.length ?
        '<p>Click on the X to delete the photo</p>' :
        '<p>You do not have any photos in this album. Please add photos.</p>';
      var htmlTemplate = [
        '<h2>',
          'Album: ' + albumName,
        '</h2>',
        message,
        '<div>',
          getHtml(photos),
        '</div>',
              '<input id="photoupload" type="file" multiple>',
        '<input id="photoupload" type="file">',			
        '<button id="addphoto" onclick="addPhoto(\'' + albumName +'\')">',
          'Add Photo',
        '</button>',
        '<button onclick="listAlbums()">',
          'Back To Albums',
        '</button>',      
      ]
      document.getElementById('app').innerHTML = getHtml(htmlTemplate);
    });
  }
  
  function addPhoto(albumName) {
    var fileHolder = document.getElementsByTagName('input');
      var i; 
      for (i = 0; i < fileHolder.length; i++) {
          var files = fileHolder[i].files;
          if (files.length) {
              files = [...files]
              files.forEach(file => {
                  var fileName = file.name;
                  var albumPhotosKey = encodeURIComponent(albumName) + '//';
                  var photoKey = albumPhotosKey + fileName;
                  s3.upload({
                          Key: photoKey,
                          Body: file,
                          ACL: 'public-read'
                          }, function(err, data) {
                                  if (err) {
                                          return alert('There was an error uploading your photo: ', err.message);
                                  }
              });    
          });
          // alert('Successfully uploaded photo.');
          viewAlbum(albumName);
          }
      }  
  }
  
  function deletePhoto(albumName, photoKey) {
    s3.deleteObject({Key: photoKey}, function(err, data) {
      if (err) {
        return alert('There was an error deleting your photo: ', err.message);
      }
      alert('Successfully deleted photo.');
      viewAlbum(albumName);
    });
  }
  
  function deleteAlbum(albumName) {
    var albumKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({Prefix: albumKey}, function(err, data) {
      if (err) {
        return alert('There was an error deleting your album: ', err.message);
      }
      var objects = data.Contents.map(function(object) {
        return {Key: object.Key};
      });
      s3.deleteObjects({
        Delete: {Objects: objects, Quiet: true}
      }, function(err, data) {
        if (err) {
          return alert('There was an error deleting your album: ', err.message);
        }
        alert('Successfully deleted album.');
        listAlbums();
      });
    });
  }