<template>
    <div class="container">
        <span v-if="!loaded" class="fa fa-refresh fa-spin" style="font-size:24px;color: #2c3e50"></span>
        <div v-else>
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
                            <h3 class="midText">{{ profileName }} <span v-if="loggedIn && myProfile" class="btn btn-success" style="float: right;" @click="unlinkProfile">unlink</span><span v-else-if="loggedIn" style="float: right;" class="btn" v-bind:class="[favorite ? 'btn-danger' : 'btn-success']" @click="updateFavorite"><i v-bind:class="[favorite ? 'fa fa-star' : 'fa fa-star-o']"></i></span></h3>
                            <p v-if="profileSoloMMR" class="midText">Solo MMR: {{ profileSoloMMR }}</p>
                            <p v-if="profilePartyMMR" class="midText">Party MMR: {{ profilePartyMMR }}</p>
                            <p v-if="profileEstMMR" class="midText">Estimated MMR: {{ profileEstMMR }}</p>
                            <p v-if="lastMatchRecorded" class="midText">Last match: {{ lastMatchRecorded }}</p>
                        </div>
                        <div class="col-xs-12 col-md-5">
                            <h5>Players this player has played with</h5>
                            <table style="display: block; overflow: auto; overflow-x: auto; height: 400px; " class="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">Avatar</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Games played with</th>
                                    <th scope="col">Winrate with</th>
                                </tr>
                                </thead>
                                <tbody>
                                <router-link style="cursor: pointer" v-for="peer in profilePeers" v-bind:key="peer.account_id" tag="tr" :to="{ path: 'Profile', query: { from:  peer.account_id.toString() }}">
                                    <th scope="row"><img style="border-radius:8%;"  v-bind:src="peer.avatar"/></th>
                                    <td><div v-tooltip.bottom.start=peer.personaname  >{{ peer.personaname | truncate(10 , '...') }}</div></td>
                                    <!--TODO CONTINUE HERE-->
                                    <td>{{ peer.with_games }}</td>
                                    <td>{{ (peer.with_win / peer.with_games * 100).toFixed(2) }}%</td>
                                </router-link>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!--.Matches-->
                <div class="tab-pane fade" id="Matches">
                    <h4>Your recent matches</h4>
                    <p v-if="smallMatchSet">Currently your last 250 matches are shown, if you want all matches to be shown please click <span style="color: #18BC9C; cursor: pointer;" @click="getAllMatches">here</span> (please note that this may take a few seconds!)</p>
                    <table id="matchTable" class="table table-hover display">
                        <thead>
                        <tr>
                            <th scope="col">Match id</th>
                            <th scope="col">Hero</th>
                            <th scope="col">Duration</th>
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
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import { heroesData } from '../variables.js'
    import { connection } from "../variables";
    import parseSeconds from 'parse-seconds'
    import { EventBus } from "../event-bus";

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
                //Loading
                loaded: false,
                loggedIn:false,
                myProfile: false,
                favorite: false,
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



                //matchData
                matches: [],
                //loading boolean
                smallMatchSet: true,
                //heroes
                heroesData:heroesData
            }
        },
        async mounted() {
            var timer = new Date();
            this.steamId32 = Number(this.userSteamId32);
            console.log('sid32: ' + this.steamId32);
            this.steamId64 = convertor.to64(this.steamId32);
            await this.requests_handler();
            this.checkIfPlayerLoggedIn();
            if(this.loggedIn)this.checkIfMyProfile();
            if(this.loggedIn && !this.myProfile) this.checkIfFavoritePlayer();
            console.log('The time is: ' + (new Date() - timer) + 'ms')
        },
        methods: {
            async getAllMatches() {
                this.loaded = false;
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
                                result = this.matches[i].radiant_win;
                            }
                            else {
                                this.matches[i]["isRadiant"] = false;
                                result = !this.matches[i].radiant_win;
                            }
                            this.matches[i]["playerWon"] = result;
                        }
                        this.loaded = true;
                        this.smallMatchSet = false;
                        this.applyDataTablesFunction();
                    });
            },
            applyDataTablesFunction() {
                $(document).ready(function() {
                    $('#matchTable').DataTable({
                        "order": [[ 0, "desc" ]]
                    });
                });
                // setTimeout(function() { $('#matchTable').DataTable(); }, 10000);
            },
            async requests_handler() {
                await axios.all([
                    this.request_1(), //or direct the axios request
                    this.request_2(),
                    this.request_3()
                ])
                    .then(axios.spread((player_response, player_peers_response, matches_response) => {
                        // Profile
                        this.profilePicture = player_response.data.profile.avatarfull;
                        this.profileName = player_response.data.profile.personaname;
                        this.profileUrl = player_response.data.profile.profileurl;
                        this.profileSoloMMR = player_response.data.solo_competitive_rank;
                        this.profilePartyMMR = player_response.data.competitive_rank;
                        this.profileEstMMR = player_response.data.mmr_estimate.estimate;
                        if (player_response.data.tracked_until) {
                            this.lastMatchRecorded = moment.unix(player_response.data.tracked_until).subtract(1, 'months').format("DD MMM YYYY hh:mm a")
                        }

                        // Profile Peers
                        this.profilePeers = player_peers_response.data;

                        // Matches

                        this.matches = matches_response.data;

                        for(let i = 0; i < this.matches.length; i++) {
                            var result;
                            var parsedTime = parseSeconds({hours: false})(this.matches[i].duration);
                            if (parsedTime.seconds.toString().length === 1) {
                                parsedTime.seconds = '0' + parsedTime.seconds
                            }
                            if (parsedTime.minutes.toString().length === 1) {
                                parsedTime.minutes = '0' + parsedTime.minutes
                            }
                            this.matches[i]["durationFormated"] = parsedTime.minutes + ':' + parsedTime.seconds;
                            if (this.matches[i].player_slot < 128) {
                                this.matches[i]["isRadiant"] = true;
                                result = this.matches[i].radiant_win;
                            } else {
                                this.matches[i]["isRadiant"] = false;
                                result = !this.matches[i].radiant_win;
                            }
                            this.matches[i]["playerWon"] = result;
                        }
                        this.applyDataTablesFunction();
                        this.loaded = true;
                    }))
                    .catch(err => {
                        console.log(err)
                    })
            },
            request_1() {
                return axios.get('https://api.opendota.com/api/players/' + this.steamId32);
            },
            request_2() {
                return axios.get('https://api.opendota.com/api/players/' + this.steamId32 + '/peers');
            },
            request_3() {
                return axios.get('https://api.opendota.com/api/players/' + this.steamId32 + '/matches?limit=250');
            },
            checkIfMyProfile() {
                const data = JSON.parse(localStorage.getItem('user'));
                if (data.steamId32 === this.steamId32) {
                    this.myProfile = true;
                }
            },
            async unlinkProfile() {
                const data = JSON.parse(localStorage.getItem('user'));
                await axios.post(connection + 'user/setsteamid',{
                    id:data.id,
                    steamId32: 0
                }).then(response => {
                    // console.log(response);
                    // console.log('Class: methods, Function: LinkProfile, Line: 38');
                    // console.log(user);
                    // userParsed.steamId32 = steamId32;
                    data.steamId32 = 0;
                    data.steamId64 = 0;
                    localStorage.setItem('user', JSON.stringify(data));
                    EventBus.$emit('changeSteamId32', 0);
                    // location.reload(true);
                    this.$router.push('myprofile?from=' + 0);

                }).catch(err => {
                    console.log(err);
                })
            },
            checkIfPlayerLoggedIn() {
                var data = localStorage.getItem('user');
                if(data) {
                    this.loggedIn = true;
                }
            },
            async checkIfFavoritePlayer() {
                const data = JSON.parse(localStorage.getItem('user'));
                await axios.post(connection + 'favplayers/isfavorite',{
                    id:data.id,
                    playerId: this.steamId32
                }).then(response => {
                    this.favorite = response.data
                }).catch(err => {
                    console.log(err)
                })
            },
            async updateFavorite() {
                const data = JSON.parse(localStorage.getItem('user'));
                await axios.post(connection + 'favplayers/updateplayer', {
                    id: data.id,
                    playerId: this.steamId32
                }).then(response => {

                })
                this.checkIfFavoritePlayer();
                // if(this.favorite) {
                //     this.favorite = false
                // }
                // else {
                //     this.favorite = true
                // }
            }
        }
    }


</script>
<style scoped>
    .midText {
        text-align: left;
    }
</style>