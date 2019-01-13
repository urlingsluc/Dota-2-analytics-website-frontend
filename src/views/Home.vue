<template>
  <div class="home container">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <homescreen/>
  </div>
</template>

<script>
  import homescreen from '@/components/HomeScreen.vue'

  export default {
    name: 'home',
    components: {
      homescreen
    }
  }
</script>
