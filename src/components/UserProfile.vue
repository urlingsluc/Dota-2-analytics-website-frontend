<template>
    <div class="container">
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active show" data-toggle="tab" href="#Profile">Profile</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#Matches">Matches</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#Overall_stats">Overall stats</a>
            </li>
        </ul>

        <div id="myTabContent" class="tab-content" style="margin-top: 25px;">
            <!--.Profile-->
            <div class="tab-pane fade active show" id="Profile" >
                <div class="row">
                    <div class="col-xs-12 col-md-3">
                        <img alt="Avatar" style="width: 100%; border-radius:2%;" v-bind:src="profilePicture">
                        <a v-bind:href=profileUrl target="_blank" class="btn btn-block btn-primary" style="margin-top: 35px;  width: 100%">Steam Profile</a>
                    </div>
                    <div class="col-xs-12 col-md-4">
                        <h3 class="midText">{{ profileName }}</h3>
                        <p class="midText">Solo MMR: {{ profileSoloMMR }}</p>
                        <p class="midText">Party MMR: {{ profilePartyMMR }}</p>
                        <p class="midText">Estimated MMR: {{ profileEstMMR }}</p>
                        <p class="midText">Last match: {{ lastMatchRecorded }}</p>
                    </div>
                    <div class="col-xs-12 col-md-5">
                        <h5>Players this player has played with</h5>
                        <table style="display: block; overflow: auto; overflow-x: auto;   height: 400px; " class="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Avatar</th>
                                <th scope="col">Name</th>
                                <th scope="col">Games played with</th>
                                <th scope="col">Winrate with</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="peer in profilePeers" v-bind:key="peer.account_id">
                                <th scope="row"><img style="border-radius:2%;"  v-bind:src="peer.avatar"/></th>
                                <td><router-link style="display: block;width: 125px;overflow: hidden;white-space: nowrap;-ms-text-overflow: ellipsis;text-overflow: ellipsis;" :to="{ path: 'Profile', query: { from:  peer.account_id.toString() }}" >{{ peer.personaname }}</router-link></td>
                                <!--TODO CONTINUE HERE-->
                                <td>{{ peer.with_games }}</td>
                                <td>{{ (peer.with_win / peer.with_games * 100).toFixed(2) }}%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!--.Matches-->
            <div class="tab-pane fade" id="Matches">
                <h4>Your recent matches</h4>
                <table id="matchTable" class="table table-hover display">
                    <thead>
                    <tr>
                        <th scope="col">Match id</th>
                        <th scope="col">Hero</th>
                        <th scope="col">duration</th>
                        <th scope="col">Outcome</th>
                        <th scope="col">Radiant or Dire</th>
                        <th scope="col">K/D/A</th>
                    </tr>
                    </thead>
                    <tbody  >
                    <router-link style="cursor: pointer" v-for="match in matches" :key="match.match_id" :class="[match.playerWon ? 'table-success' : 'table-danger']" tag="tr" :to="{ path: 'match', query: { id:  match.match_id.toString() }}">
                        <td>{{ match.match_id }}</td>
                        <!--<td><img :src="getPicture(match.hero_id)"></td>-->
                        <td><div v-for="hero in heroesData" :key="hero.id" v-if="hero.id === match.hero_id"><img :alt="hero.heroName" :src="hero.file"><span hidden>{{ hero.heroName }}</span></div></td>
                        <td>{{ match.durationFormated }}</td>
                        <td>{{ match.playerWon ? 'Won' : 'Lost' }}</td>
                        <td>{{ match.isRadiant ? 'Radiant' : 'Dire'}}</td>
                        <td>{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
                    </router-link>
                    </tbody>
                </table>

            </div>
            <!--.Overall Stats-->
            <div class="tab-pane fade" id="Overall_stats">
                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.</p>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import { heroesData } from '../variables.js'
    import { connection } from "../variables";
    import parseSeconds from 'parse-seconds'

    import JQuery from 'jquery'
    import dt from 'datatables.net';
    import dtbs4 from 'datatables.net-bs4';
    const $ = JQuery;

    import convertor from 'steam-id-convertor';
    export default {
        name: "UserProfile",
        components: {

        },
        props: {
            userSteamId32: String
        },
        data() {
            return {
                id:null,
                name:'',
                steamId32: null,
                steamId64: null,

                //Api data
                profilePicture: '',
                profileName: '',
                profileUrl: '',
                profileSoloMMR: null,
                profilePartyMMR: null,
                profileEstMMR: null,
                lastMatchRecorded: null,
                profilePeers: [],
                //https://api.opendota.com/api/players/134617022/matches


                //hero

                //matchData
                matches: [],
                heroesData:heroesData
            }
        },
        async mounted() {
            console.log('ayoooooooooo');
            this.steamId32 = Number(this.userSteamId32);
            this.steamId64 = convertor.to64(this.steamId32);
            console.log(this.steamId32);
            console.log(this.steamId64);
            await this.getUserprofile();
            await this.getMatches();


        },
        methods: {
            async getUserprofile() {
                await axios.get('https://api.opendota.com/api/players/' + this.steamId32)
                    .then(response => {
                        // console.log(response.data);
                        this.profilePicture = response.data.profile.avatarfull;
                        this.profileName = response.data.profile.personaname;
                        this.profileUrl = response.data.profile.profileurl;
                        this.profileSoloMMR = response.data.solo_competitive_rank;
                        this.profilePartyMMR = response.data.competitive_rank;
                        this.profileEstMMR = response.data.mmr_estimate.estimate;
                        // this.lastMatchRecorded = moment(response.data.tracked_until,"x").format("DD MMM YYYY hh:mm a")
                        this.lastMatchRecorded = moment.unix("1544339710").subtract(1, 'months').format("DD MMM YYYY hh:mm a")
                    });
                await axios.get('https://api.opendota.com/api/players/' + this.steamId32 + '/peers')
                    .then(response => {
                        // console.log(response.data);
                        this.profilePeers = response.data;
                    });
            },
            async getMatches() {
                // await axios.get('https://api.opendota.com/api/heroes')
                //     .then(response => {
                //
                //     });
                console.log(heroesData);
                await axios.get('https://api.opendota.com/api/players/' + this.steamId32 + '/matches')
                    .then(response => {
                        this.matches = response.data;

                        for(let i = 0; i < this.matches.length; i++) {
                            var result;
                            var parsedTime = parseSeconds({ hours: false })(this.matches[i].duration);
                            if(parsedTime.seconds.toString().length === 1)
                            {
                                parsedTime.seconds = '0' + parsedTime.seconds
                            }
                            if(parsedTime.minutes.toString().length === 1)
                            {
                                parsedTime.minutes = '0' + parsedTime.minutes
                            }
                            this.matches[i]["durationFormated"] = parsedTime.minutes + ':' + parsedTime.seconds;
                            if(this.matches[i].player_slot < 128) {
                                this.matches[i]["isRadiant"] = true;
                                if (this.matches[i].radiant_win) {
                                    result = true;
                                }
                                else {
                                    result = false;
                                }
                            }
                            else {
                                this.matches[i]["isRadiant"] = false;
                                if (this.matches[i].radiant_win) {
                                    result = false;
                                }
                                else {
                                    result = true;
                                }
                            }
                            this.matches[i]["playerWon"] = result;
                        }
                        this.applyDataTablesFunction();
                        // console.log(this.matches);
                    });


            },
            // getPicture(heroId) {
            //     var hero = {
            //         file: "-"
            //     };
            //     heroesData.forEach(function(entry) {
            //         if(heroId === entry.id) {
            //             hero = entry;
            //         }
            //     });
            //     return hero.file
            // },


            applyDataTablesFunction() {
                $(document).ready(function() {
                    $('#matchTable').DataTable({
                        "order": [[ 0, "desc" ]]
                    });
                } );

                // setTimeout(function() { $('#matchTable').DataTable(); }, 10000);

            }
        }
    }


</script>
<style scoped>
    .midText {
        text-align: left;
    }
</style>