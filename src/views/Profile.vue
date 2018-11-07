<template>
    <div>
        <NewUser v-if="newUser"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import NewUser from '@/components/NewUser.vue'
    export default {
        name: "Profile",
        components: {
            NewUser
        },
        data() {
            return {
                id:null,
                name:'',
                email:'',
                steamId32: null,
                newUser:false
            }
        },
        methods: {

        },
        async mounted() {
            var user = JSON.parse(localStorage.getItem('user'));
            console.log('Class: default, Function: mounted, Line: 22');
            console.log(user);

            this.id = user.id;
            this.name = user.name;
            this.email = user.email;
            this.steamId32 = user.steamId32;

            if(this.steamId32 === 0) {
                this.newUser = true
            }

        }
    }
</script>

<style scoped>

</style>