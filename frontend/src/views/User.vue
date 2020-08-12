<template>
  <div class="User">
    <h1>{{ user.first_name}} {{ user.last_name }}</h1>
    <br>
    <h5>[IN DEV 🛠]</h5>
    <p class="mt-5 small">Compte créé le : {{ user.account_created | formatDate }}</p>
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
    }
</style>
