<template>
    <div class="Article">
        <section class="shadow article-post">
            <section class="mb-4" v-if="checkUser == user_id">
                <button  class="btn btn-danger" @click="delPost">Supprimer</button> <button class="btn btn-secondary" @click="editPost">Edit</button>
            </section>
            <h1>{{ article.title }}</h1>
            <p>{{ article.content_txt }}</p>
            <p>Ajouté par : {{ article.first_name }} {{ article.last_name }}</p>
            <hr/>
            <button class="btn btn-primary" @click="addReply">Ajouter un commentaire</button>
        </section>
        <section class="mt-5">
            {{ replyPost }}
        </section>
    </div>
</template>

<script>
export default {
    name: 'Article',

    data() {
        return{
            article: null,
            checkUser: null,
            user_id: sessionStorage.getItem('userId'),
            replyPost: null
        }
    },

    mounted: function(){
        const id = this.$route.params.id;
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        fetch("http://localhost:3000/api/article/" + id, { headers })
            .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            if (!data.DATA[0]){
                this.article = {title: "Erreur Article Introuvable"}
            }else{
                this.article = data.DATA[0];
                this.checkUser = data.DATA[0].user_id;
            }
            console.log(this.article);
            })
            .catch(error => {
            this.errorMessage = error;
            console.error("There was an error!", error);
            });
    },
    methods: {
        delPost(){
            console.log("Delete Post")
        },
        editPost(){
            console.log("Edit Post")
        },
        addReply(){
            this.replyPost = "En cours de dev ..."
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-post{
        border: 2px solid black;
        width: 450px;
        padding: 2rem;
        margin: 2rem auto;
        border-radius: 25px;
    }
</style>