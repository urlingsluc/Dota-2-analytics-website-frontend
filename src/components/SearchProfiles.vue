<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-4"  v-for="profile in profiles" :key="profile.account_id">
                <div class="thumbnail">
                    <img v-bind:src="profile.avatarfull" style="border-radius:2%;" alt="avatar">
                    <div class="caption">
                        <h3>{{ profile.personaname }}</h3>
                        <p><router-link class="btn btn-primary" :to="{ path: 'Profile', query: { from:  profile.account_id.toString() }}" > Go to Profile</router-link> </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "SearchProfiles",
        props: {
            q:String
        },
        data() {
            return {
                profiles: []
            }
        },
        methods: {
            async getProfilesFromSearch() {
                await axios.get('https://api.opendota.com/api/search?q=' + this.q)
                    .then(response => {
                        this.profiles = response.data
                    })
            }
        },
        async mounted() {
            await this.getProfilesFromSearch();
        }
    }
</script>

<style scoped>

</style>