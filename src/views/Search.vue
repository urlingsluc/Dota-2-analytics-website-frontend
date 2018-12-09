<template>
    <div class="container">
        <SearchProfiles :q="q"/>
    </div>
</template>

<script>
    import SearchProfiles from '@/components/SearchProfiles.vue'
    export default {
        name: "Search",
        components: {
            SearchProfiles
        },
        props: {
            q:String
        }
    }
</script>

<style scoped>

</style>