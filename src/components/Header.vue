<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin-bottom: 30px;">
        <div class="container">
            <a class="navbar-brand" href="#">Dota 2 Analytics</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarColor02">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/index">Home</router-link>
                    </li>
                    <li v-if="!isLogged" class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/webAuth">Login / Signup</router-link>
                    </li>
                    <li v-else class="nav-item">
                        <div class="btn-group" role="group">
                            <router-link class="nav-link btn btn-secondary" active-class="active" to="/Profile">Your profile</router-link>
                            <router-link class="nav-link btn btn-secondary" active-class="active" to="#">Favorites</router-link>
                            <button class="nav-link btn btn-secondary" v-on:click="logOff">Log off</button>
                        </div>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/about">Pricing</router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About</a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="text" placeholder="Search">
                    <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<script>
    import { EventBus } from '../event-bus.js'
    export default {
        name: "Header",
        data() {
            return {
                isLogged: this.checkIfIsLogged()
            }
        },
        created() {
            EventBus.$on('logged', () => {
                this.isLogged = this.checkIfIsLogged()
            })
        },
        methods: {
            checkIfIsLogged () {
                let token = localStorage.getItem('user');
                if (token) {
                    return true
                } else {
                    return false
                }
            },
            logOff () {
                localStorage.removeItem('user');
                this.isLogged = this.checkIfIsLogged();
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>

</style>