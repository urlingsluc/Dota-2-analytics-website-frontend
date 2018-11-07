<template>
    <div class="container">
        <h4>It appears that you have not yet linked a steam account to your Dota-Analytics account. Please fill in your steam id down below (You can always change this).</h4>
        <div class="row">
        <form class="offset-md-3 col-md-6" style="padding-top: 30px;" @submit.prevent="Link">
            <div class="form-group">
                <label style="text-align: left; display: block; padding-left: 20px;" for="inputSteam32">Steam32 id:</label>
                <input v-model="username" type="number" class="form-control" id="inputSteam32" placeholder="inputSteam32">
            </div>
            <button class="btn btn-primary" >Link!</button>
        </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NewUser",
        data() {
            return {
                steamId32:null
            }
        },
        methods: {
            link: async function() {

            }
        }
    }
</script>

<style scoped>

</style>