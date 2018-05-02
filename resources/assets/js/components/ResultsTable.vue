<template>
    <div id="results-points">
        <table>
            <tr v-for="item in results" :key="item[0]">
                <td>{{ item[0] }}</td><td>{{ item[1] }}</td>
            </tr>
        </table>
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