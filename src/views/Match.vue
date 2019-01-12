<template>
   <div class="container">
       <matchview :id="id"/>
   </div>
</template>

<script>
    import matchview from '@/components/MatchView.vue'
    export default {
        name: "Match",
        components: {
            matchview
        },
        props: {
            id: String,
        }
    }
</script>

<style scoped>

</style>