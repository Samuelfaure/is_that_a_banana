<template>
  <div>
    <h1>Is that a banana ?</h1>
    <div class="drop-zone" @dragover.prevent @drop="onDrop">
      <img id="img-to-analyse" ref="toAnalyse" :src=imageSource></img>
    </div>
    <result v-if="bananaResult"></result>
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

      // for (const className in topResults) {
      //   console.log(`${topResults[className].toFixed(5)}: ${className}`)
      // }

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

<style scoped>

.drop-zone {
  display: inline-flex;
  min-width: 400px;
  min-height: 200px;
  border: dashed black 3px;
}

</style>
