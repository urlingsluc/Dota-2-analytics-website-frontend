<template >
    <!--v-for="match in matches" :key="match.lobby_id"-->
    <div>
        <div>
            <h2>
                Welcome to dota 2 analytics
            </h2>
            <p>
                On this website you will find several interesting stats about your dota 2 games and of your favorite pro-player
            </p>
        </div>
        <div>
            <h4>Current matches with pro-players going on:</h4>
            <div class="row flex-row flex-nowrap" style="overflow-x: auto;">
                <div class="col-3" style="display: flex;" v-for="match in matches.slice(0, 14)" :key="match.lobby_id" v-if="checkIfNotablePlayersMoreThanZero(match)">
                    <div class="card" style="width: 15rem; padding: 12px; margin-bottom: 10px;">
                        <div>
                            <h5 style="float: inside "><span style="float: left; color: #66bb6a;">{{ match.radiant_score }}</span> Kills <span style="float: right; color: #ff4c4c;">{{ match.dire_score }}</span></h5>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="background-color: #66bb6a !important;" role="progressbar" v-bind:style="{width: ((match.radiant_score / (match.radiant_score + match.dire_score)) * 100) + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar" style="background-color: #ff4c4c !important;" role="progressbar" v-bind:style="{width: ((match.dire_score / (match.radiant_score + match.dire_score)) * 100) + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Avg MMR: {{ match.average_mmr }}</h5>
                            <h6>Notable Players:</h6>
                            <div style="white-space: nowrap;overflow: hidden;text-overflow: clip;" v-for="notablePlayers in match.players" :key="notablePlayers.account_id" v-if="notablePlayers.name"><div style="margin-left: 10px; margin-bottom: 10px; float: left;" v-for="hero in heroesData" :key="hero.id" v-if="hero.id === notablePlayers.hero_id"><img :alt="hero.heroName" :src="hero.file"><router-link v-tooltip.bottom.start=notablePlayers.name  style="margin-left: 20px;" :to="{ path: 'Profile', query: { from:  notablePlayers.account_id.toString() }}" >{{ notablePlayers.name | truncate(7, '...') }} </router-link></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { heroesData } from '../variables.js'

    export default {
        name: "homescreen",
        components: {

        },
        data() {
            return {
                matches: [],
                heroesData:heroesData,
            }
        },
        async mounted() {
            this.getLiveProMatches()
        },
        methods: {
            async getLiveProMatches() {
                axios.get('https://api.opendota.com/api/live')
                    .then(response => {
                        response.data.sort(function(a,b) {
                            return b.average_mmr - a.average_mmr
                        });
                        this.matches = response.data;
                    })
            },
            checkIfNotablePlayersMoreThanZero(match) {
                var amountPlayers = 0;
                for (var i = 0; i < match.players.length; i++) {
                    if(match.players[i].name) {
                        amountPlayers++;
                    }
                }
                if(amountPlayers > 0) {
                    return true;
                }
                else {
                    return false;
                }

            }
        }
    }
</script>

<style scoped>
    .vue-tooltip{background-color:#000;box-sizing:border-box;color:#fff;max-width:320px;padding:6px 10px;border-radius:3px;z-index:100;box-shadow:2px 2px 3px rgba(0,0,0,0.4)}.vue-tooltip.vue-tooltip-hidden{transform:translateX(-100000px) !important}.vue-tooltip .vue-tooltip-content{text-align:center}.vue-tooltip .tooltip-arrow{content:'';width:0;height:0;border-style:solid;position:absolute;margin:5px}.vue-tooltip[x-placement^="top"]{margin-bottom:5px}.vue-tooltip[x-placement^="top"] .tooltip-arrow{border-width:5px 5px 0 5px;border-top-color:#000;border-bottom-color:transparent !important;border-left-color:transparent !important;border-right-color:transparent !important;bottom:-5px;margin-top:0;margin-bottom:0}.vue-tooltip[x-placement^="bottom"]{margin-top:5px}.vue-tooltip[x-placement^="bottom"] .tooltip-arrow{border-width:0 5px 5px 5px;border-bottom-color:#000;border-top-color:transparent !important;border-left-color:transparent !important;border-right-color:transparent !important;top:-5px;margin-top:0;margin-bottom:0}.vue-tooltip[x-placement^="right"]{margin-left:5px}.vue-tooltip[x-placement^="right"] .tooltip-arrow{border-width:5px 5px 5px 0;border-right-color:#000;border-top-color:transparent !important;border-left-color:transparent !important;border-bottom-color:transparent !important;left:-5px;margin-left:0;margin-right:0}.vue-tooltip[x-placement^="left"]{margin-right:5px}.vue-tooltip[x-placement^="left"] .tooltip-arrow{border-width:5px 0 5px 5px;border-left-color:#000;border-top-color:transparent !important;border-right-color:transparent !important;border-bottom-color:transparent !important;right:-5px;margin-left:0;margin-right:0}
</style>