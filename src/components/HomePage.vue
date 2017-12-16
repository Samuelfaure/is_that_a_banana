<template>
  <div>
    <h1>Is that a banana ?</h1>
    <div @dragover.prevent @drop="onDrop">
      <img id="img-to-analyse" ref="toAnalyse" :src=imageSource width=227 height=227></img>
    </div>
    <!-- <button v-on:click="executeAnalyse">So, is it ?</button> -->
    <result v-if="bananaResult"></result>
    <!-- <ul>
      <li v-for="(score, className) in topResults">
        <p>{{ className }} : {{ score | rounded_to_4 }}</p>
      </li>
    </ul> -->
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
      imageSource: 'src/assets/img/banana.jpeg',
      bananaResult: ''
    }
  },
  methods: {
    executeAnalyse: async function () {
      const imgToAnalyse = this.$refs.toAnalyse

      const math = new NDArrayMathGPU()
      const squeezeNet = new SqueezeNet(math)
      this.bananaResult = 'loading_lib'
      await squeezeNet.load()

      const image = Array3D.fromPixels(imgToAnalyse)
      const logits = squeezeNet.predict(image)
      const topResults = await squeezeNet.getTopKClasses(logits, 30)

      for (const className in topResults) {
        console.log(`${topResults[className].toFixed(5)}: ${className}`)
      }
      this.topResults = topResults
      this.isThatABanana()
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
    },
    onDrop: function (dropZone) {
      dropZone.stopPropagation()
      dropZone.preventDefault()
      const files = dropZone.dataTransfer.files
      this.createFile(files[0])
    },
    onChange (dropZone) {
      const files = dropZone.target.files
      this.createFile(files[0])
    },
    createFile (file) {
      if (!file.type.match('image.*')) {
        alert('Select an image')
        return
      }
      var reader = new FileReader()
      var vm = this

      reader.onload = function (imageDropped) {
        vm.imageSource = imageDropped.target.result
      }
      reader.readAsDataURL(file)
      this.executeAnalyse()
    }
  }
}
</script>

<style scoped>

</style>
