<template>
  <div>
    <template v-if="this.$parent.bananaResult === 'yes_banana'">
      <h1>Yup. That's a banana.</h1>
      <h4>enjoy your banana.</h4>
    </template>
    <template v-if="this.$parent.bananaResult === 'maybe_banana'">
      <h1>That MIGHT be a banana.</h1>
      <h4>proceed with caution.</h4>
    </template>
    <template v-if="this.$parent.bananaResult === 'no_banana'">
      <h1>That's not a banana.</h1>
      <h4>please don't use this item as a banana.</h4>
    </template>
  </div>
</template>

<script>

export default {
  name: 'Result'
}
</script>

<style scoped>

</style>
