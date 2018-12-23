<template>
    <div>
        <div class="row">
            <div class="offset-md-1 col-md-4 offset-md-1">
                <h3>Favorite players:</h3>
                <div>
                    <router-link v-for="p in favPlayers" :key="p.name" v-if="p.name">{{ p.name }}</router-link>
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th width="30%" scope="col">Avatar</th>
                            <th width="70%" scope="col">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="player in favPlayersFromApi" v-bind:key="player.profile.account_id">
                            <th scope="row" style="width: 30%;"><img style="border-radius:2%;"  v-bind:src="player.profile.avatar"/></th>
                            <td style=""><router-link v-tooltip.bottom.start=player.profile.personaname :to="{ path: 'Profile', query: { from:  player.profile.account_id.toString() }}" >{{ player.profile.personaname | truncate(18,"...") }}</router-link></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="offset-md-1 col-md-5 offset-md-1">
                <h3>Favorite heroes:</h3>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { connection } from "../variables";
    export default {
        name: "favoriteScreen",
        data() {
            return {
                id: null,
                favPlayers:[],
                favPlayersFromApi:[]
            }
        },
        async mounted() {
            this.getUser();
            this.getFavoritePlayers()
        },
        methods: {
            getUser() {
                var data = JSON.parse(localStorage.getItem('user'));
                this.id = data.id;
            },
            async getFavoritePlayers() {
                axios.get(connection + 'favplayers/getall?id=' + this.id)
                    .then(async response => {
                        // console.log(response.data);
                        this.favPlayers = response.data;
                        for (var i = 0; i < this.favPlayers.length; i++) {
                            axios.get('https://api.opendota.com/api/players/' + this.favPlayers[i].favId)
                                .then(innerResponse => {
                                    // console.log(innerResponse);
                                    if(innerResponse.data.profile) {
                                        this.favPlayersFromApi.push(innerResponse.data)
                                    }
                                }).catch(innerErr => {
                                    console.log(innerErr)
                                })

                        }
                    }).catch(err => {
                        console.log(err)
                })
            },
            async getFavoriteGames() {
                axios.get(connection + 'favplayers/getall?id=' + this.id)
                    .then(response => {

                    })
            }
        }
    }
</script>

<style scoped>

</style>