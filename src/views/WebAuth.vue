<template>
    <div class="container">
        <div v-if="doLogin">
            <div class="row">
                <div class="col-sm-12 offset-lg-1 col-lg-4">
                    <h3 style="text-align: left; padding:40px;">Login</h3>
                    <Login />
                    <button class="btn btn-secondary" style="margin-top: 15px;" v-on:click="doLogin = !doLogin">Sign up</button>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-sm-12 offset-lg-1 col-lg-4">
                    <h3 style="text-align: left; padding:40px;">Sign up</h3>
                    <Signup/>
                    <button class="btn btn-secondary" style="margin-top: 15px;" v-on:click="doLogin = !doLogin">Login</button>
                </div>
            </div></div>
    </div>
</template>

<script>
    import Login from '@/components/LogIn.vue'
    import Signup from '@/components/SignUp.vue'
    export default {
        name: "webAuth",
        components: {
            Login,
            Signup
        },
        data() {
            return {
                doLogin: true,
            }
        },
    }
</script>

<style scoped>

</style>