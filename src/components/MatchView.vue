<template>
    <div>
        <div>
            <h3><span v-if="match.radiant_win" style="color: #66bb6a;">Radiant win</span><span v-else style="color: #ff4c4c;">Dire win</span><span v-if="loggedIn" style="float: right;" class="btn" v-bind:class="[favorite ? 'btn-danger' : 'btn-success']" @click="updateFavorite"><i v-bind:class="[favorite ? 'fa fa-star' : 'fa fa-star-o']"></i></span></h3>
            <h3><span style="color: #66bb6a; margin-right: 75px;">{{ match.radiant_score }}</span><span style="color: #ff4c4c; margin-left: 75px;">{{ match.dire_score }}</span></h3>

        </div>
    <div class="row">
        <h3 class="offset-md-2" style="color: #66bb6a;">Radiant<span v-if="match.radiant_win" style="opacity: 0.7;"><sup>  Winner</sup></span></h3>
        <div style="overflow-x: auto;" class="offset-md-1 col-md-10">
            <table id="matchTable" class="table table-hover table-bordered display">
                <thead>
                <tr>
                    <th scope="col">Hero</th>
                    <th scope="col">Player name</th>
                    <th scope="col">Level</th>
                    <th scope="col">K</th>
                    <th scope="col">D</th>
                    <th scope="col">A</th>
                    <th scope="col">Lh / DN</th>
                    <th scope="col">HD</th>
                    <th scope="col">HH</th>
                    <th scope="col">TD</th>
                    <th scope="col">G</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="player in match.players" :key="player.account_id" v-if="player.player_slot < 128">
                    <td width="10%"><div v-for="hero in heroesData" :key="hero.id" v-if="hero.id === player.hero_id"><img :alt="hero.heroName" :src="hero.file"><span hidden>{{ hero.heroName }}</span></div></td>
                    <td width="10%"><span v-if="player.personaname"><router-link  :to="{ path: 'profile', query: { from:  player.account_id.toString() }} ">{{ player.personaname }} </router-link></span><span v-else>undefined</span></td>
                    <td width="10%">{{ player.level }}</td>
                    <td width="5%">{{ player.kills }}</td>
                    <td width="5%">{{ player.deaths }}</td>
                    <td width="5%">{{ player.assists }}</td>
                    <td width="10%">{{ player.last_hits }} / {{ player.denies }}</td>
                    <td width="10%">{{ player.hero_damage }}</td>
                    <td width="10%">{{ player.hero_healing }}</td>
                    <td width="10%">{{ player.tower_damage }}</td>
                    <td width="10%">{{ player.total_gold }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3 class="offset-md-2" style="color: #ff4c4c;">Dire <span v-if="!match.radiant_win" style="opacity: 0.7;"><sup>  Winner</sup></span></h3>
        <div style="overflow-x: auto;" class="offset-md-1 col-md-10">
            <table id="matchTable" class="table table-hover table-bordered display">
                <thead>
                <tr>
                    <th scope="col">Hero</th>
                    <th scope="col">Player name</th>
                    <th scope="col">Level</th>
                    <th scope="col">K</th>
                    <th scope="col">D</th>
                    <th scope="col">A</th>
                    <th scope="col">Lh / DN</th>
                    <th scope="col">HD</th>
                    <th scope="col">HH</th>
                    <th scope="col">TD</th>
                    <th scope="col">G</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="player in match.players" :key="player.account_id" v-if="player.player_slot >= 128">
                    <td width="10%"><div v-for="hero in heroesData" :key="hero.id" v-if="hero.id === player.hero_id"><img :alt="hero.heroName" :src="hero.file"><span hidden>{{ hero.heroName }}</span></div></td>
                    <td width="10%"><span v-if="player.personaname"><router-link  :to="{ path: 'profile', query: { from:  player.account_id.toString() }} ">{{ player.personaname }} </router-link></span><span v-else>undefined</span></td>
                    <td width="10%">{{ player.level }}</td>
                    <td width="5%">{{ player.kills }}</td>
                    <td width="5%">{{ player.deaths }}</td>
                    <td width="5%">{{ player.assists }}</td>
                    <td width="10%">{{ player.last_hits }} / {{ player.denies }}</td>
                    <td width="10%">{{ player.hero_damage }}</td>
                    <td width="10%">{{ player.hero_healing }}</td>
                    <td width="10%">{{ player.tower_damage }}</td>
                    <td width="10%">{{ player.total_gold }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { heroesData } from '../variables.js'
    import { connection } from "../variables";
    export default {
        name: "matchview",
        props: {
            id:String
        },
        data() {
            return {
                match_id:null,
                heroesData:heroesData,
                match: [],
                loggedIn:false,
                favorite: false
            }
        },
        async mounted() {
            this.match_id = parseInt(this.id);
            this.getMatch();

            this.checkIfPlayerLoggedIn();
            if(this.loggedIn) this.checkIfFavoriteGame();

        },
        methods: {
            async getMatch() {
                await axios.get('https://api.opendota.com/api/matches/' + this.match_id)
                    .then(response => {
                        console.log(response.data);
                        this.match = response.data;
                    })
            },
            async updateFavorite() {
                const data = JSON.parse(localStorage.getItem('user'));
                await axios.post(connection + 'favgames/updategame', {
                    id: data.id,
                    gameId: this.match_id
                }).then(response => {
                    console.log(this.match_id)
                })
                this.checkIfFavoriteGame()
            },
            checkIfPlayerLoggedIn() {
                var data = localStorage.getItem('user');
                if(data) {
                    this.loggedIn = true;
                }
            },
            async checkIfFavoriteGame() {
                const data = JSON.parse(localStorage.getItem('user'));
                await axios.post(connection + 'favgames/isfavorite',{
                    id: data.id,
                    gameId: this.match_id
                }).then(response => {
                    this.favorite = response.data
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
</style>