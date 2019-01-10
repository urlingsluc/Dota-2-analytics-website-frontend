<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin-bottom: 30px;">
        <div class="container">
            <router-link class="navbar-brand" to="/">Dota 2 Analytics</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarColor02">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/">Home</router-link>
                    </li>
                    <li v-if="!isLogged" class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/webAuth">Login / Signup</router-link>
                    </li>
                    <li v-else class="nav-item">
                        <div class="btn-group" role="group">
                            <router-link class="nav-link btn btn-secondary" active-class="active"  :to="{ path: 'myprofile', query: { from:  getSteamId32 }}" >Your profile</router-link>
                            <router-link class="nav-link btn btn-secondary" active-class="active" to="/favorites">Favorites</router-link>
                            <button class="nav-link btn btn-secondary" v-on:click="logOff">Log off</button>
                        </div>
                    </li>
                    <li class="nav-item">
                        <!--<router-link class="nav-link" active-class="active" to="/about">Pricing</router-link>-->
                    </li>
                    <li class="nav-item">
                        <!--<a class="nav-link" href="#">About</a>-->
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0" @submit.prevent="sendSearch">
                    <input v-model="searchQuery" class="form-control mr-sm-2" type="text" placeholder="Search profiles">
                    <button class="btn btn-secondary my-2 my-sm-0">Search</button>
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
                isLogged: this.checkIfIsLogged(),
                mySteamId32: null,
                searchQuery: ''
            }
        },
        created() {
            EventBus.$on('logged', () => {
                this.isLogged = this.checkIfIsLogged()
            });

            EventBus.$on('changeSteamId32', function(newSteamId32) {
                this.mySteamId32 = newSteamId32;
            });
        },
        methods: {
            checkIfIsLogged () {
                let token = localStorage.getItem('user');
                if (token) {
                    // var tempToken = JSON.parse(token);
                    // this.mySteamId32 = tempToken.steamId32;
                    return true;
                } else {
                    return false;
                }
            },
            logOff () {
                localStorage.removeItem('user');
                this.isLogged = this.checkIfIsLogged();
                this.$router.push('/')
            },
            sendSearch() {
                this.$router.push('Search?q=' + this.searchQuery);
            },

        },
        computed: {
            getSteamId32() {
                if(this.mySteamId32 === null) {
                    const test = localStorage.getItem("user");
                    const testStringified = JSON.parse(test);
                    this.mySteamId32 = testStringified.steamId32;
                }
                // console.log('Class: computed, Function: getSteamId32, Line: 87');

                return this.mySteamId32.toString();
            }
        },
        async mounted() {
            // this.computed;
        }
    }
</script>

<style scoped>

</style>