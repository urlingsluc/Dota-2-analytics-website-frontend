<template>
    <div class="container">
        <h4>It appears that you have not yet linked a steam account to your Dota-Analytics account. Please fill in your steam id down below (You can always change this). </h4>
        <h6>You can find your steamid32 by filling in by using the filling in your steam profile url on this website: <a href="https://steamid.xyz/" target="_blank">steamid.xy</a></h6>

        <div class="row" style="padding-bottom: 30px;">
            <form class="offset-md-3 col-md-6" style="padding-top: 30px;" @submit.prevent="search">
                <div class="form-group">
                    <label style="text-align: left; display: block; padding-left: 20px;" for="inputSteamName">Steam In-game name:</label>
                    <input v-model="query" type="text" class="form-control" id="inputSteamName" placeholder="Steam Name">
                </div>
                <button class="btn btn-primary" >Link!</button>
            </form>
        </div>

        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-4"  v-for="profile in profiles" :key="profile.account_id">
                <div class="thumbnail">
                    <img v-bind:src="profile.avatarfull" style="border-radius:2%;" alt="avatar">
                    <div class="caption">
                        <h3>{{ profile.personaname }}</h3>
                        <!--<p><router-link class="btn btn-primary" :to="{ path: 'Profile', query: { from:  profile.account_id.toString() }}" > Go to Profile</router-link> </p>-->
                        <button class="btn btn-primary"  v-on:click="Link(profile.account_id)">Link!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';
    import { EventBus } from '../event-bus.js'
    export default {
        name: "NewUser",
        data() {
            return {
                steamId32:null,
                profiles: [],
                query:''
            }
        },
        methods: {
            search:async function() {
                await axios.get('https://api.opendota.com/api/search?q=' + this.query)
                    .then(response => {
                        this.profiles = response.data;
                        console.log(this.profiles);
                    })
            },


            Link: async function(steamId32) {
                var user = localStorage.getItem('user');
                var userParsed = JSON.parse(user);
                var id = userParsed.id;
                await axios.post('http://localhost:9999/user/setsteamid',{
                    id:id,
                    steamId32: steamId32
                }).then(response => {
                    console.log(response);
                    console.log('Class: methods, Function: LinkProfile, Line: 38');
                    console.log(user);
                    userParsed.steamId32 = steamId32;
                    localStorage.setItem('user', JSON.stringify(userParsed));
                    EventBus.$emit('changeSteamId32', steamId32);
                    location.reload(true);
                    this.$router.push('Profile?from=' + steamId32);

                }).catch(err => {
                    console.log(err);
                })
            },





            // LinkProfile: async function() {
            //     var user = localStorage.getItem('user');
            //     var userParsed = JSON.parse(user);
            //     var id = userParsed.id;
            //     await axios.post('http://localhost:9999/user/setsteamid',{
            //         id:id,
            //         steamId32: this.steamId32
            //     }).then(response => {
            //         console.log(response);
            //         console.log('Class: methods, Function: LinkProfile, Line: 38');
            //         console.log(user);
            //
            //
            //
            //
            //
            //
            //
            //
            //
            //         userParsed.steamId32 = this.steamId32;
            //
            //         localStorage.setItem('user', JSON.stringify(userParsed));
            //         EventBus.$emit('changeSteamId32', this.steamId32);
            //         location.reload(true);
            //         this.$router.push('Profile?from=' + this.steamId32);
            //
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }
        }
    }
</script>

<style scoped>

</style>