<template>
  <div>
    <h1>Is that a banana ?</h1>
    <img id="img-to-analyse" ref="toAnalyse" src="../assets/img/real_banana_lauren.jpg" width=227 height=227></img>
    <button v-on:click="executeAnalyse">So, is it ?</button>
  </div>
</template>

<script>
import { NDArrayMathGPU, Array3D } from 'deeplearn'
import { SqueezeNet } from 'deeplearn-squeezenet'

export default {
  name: 'HomePage',
  methods: {
    executeAnalyse: async function () {
      const imgToAnalyse = this.$refs.toAnalyse

      const math = new NDArrayMathGPU()
      const squeezeNet = new SqueezeNet(math)
      await squeezeNet.load()

      const image = Array3D.fromPixels(imgToAnalyse)
      const logits = squeezeNet.predict(image)
      const topClassesToProbs = await squeezeNet.getTopKClasses(logits, 20)

      for (const className in topClassesToProbs) {
        console.log(`${topClassesToProbs[className].toFixed(5)}: ${className}`)
      }
    }
  }
}
</script>

<style scoped>

</style>
