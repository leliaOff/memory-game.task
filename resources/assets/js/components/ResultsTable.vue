<template>
    <div>
        
    </div>
</template>

<script>

    export default {

        data() {
            return {
                results: {},
            }
        },

        methods: {
            
            getResults() {
                
                axios.get('results').then(response => {     
                    this.results = response.data;
                }).catch(error => {
                    // ...
                });

            },
            
        },

        mounted() {
            this.getResults();
        }

    }
</script>