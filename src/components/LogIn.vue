<template>
    <div class="container">
        <div v-if="error" class="alert alert-danger">
            <strong>Oh snap!</strong> Bad login information.
        </div>

        <form @submit.prevent="sendLogin">
            <div class="form-group">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputUsername">Username:</label>
                <input v-model="username" type="text" class="form-control" id="inputUsername" placeholder="Name">
            </div>
            <div class="form-group" style="position: relative">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputPassword">Password:</label>
                <input v-model="password" type="password" class="form-control" id="inputPassword" placeholder="Password">
            </div>
            <button class="btn btn-primary">Login</button>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import { EventBus } from "../event-bus";
    import convertor from 'steam-id-convertor';
    import { connection } from "../variables";
    // import { createCookie, readCookie, eraseCookie } from '../cookie.js'

    export default {
        name: "LoginOrSignup",
        data () {
            return {
                username: '',
                password: '',
                error: false
            }
        },
        methods: {
            sendLogin: async function() {
                this.error = false;
                await axios.post(connection + 'auth/login',{
                    username: this.username,
                    password: this.password
                }).then(response => {

                    // console.log('data:');
                    // console.log(response.data);

                    response.data["steamId64"] = convertor.to64(response.data.steamId32);

                    localStorage.setItem('user', JSON.stringify(response.data));
                    // createCookie('user',JSON.stringify(response.data,30));
                    // console.log(readCookie('user'));
                    EventBus.$emit('logged', 'User logged');
                    // location.reload(true);
                    this.$router.push('/')

                }).catch(error => {
                    // console.log(error);
                    this.error = true;
                });
            }
        }
    }
</script>

<style scoped>

</style>