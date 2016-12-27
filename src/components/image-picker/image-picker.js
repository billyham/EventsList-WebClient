import template from './image-picker.html';
import styles from './image-picker.scss';

export default {
  template,
  bindings: {
    record: '<',
    edit: '&',
    dbType: '<'
  },
  controller: ['ckassetService', '$scope', 'imageService', controller]
};

function controller(ckassetService, $scope, imageService){
  // ============================== Properties ============================== //
  this.styles = styles;
  this.imagetype = '';
  this.boxtext = 'Drag and drop a JPEG or PNG image file';
  this.imagedata = null;
  this.croppedImageData = null;
  this.recordName = '';
  this.showError = false;
  this.fileName = '';

  // =============================== Methods ================================ //
  this.clearImage = clearImage;
  this.onChange = onChange;
  this.onDrop = onDrop;
  this.loadImage = loadImage;
  this.submitRequest = submitRequest;

  // =============================== Init =================================== //

  // ========================== Function declarions ========================= //
  function clearImage(){
    // Clear properties
    this.imagetype = '';
    this.boxtext = 'Drag and drop a JPEG or PNG image file';
    this.imagedata = null;
    this.recordName = '';
    this.showError = false;

    // Clear the value of the file input HTML element
    let filePath = document.getElementById(this.record);
    angular.element(filePath).val('');
  }

  // Watch for changes in the input-file element
  function onChange(tryFiles){
    this.loadImage(tryFiles);
  }

  function onDrop(evnt) {
    evnt.stopPropagation();
    evnt.preventDefault();
    if (evnt.dataTransfer.files.length < 1) return;

    this.loadImage(evnt.dataTransfer.files);
  };

  function loadImage(tryFiles){

    this.showError = false;
    this.fileName = '';

    if (!tryFiles || tryFiles.length < 1) return;

    let file = tryFiles[0];

    // TODO: Guard against unrecognized image types
    this.imagetype = file.type;

    // Save file name, to be given to imageService method
    // TODO: Display the filename as a confirmation of the file choice
    this.fileName = file.name;

    var fileReader = new FileReader();
    fileReader.onloadend = element => {
      // Give image data to image-crop component
      this.imagedata = element.target.result;
      $scope.$apply();
    };

    fileReader.readAsArrayBuffer(file);
  };

  function submitRequest(){
    if (!this.croppedImageData) return;

    // TODO: Provide UI sprite to indicate progress

    // Helper function requires 'This' context
    _cloudKitUpload.call(this, imageObj => {
      if (!imageObj || !imageObj.recordName) throw new Error('imagePicker > submitRequest failed to execute _cloutKitUpload');
      this.edit({ image: { field: 'imageRef', recordname: imageObj.recordName, imageObj } });
    });
  }

  // Call upon the imageService to upload the image to cloud store,
  function _cloudKitUpload(cb){

    imageService.upload(this.dbType, this.croppedImageData, this.fileName, this.record)
    .then( finalObj => {
      if (
        !finalObj ||
        !finalObj.data ||
        !finalObj.data.records ||
        finalObj.data.records < 1
      ) throw new Error('imagePicker > failed at imageService upload');
      if (cb) cb(finalObj.data.records[0]);
    })
    .catch( err => {throw err;});
  }

}
