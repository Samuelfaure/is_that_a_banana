export default {
  methods: {
    deleteImage: function () {
      this.imageSource = ''
      this.bananaResult = ''
    },
    isImageValid (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image. Preferably of banana.')
        return false
      }
      return true
    },
    preprocess (imgToAnalyse) {
      // imgToAnalyse = this.saveImgFormat(imgToAnalyse)

      imgToAnalyse.width = 227
      imgToAnalyse.height = 227
      return imgToAnalyse
    },
    // saveImgFormat and postprocess methods not in use for now.
    // Postprocessing the img is deactivated until further notice.
    saveImgFormat (imgToAnalyse) {
      imgToAnalyse.oldWidth = imgToAnalyse.width
      imgToAnalyse.oldHeight = imgToAnalyse.height
      return imgToAnalyse
    },
    postprocess (vm, imgToAnalyse) {
      let widthToDisplay = imgToAnalyse.oldWidth
      let heightToDisplay = imgToAnalyse.oldHeight

      while (widthToDisplay > 300 || heightToDisplay > 500) {
        widthToDisplay /= 1.2
        heightToDisplay /= 1.2
      }

      vm.$refs.toAnalyse = widthToDisplay
      vm.$refs.toAnalyse = heightToDisplay
    }
  }
}
