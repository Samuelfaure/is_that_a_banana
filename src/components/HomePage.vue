<template>
  <div>
    <h1>Is that a banana ?<img id="banana-icon" src="../assets/icons/banana64.png"></img></h1>
    <h4>drag-and-drop your image in this box</h4>
    <div class="drop-zone" @dragover.prevent @drop="onDrop">
      <label class="button" v-if="!imageSource">
        Select an image
        <input type="file" @change="onChange">
      </label>
      <img ref="toAnalyse" :src=imageSource v-bind:class="{ hidden: !imageSource }"></img>
    </div>
    <result id="result" v-if="bananaResult"></result>
    <button class="button" id="tryAgain" v-if="imageSource" @click="deleteImage">
      Try again
    </button>
    <h4>How does it work ?</h4>
    <p>
      This website generates a deep-learning cluster in your browser<br>
      to tell you if your image is an image of a banana.<br>
      Deep-learning technology is still experimental, so please don't<br>
      take banana-related decisions based on this website's conclusions.<br><br>
      Since the cluster use your GPU, this works better on a computer than on mobile !
    </p>
  </div>
</template>

<script>
import { NDArrayMathGPU, Array3D } from 'deeplearn'
import { SqueezeNet } from 'deeplearn-squeezenet'
import Filters from '@/mixins/filters'
import Result from '@/components/Result'

export default {
  name: 'HomePage',
  mixins: [Filters],
  components: {
    'Result': Result
  },
  data () {
    return {
      topResults: [],
      imageSource: '',
      bananaResult: ''
    }
  },
  methods: {
    onDrop: function (dropZone) {
      dropZone.stopPropagation()
      dropZone.preventDefault()
      const files = dropZone.dataTransfer.files
      this.analyseInput(files)
    },
    onChange: function (button) {
      const files = button.target.files
      this.analyseInput(files)
    },
    analyseInput (files) {
      const firstFile = files[0]
      if (!this.isImageValid(firstFile)) {
        return
      }
      this.readFile(firstFile)
    },
    readFile (file) {
      const reader = new FileReader()
      const vm = this

      reader.onload = function (event) {
        vm.imageSource = event.target.result
      }
      reader.readAsDataURL(file)
      this.executeAnalyse()
    },
    isImageValid (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image. Preferably of banana.')
        return false
      }
      return true
    },
    deleteImage: function () {
      this.imageSource = ''
      this.bananaResult = ''
    },
    executeAnalyse: async function () {
      let imgToAnalyse = await this.$refs.toAnalyse

      imgToAnalyse = this.preprocess(imgToAnalyse)
      const squeezeNet = await this.launchSqueezenet(imgToAnalyse)

      const topResults = await this.analyzeImage(imgToAnalyse, squeezeNet)
      // this.postprocess(imgToAnalyse)

      this.topResults = topResults
      this.isThatABanana()
    },
    preprocess (imgToAnalyse) {
      // imgToAnalyse = this.saveImgFormat(imgToAnalyse)

      imgToAnalyse.width = 227
      imgToAnalyse.height = 227
      return imgToAnalyse
    },
    saveImgFormat (imgToAnalyse) {
      imgToAnalyse.oldWidth = imgToAnalyse.width
      imgToAnalyse.oldHeight = imgToAnalyse.height
      return imgToAnalyse
    },
    postprocess (imgToAnalyse) {
      let widthToDisplay = imgToAnalyse.oldWidth
      let heightToDisplay = imgToAnalyse.oldHeight

      while (widthToDisplay > 300 || heightToDisplay > 500) {
        widthToDisplay /= 1.2
        heightToDisplay /= 1.2
      }

      this.$refs.toAnalyse = widthToDisplay
      this.$refs.toAnalyse = heightToDisplay
    },
    launchSqueezenet: async function () {
      const math = new NDArrayMathGPU()
      const squeezeNet = new SqueezeNet(math)
      this.bananaResult = 'loading_lib'
      await squeezeNet.load()
      return squeezeNet
    },
    analyzeImage: async function (imgToAnalyse, squeezeNet) {
      const image = Array3D.fromPixels(imgToAnalyse)
      const logits = squeezeNet.predict(image)
      const topResults = squeezeNet.getTopKClasses(logits, 30)

      return topResults
    },
    isThatABanana: function () {
      const resultNames = Object.keys(this.topResults)
      const resultNamesFirst10 = resultNames.slice(0, 10)

      if (resultNamesFirst10.includes('banana')) {
        this.bananaResult = 'yes_banana'
      } else if (resultNames.includes('banana')) {
        this.bananaResult = 'maybe_banana'
      } else {
        this.bananaResult = 'no_banana'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

h1, h4, h6, p {
  padding: 0.3em 0 0.3em 0;
}

.drop-zone {
  background-color: $color-white;
  display: inline-flex;
  justify-content: center;

  min-width: 300px;
  min-height: 200px;
  margin: 0.5em 0 0.5em 0;

  border: dashed black 3px;
}

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

#result {
  margin-bottom: 1em;
}

#tryAgain {
  display: block;
  margin: 0 auto;
}

</style>
