// ImagePickerWeb.jsx

const ImagePicker = {
  launchImageLibrary: (options, callback) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        callback({
          uri: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
        });
      } else {
        callback({ didCancel: true });
      }
    };
    input.click();
  },
};

export default ImagePicker;
