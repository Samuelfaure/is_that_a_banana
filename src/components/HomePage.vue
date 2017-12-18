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
import Filters from '@/mixins/filters'
import ImgMethods from '@/mixins/imgMethods'
import SqueezeMethods from '@/mixins/squeezenetMethods'
import Result from '@/components/Result'

export default {
  name: 'HomePage',
  mixins: [Filters, ImgMethods, SqueezeMethods],
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
