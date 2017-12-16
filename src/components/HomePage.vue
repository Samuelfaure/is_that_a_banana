<template>
  <div>
    <h1>Is that a banana ?</h1>
    <img id="img-to-analyse" ref="toAnalyse" src="../assets/img/banana7.jpg" width=227 height=227></img>
    <button v-on:click="executeAnalyse">So, is it ?</button>
    <result v-if="bananaResult"></result>
    <ul>
      <li v-for="(score, className) in topResults">
        <p>{{ className }} : {{ score | rounded_to_4 }}</p>
      </li>
    </ul>
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
      bananaResult: ''
    }
  },
  methods: {
    executeAnalyse: async function () {
      const imgToAnalyse = this.$refs.toAnalyse

      const math = new NDArrayMathGPU()
      const squeezeNet = new SqueezeNet(math)
      await squeezeNet.load()

      const image = Array3D.fromPixels(imgToAnalyse)
      const logits = squeezeNet.predict(image)
      const topResults = await squeezeNet.getTopKClasses(logits, 30)

      console.log(topResults)
      for (const className in topResults) {
        console.log(`${topResults[className].toFixed(5)}: ${className}`)
      }
      this.topResults = topResults
      this.isThatABanana()
    },
    isThatABanana: function () {
      const resultNames = Object.keys(this.topResults)
      const resultNamesFirst10 = resultNames.slice(0, 10)
      console.log(resultNamesFirst10)
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

</style>
