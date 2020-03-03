const vm = new Vue({
    el: '#app',
    data: {
        results: []
    },
    mounted() {
        this.getPosts()
    },
    methods: {
        getPosts() {
            axios.get("https://wvgpmj09ce.execute-api.ap-northeast-1.amazonaws.com/dev/students/morita/plants/1")
                .then(response => {
                    this.results = response.data.items
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
});