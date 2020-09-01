<template>
  <div class="user container">
        <div class="user__header">
            <img v-if="user.photo_url" :src="'http://localhost:3000/images/' + user.photo_url">
            <h1 class="m-4">{{ user.first_name}} {{ user.last_name }}</h1>
        </div>
    <hr />
    <ul class="list-group list-group-flush col-12 col-md-7 mx-auto">
        <li class="list-group-item list-group-item-action" v-if="user.city">Ville : {{ user.city }}</li>
        <li class="list-group-item list-group-item-action" v-if="user.born_date">Date de Naisseance : {{ user.born_date | formatDateShort }}</li>
        <li class="list-group-item list-group-item-action" v-if="user.about_you">A propos de {{ user.first_name }} : {{ user.about_you }}</li>
        <hr v-if="user.city || user.born_date || user.about_you"/>
        <li class="list-group-item list-group-item-action">Nombre d'article posté : {{ user.nb_article }}</li>
        <li class="list-group-item list-group-item-action">Nombre de commentaires posté : {{ user.nb_reply }}</li>
        <hr />
        <li class="list-group-item list-group-item-action">Compte créé le : {{ user.account_created | formatDate }}</li>
        <li class="list-group-item list-group-item-action">Dernière connexion : {{ user.last_conn | formatDateFromNow }}</li>
    </ul>
  </div>
</template>

<script>
export default {
    name: "User",
    data() {
        return{
            user: {}
        }
    },
    mounted: function(){
        const id = this.$route.params.id;
        const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        fetch("/api/auth/profile/" + id, { headers })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.user = data.user[0];
                if (!this.user.photo_url){
                    this.user.photo_url = "avatar-man.png"
                }
            })
            .catch(error => {
                this.errorMessage = error;
                console.error("There was an error!", error);
            });
    }
}
</script>

<style lang="scss">
    .user{
        &__header{
            text-align: center;
            h1{
                text-align: center;
            }
            img{
                width: 150px;
                border-radius: 50%;
            }
        }
        text-align: center;
        hr{
            width: 50%;
            border: 1px solid black;
        }
        margin-bottom: 2rem;
    }
</style>
