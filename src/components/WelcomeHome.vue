<template>
  <div class="WelcomeHome">
    <h1>{{ msg }}</h1>
    <p> <i>"La lettura è il viaggio di chi non può prendere un treno." (Francis De Croisett)</i></p>
  </div>
</template>

<script>
export default {
  name: 'WelcomeHome',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
}
p{
  font-size: 4vh
}
</style>
