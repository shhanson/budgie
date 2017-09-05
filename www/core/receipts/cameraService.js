angular.module('budgie').service('CameraService', [
  '$http',
  'IonicClosePopupService',
  '$cordovaCamera',
  '$ionicPopup',
  '$q',
  function($http, IonicClosePopupService, $cordovaCamera, $ionicPopup, $q) {
    const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";
    const se = this;
    se.imageURI;
    se.loading = false;

    se.pictureAlert = function() {
      const defer = $q.defer();
      se.picturePopUp = $ionicPopup;
      se.picturePopUp.show({
        title: "Receipt Picture",
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: 'Take Picture',
            type: 'button-block',
            onTap: function() {
              defer.resolve(true);
              // se.takePicture(true);
            }
          }, {
            text: 'Select from Camera Roll',
            type: 'button-block',
            onTap: function() {
              defer.resolve(false);
              // se.takePicture();
            }
          }, {
            text: 'Cancel',
            type: 'button-block',
            onTap: function() {
              close();
              defer.reject();
            }
          }
        ]
      });

      return defer.promise;
    };

    IonicClosePopupService.register(se.picturePopUp);

    se.takePicture = function(fromCamera) {
      let source = fromCamera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;

      const options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: source,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      return $cordovaCamera.getPicture(options)
      .then(imageData => imageData)
    };

    se.postImage = function(imageData){
      return $http.post(`${API_URL}/receipts/image`, {data: imageData})
      .then(res => res.data)
    }
  }
]);
