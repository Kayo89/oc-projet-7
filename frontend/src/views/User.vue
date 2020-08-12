<template>
  <div class="User container">
    <h1>{{ user.first_name}} {{ user.last_name }}</h1>
    <hr />
    <ul class="list-group list-group-flush col-12 col-md-7 mx-auto">
        <li class="list-group-item list-group-item-action">Nombre d'article posté : {{ user.nb_article }}</li>
        <li class="list-group-item list-group-item-action">Nombre de commentaires posté : {{ user.nb_reply }}</li>
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
        fetch("http://192.168.1.16:3000/api/auth/profile/" + id, { headers })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.user = data.user[0];
            })
            .catch(error => {
                this.errorMessage = error;
                console.error("There was an error!", error);
            });
    }
}
</script>

<style lang="scss">
    .User{
        text-align: center;
        hr{
            width: 50%;
            border: 1px solid black;
        }
    }
</style>
