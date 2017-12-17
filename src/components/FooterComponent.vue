<template>
  <footer class="footer">
    <div class="container">
      <h4>
        Made with love by Samuel Faure
        <a href="https://github.com/Samuelfaure" ><img src="../assets/icons/github.svg" width=23></img></a>
      </h4>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>

.footer {
  padding: 2em 0;
  line-height: 2em;
  align-items: flex-end;
}

.footer .container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

</style>
