<template>
    <div class="profile container">
        <div class="profile__header">
            <img v-if="user.photo_url" :src="'http://localhost:3000/images/' + user.photo_url">
            <h1 class="m-4">{{user.first_name}}</h1>
        </div>
        <ul class="list-group list-profile">
            <li class="list-group-item list-group-item-action">Email : {{user.email}}</li>
            <li class="list-group-item list-group-item-action">Prénom : {{user.first_name}}</li>
            <li class="list-group-item list-group-item-action">Nom : {{user.last_name}}</li>
            <li class="list-group-item list-group-item-action">Ville : {{user.city}}</li>
            <li class="list-group-item list-group-item-action">Date de naissance : {{user.born_date | formatDateShort}}</li>
            <li class="list-group-item list-group-item-action">A propos de vous : {{user.about_you}}</li>
            <hr>
            <li class="list-group-item list-group-item-action">Nombre d'Article posté : {{user.nb_article}}</li>
            <li class="list-group-item list-group-item-action">Nombre de commentaire posté : {{user.nb_reply}}</li>
            <li class="list-group-item list-group-item-action">Compte crée le : {{user.account_created | formatDate}}</li>
        </ul>
        <section class="editSection">
            <router-link to="/edit-profile"><button class="btn btn-warning btn-sm">Modifier le Profile</button></router-link> 
            <br />
            <br />
            <button class="btn btn-warning btn-sm">Changer mot de passe</button> <button class="btn btn-danger btn-sm" @click="deleteAccount">Supprimer le compte</button>
        </section>
        <p class="inDev mt-5">{{ inDev }}</p>
        <ErrorMess 
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
    </div>
</template>

<script>

import ErrorMess from '../components/errorMessage'

export default {
    name: 'Profile',
    data(){
        return {
            user: {},
            inDev: "",
            showErrorRes: false,
            errorMessage: null
        }
    },
    components: {
        ErrorMess
    },
    mounted: function(){
        const userId = { userId: sessionStorage.getItem('userId')};
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userId)
        }
        fetch("/api/auth/profile", requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.user = data.user[0];
                if (!this.user){
                    this.user.photo_url = "avatar-man.png"
                }
                })
            .catch(error => {
                this.showErrorRes = true
                this.errorMessage = "Une erreur de connection à l'API est survenue.";
                console.error("There was an error!", error);
            });
    },
    methods: {
        editProfile(){
            this.inDev = "Fonction en developpement !"
        },
        deleteAccount(){
            this.inDev = "Fonction en developpement !"
        }
    }

}
</script>

<style lang="scss" scoped>
    .profile{
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
        .editSection{
            text-align: center;
        }
        .list-profile{
            max-width: 600px;
            text-align: left;
            margin: 2rem auto;
        }
        .inDev{
            text-align: center;
        }
    }
</style>