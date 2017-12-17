<template>
  <div>
    <h1>Is that a banana ?<img id="banana-icon" src="../assets/icons/banana64.png"></img></h1>
    <h4>drag-and-drop your image in this box</h4>
    <div class="drop-zone" @dragover.prevent @drop="onDrop">
      <label class="button" v-if="!imageSource">
        Select an image
        <input type="file" name="image" @change="onChange">
      </label>
      <img id="img-to-analyse" ref="toAnalyse" :src=imageSource></img>
    </div>
    <result id="result" v-if="bananaResult"></result>
    <h4>How does it work ?</h4>
    <p>
      This website generates a deep-learning cluster in your browser<br>
      to tell you if your image is an image of a banana.<br>
      Deep-learning technology is still experimental, so please don't<br>
      take banana-related decisions based on this website's conclusions.
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
      this.createFile(files[0])
      this.executeAnalyse()
    },
    onChange (button) {
      var files = button.target.files
      this.createFile(files[0])
      this.executeAnalyse()
    },
    createFile (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image. Preferably of banana.')
        return
      }
      var reader = new FileReader()
      var vm = this

      reader.onload = function (imageDropped) {
        vm.imageSource = imageDropped.target.result
      }
      reader.readAsDataURL(file)
    },
    executeAnalyse: async function () {
      let imgToAnalyse = this.$refs.toAnalyse
      const squeezeNet = await this.launchSqueezenet(imgToAnalyse)

      imgToAnalyse = this.preprocess(imgToAnalyse)
      const topResults = await this.analyzeImage(imgToAnalyse, squeezeNet)
      imgToAnalyse = this.postprocess(imgToAnalyse)

      this.topResults = topResults
      this.isThatABanana()
    },
    preprocess (imgToAnalyse) {
      imgToAnalyse = this.resetImgFormat(imgToAnalyse)

      imgToAnalyse.width = 227
      imgToAnalyse.height = 227
      return imgToAnalyse
    },
    resetImgFormat (imgToAnalyse) {
      imgToAnalyse.oldWidth = imgToAnalyse.naturalWidth
      imgToAnalyse.oldHeight = imgToAnalyse.naturalHeight
      return imgToAnalyse
    },
    postprocess (imgToAnalyse) {
      imgToAnalyse.width = imgToAnalyse.oldWidth
      imgToAnalyse.height = imgToAnalyse.oldHeight
      return imgToAnalyse
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
      const topResults = await squeezeNet.getTopKClasses(logits, 30)

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

</style>
