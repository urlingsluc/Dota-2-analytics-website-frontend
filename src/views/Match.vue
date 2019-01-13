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
        },
        beforeMount() {
            if(this.id === undefined) {
                this.$router.push("/notfound")
            }
        }
    }
</script>

<style scoped>

</style>