<template>
    <div>
        <div class="row">
            <div class="offset-md-1 col-md-4 offset-md-1">
                <h3>Favorite players:</h3>
                <div>
                    <!--<router-link v-for="p in favPlayers" :key="p.name" v-if="p.name">{{ p.name }}</router-link>-->
                    <p v-if="favPlayersFromApi.length === 0">You have no favorite players...</p>
                    <table v-else style="display: block; overflow: auto; overflow-x: auto; height: 400px; " class="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Avatar</th>
                            <th scope="col">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <router-link style="cursor: pointer" v-for="player in favPlayersFromApi" v-bind:key="player.profile.account_id" tag="tr" :to="{ path: 'Profile', query: { from:  player.profile.account_id.toString() }}">
                            <td><img style="border-radius:8%;" v-bind:src="player.profile.avatar"/></td>
                            <td width="100%"><div v-tooltip.right.start=player.profile.personaname>{{ player.profile.personaname | truncate(18,"...") }} </div></td>
                        </router-link>
                        </tbody>
                    </table>
                </div>
            </div>



            <div class="offset-md-1 col-md-5 offset-md-1">
                <h3>Favorite games:</h3>
                <div>
                    <p v-if="favGamesFromApi.length === 0">You have no favorite games...</p>
                    <table v-else style="display: block; overflow: auto; overflow-x: auto; height: 400px; " class="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Match id</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Radiant / Dire Kills</th>
                            <th scope="col">Who won?</th>

                        </tr>
                        </thead>
                        <tbody>

                        <router-link style="cursor: pointer" v-for="match in favGamesFromApi" v-bind:key="match.match_id" tag="tr" :to="{ path: 'match', query: { id:  match.match_id.toString() }}">

                            <td>{{ match.match_id }}</td>
                            <td>{{ match.durationFormated }}</td>
                            <td>{{ match.radiant_score }} / {{ match.dire_score }}</td>
                            <td>{{ match.radiant_win ? 'Radiant' : 'Dire'}}</td>
                        </router-link>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { connection } from "../variables";
    import parseSeconds from 'parse-seconds'
    export default {
        name: "favoriteScreen",
        data() {
            return {
                id: null,
                //Players
                favPlayers:[],
                favPlayersFromApi:[],
                //Games
                favGames:[],
                favGamesFromApi:[]
            }
        },
        async mounted() {
            this.getUser();
            this.getFavoritePlayers();
            this.getFavoriteGames();
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
                axios.get(connection + 'favgames/getall?id=' + this.id)
                    .then(async response => {
                        // console.log(response.data);
                        this.favGames = response.data;
                        for (var i = 0; i < this.favGames.length; i++) {
                            axios.get('https://api.opendota.com/api/matches/' + this.favGames[i].favId)
                                .then(innerResponse => {
                                    this.favGamesFromApi.push(innerResponse.data)

                                    for(let i = 0; i < this.favGamesFromApi.length; i++) {
                                        var parsedTime = parseSeconds({ hours: false })(this.favGamesFromApi[i].duration);
                                        if(parsedTime.seconds.toString().length === 1)
                                        {
                                            parsedTime.seconds = '0' + parsedTime.seconds
                                        }
                                        if(parsedTime.minutes.toString().length === 1)
                                        {
                                            parsedTime.minutes = '0' + parsedTime.minutes
                                        }
                                        this.favGamesFromApi[i]["durationFormated"] = parsedTime.minutes + ':' + parsedTime.seconds;
                                    }
                                }).catch(innerErr => {
                                    console.log(innerErr)
                            })
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>