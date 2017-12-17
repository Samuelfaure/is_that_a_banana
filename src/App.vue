<template>
  <div>
    <home-page></home-Page>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HomePage from '@/components/HomePage'
import FooterComponent from '@/components/FooterComponent'

export default {
  name: 'app',
  components: {
    'HomePage': HomePage,
    'FooterComponent': FooterComponent
  }
}
</script>

<style lang="scss" scoped>
</style>
