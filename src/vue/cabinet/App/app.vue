<template>
  <h1 class="h1">{{message}}</h1>
</template>

<style lang="scss" src="./app.scss"></style>

<script>
    export default {
        el: '#app',
        name: 'app',
        data () {
            return {
                message: 'Welcome to Vue'
            }
        }
    }
</script>


