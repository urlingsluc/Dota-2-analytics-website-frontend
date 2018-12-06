<template>
    <div class="container">
        <div v-if="accountCreateSuccess" class="alert alert-dismissible alert-success">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Well done!</strong> You successfully created an account.
        </div>
        <div v-if="typeError" class="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Oh snap!</strong> Change a few things (minimum amount of characters is 5 for the name, username and email. And 6 for the password.)  and try submitting again.
        </div>
        <div v-if="serverError" class="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Oh snap!</strong> Something went wrong in the server.
        </div>
        <form @submit.prevent="sendSignup">
            <div class="form-group">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputSignupName">Full name:</label>
                <input v-model="name" type="text" class="form-control" id="inputSignupName" placeholder="Name">
            </div>
            <div class="form-group">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputSignupUsername">Username:</label>
                <input v-model="username" type="text" class="form-control" id="inputSignupUsername" placeholder="Username">
            </div>
            <div class="form-group" style="position: relative">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputSignupEmail">Email:</label>
                <input v-model="email" type="email" class="form-control" id="inputSignupEmail" placeholder="Email">
            </div>
            <div class="form-group" style="position: relative">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputSignupPassword">Password:</label>
                <input v-model="password" type="password" class="form-control" id="inputSignupPassword" v-on:input="passwordCheck"  placeholder="Password">
            </div>
            <div class="form-group" style="position: relative">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputPasswordConfirmation">Confirmation password:</label>
                <input v-model="passwordConfirmation" type="password" class="form-control" id="inputPasswordConfirmation" v-on:input="passwordCheck" placeholder="Password confirmation">
                <p v-if="passwordsAreTheSame" style="color: limegreen;">Are the same</p>
                <p v-else style="color: red;"> Are not the same</p>

            </div>
            <button class="btn btn-primary" :class="[ !passwordsAreTheSame ? 'disabled' : '' ]" >Sign up</button>
        </form>
    </div>
</template>

<script>
    import axios from 'axios'
    import { connection } from "../variables";
    export default {
        name: "Signup",
        data() {
            return {
                name: '',
                username: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                passwordsAreTheSame: false,
                typeError: false,
                accountCreateSuccess: false,
                serverError: false
            }
        },
        methods: {
            sendSignup: async function() {
                //Everything gets checked here except the password.
                if(this.name.length <= 4  || this.username.length <= 4 || this.email.length <= 4) {
                    this.typeError = true;
                    return;
                }
                
                await axios.post(connection + 'auth/insert',{
                    name: this.name,
                    email: this.email,
                    username: this.username,
                    password: this.password
                }).then(response => {
                    console.log(response);
                    if(response.data === 'succes') {
                        this.accountCreateSuccess = true;
                    }
                }).catch(err => {
                    console.log(err);
                    this.serverError = true;
                });
            },
            passwordCheck: function() {
                if(this.password == this.passwordConfirmation && this.password.length >= 6) {
                    this.passwordsAreTheSame = true;
                }
                else {
                    this.passwordsAreTheSame = false;
                }
            }

        }
    }
</script>

<style scoped>

</style>