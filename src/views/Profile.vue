<template >
    <div class="container">
        <NewUser v-if="newUser"/>
        <UserProfile v-else :userSteamId32="from"/>
    </div>
</template>

<script>
    import NewUser from '@/components/NewUser.vue'
    import UserProfile from '@/components/UserProfile.vue'
    export default {
        name: "Profile",
        components: {
            NewUser,
            UserProfile
        },
        props: {
            from: String
        },
        data() {
            return {
                newUser: true
            }
        },
        methods: {
            // async load()
            // {
            //     var user = JSON.parse(localStorage.getItem('user'));
            //     console.log('Class: default, Function: mounted, Line: 22');
            //     console.log(user);
            //
            //     this.id = user.id;
            //     this.name = user.name;
            //     // this.email = user.email;
            //     this.steamId32 = user.steamId32;
            //     this.steamId64 = user.steamId64;
            // },
            async whatProfile() {
                if(this.from === "0") {
                    //dont do anything because its a new user. And a new user is automatically shown.
                }
                else if(this.from) {
                    var str = this.from;
                    //check if it contains strings
                    if (str.match(/\D+/)) {
                        console.log("CONTAINS LETTERS");
                        this.$router.push("/");
                        return;
                    }

                    //Any user.
                    this.newUser = false;
                    // this.steamId32 = this.from;
                    // this.steamId64 = convertor.to64(this.from);
                    console.log("EXISTS");
                }
                else {

                }
            }
        },
        async mounted() {
            // this.load();
            this.whatProfile();
        }
    }
</script>

<style scoped>

</style>