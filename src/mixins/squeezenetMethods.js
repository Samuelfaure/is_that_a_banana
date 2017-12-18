import { Array3D, NDArrayMathGPU } from 'deeplearn'
import { SqueezeNet } from 'deeplearn-squeezenet'
import { constants } from '@/main'

export default {
  methods: {
    executeAnalyse: async function () {
      let imgToAnalyse = await this.$refs.toAnalyse

      imgToAnalyse = this.preprocess(imgToAnalyse)
      const squeezeNet = await this.launchSqueezenet(imgToAnalyse)

      const topResults = await this.analyzeImage(imgToAnalyse, squeezeNet)
      // this.postprocess(this, imgToAnalyse)

      this.topResults = topResults
      this.isThatABanana()
    },
    analyzeImage: async function (imgToAnalyse, squeezeNet) {
      const image = Array3D.fromPixels(imgToAnalyse)
      const logits = squeezeNet.predict(image)
      const topResults = squeezeNet.getTopKClasses(logits, constants.ranking_maybe)

      return topResults
    },
    launchSqueezenet: async function () {
      const math = new NDArrayMathGPU()
      const squeezeNet = new SqueezeNet(math)
      this.bananaResult = 'loading_lib'
      await squeezeNet.load()
      return squeezeNet
    },
    isThatABanana: function () {
      const resultNames = Object.keys(this.topResults)
      const resultNamesConfirmed = resultNames.slice(0, constants.ranking_confirmed)

      if (resultNamesConfirmed.includes('banana')) {
        this.bananaResult = 'yes_banana'
      } else if (resultNames.includes('banana')) {
        this.bananaResult = 'maybe_banana'
      } else {
        this.bananaResult = 'no_banana'
      }
    }
  }
}
