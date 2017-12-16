export default {
  filters: {
    rounded_to_4: function (float) {
      if (float) {
        return float.toFixed(4)
      }
    }
  }
}
