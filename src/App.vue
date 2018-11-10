<template>
    <div id="app">
        <Header :key="Date.now()"/>
        <router-view :key="Date.now() + 1000"/>
    </div>
</template>

<script>
    //if logged in show "my profile", otherwise signup/login
    import Header from '@/components/Header.vue'
    export default {
        components: {
            Header
        },
        data() {
            return {
                loggedIn: false,
            }
        },
        mounted() {
            if(localStorage.getItem('user')) {
                this.loggedIn = true;
                // location.reload();
            }
            else {
                this.loggedIn = false;
            }
        }
    }
</script>






<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
