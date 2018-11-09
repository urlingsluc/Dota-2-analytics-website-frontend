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
                <input v-model="password" type="password" class="form-control" id="inputPassword" placeholder="Name">
            </div>
            <button class="btn btn-primary" >Login</button>
        </form>
    </div>

</template>

<script>
    import axios from 'axios';
    import { EventBus } from "../event-bus";
    import convertor from 'steam-id-convertor';

    export default {
        name: "LoginOrSignup",
        data() {
            return {
                username: '',
                password: '',
                error: false
            }
        },
        methods: {
            sendLogin: async function() {
                this.error = false;
                await axios.post('http://localhost:9999/auth/login',{
                    username: this.username,
                    password: this.password
                }).then(response => {

                    console.log('data:');
                    console.log(response.data);


                    response.data["steamId64"] = convertor.to64(response.data.steamId32);



                    localStorage.setItem('user', JSON.stringify(response.data));
                    EventBus.$emit('logged', 'User logged');
                    // location.reload(true);
                    this.$router.push('about')

                }).catch(error => {
                    console.log(error);
                    this.error = true;
                });
            }
        }
    }
</script>

<style scoped>

</style>