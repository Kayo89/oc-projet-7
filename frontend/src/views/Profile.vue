<template>
    <div class="profile container">
        <div class="profile__header">
            <img v-if="user.photo_url" :src="'/images/' + user.photo_url">
            <h1 class="m-4">{{user.first_name}}</h1>
        </div>
        <ul class="list-group list-profile">
            <li class="list-group-item list-group-item-warning font-weight-bold text-center" v-if="perm === true"><router-link to="/admin">Admin Section</router-link></li>
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
        <ErrorMess 
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
        <section class="editSection mb-4">
            <router-link to="/edit-profile"><button class="btn btn-warning btn-sm">Modifier le Profile</button></router-link> 
            <br />
            <br />
            <button class="btn btn-warning btn-sm" @click="psswdModalShow = !psswdModalShow">Changer mot de passe</button> <button class="btn btn-danger btn-sm" @click="confirmModalShow = !confirmModalShow">Supprimer le compte</button>
        </section>

        <b-modal ref="deleteAccount-modal" size="lg" v-model="confirmModalShow" hide-footer centered title="Voulez vous vraiment supprimer votre compte ?" hide-backdrop content-class="shadow">
            <div class="form-group col-12">
                <label for="confirm-input">Pour confirmer la suppression du compte, merci d'écrire "SUPPRIMER"</label>
                <input class="form-control" id="confirm-input" type="text" v-model="confirm.text">
            </div>
            <p class="text-center text-danger mt-1">{{confirm.error}}</p>
            <b-button class="mt-3 col-6 offset-3" variant="danger" block @click="delAccount()">Supprimer</b-button>
            <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hideConfirmModal">Annuler</b-button>
        </b-modal>

        <b-modal ref="changePassword-modal" size="md" v-model="psswdModalShow" hide-footer centered title="Changer votre mot de passe" hide-backdrop content-class="shadow">
            <form @submit.prevent="updatePassword" v-if="!changePassword.successMessage">
            <div class="form-group col-12">
                <label for="changePassword--old">Ancien mot de passe :</label>
                <input class="form-control" id="changePassword--old" type="password" v-model="changePassword.old" required>
            </div>
            <div class="form-group col-12">
                <label for="changePassword--new">Nouveau mot de passe :</label>
                <input class="form-control" id="changePassword--new" type="password" v-model="changePassword.new" required>
            </div>
            <div v-if="rulesMessage.password">
                <p>Le mot de passe ne remplit pas les conditions suivante :</p>
                <ul class="text-danger">
                    <li v-for="rules in rulesMessage.password" :key="rules" >
                        {{ rules }}
                    </li>
                </ul>
            </div>
            <div class="form-group col-12">
                <label for="changePassword--newConfirm">Confirmer le nouveau mot de passe :</label>
                <input class="form-control" id="changePassword--newConfirm" type="password" v-model="changePassword.newConfirm" required>
            </div>
            <p class="text-center text-danger mt-1">{{changePassword.errorMessage}}</p>
            <b-button class="mt-3 col-6 offset-3" variant="success" block type="submit">Confirmer</b-button>
            <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hidePsswdModalShow">Annuler</b-button>
            </form>
            <p class="text-success text-center font-weight-bold" v-else>{{ changePassword.successMessage }}</p>
        </b-modal>
    </div>
</template>

<script>

import ErrorMess from '../components/errorMessage'
import axios from 'axios'

export default {
    name: 'Profile',
    data(){
        return {
            user: {},
            inDev: "",
            showErrorRes: false,
            errorMessage: null,
            perm: false,
            confirm: {
                text: null,
                error: null
            },
            confirmModalShow: false,
            psswdModalShow: false,
            changePassword: {
                old: null,
                new: null,
                newConfirm: null,
                errorMessage: null,
                successMessage: null
            },
            rulesMessage: {
                password: null
            },
        }
    },
    components: {
        ErrorMess
    },
    mounted: function(){
        const userId = { userId: sessionStorage.getItem('userId')};
        const requestOptions = {
            method: "POST",
            headers: this.$store.state.requestHeaders,
            body: JSON.stringify(userId)
        }
        fetch("/api/auth/profile", requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.user = data.user;
                this.perm = data.permission;
                })
            .catch(error => {
                this.showErrorRes = true
                this.errorMessage = "Une erreur de connection à l'API est survenue.";
                console.error("There was an error!", error);
            });
    },
    methods: {
        async delAccount(){
            if (this.confirm.text !== "SUPPRIMER"){
                return this.confirm.error = "Confirmation non validé !"
            }
            try{
                let data = { deleteAccountId: sessionStorage.getItem('userId') }
                let result = await axios.delete('/api/auth/del-account', { data, headers: this.$store.state.requestHeaders})
                this.resultRequest = result.data
                this.hideConfirmModal()
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
                this.$store.commit("setRequestHeaders", { token: null, userId: null })
                this.$router.push('/login')
            }catch(err){
                console.log(err)
            }
        },
        async updatePassword(){
            if (this.validPassword(this.changePassword.new).length){
                this.rulesMessage.password = this.validPassword(this.changePassword.new)
            }else{
                this.rulesMessage.password = null
            }
            if (this.rulesMessage.password){
                return true
            }
            if (this.changePassword.new != this.changePassword.newConfirm){
                this.changePassword.errorMessage = "Les nouveaux mot de passe ajouté ne sont pas les mêmes !"
                return true
            }else{
                this.changePassword.errorMessage = null;
            }
            try{
                let data = { email: this.user.email, passwords: this.changePassword }
                let result = await axios.put('/api/auth/password', data, { headers: this.$store.state.requestHeaders })
                if (result.data.error){
                    return this.changePassword.errorMessage = result.data.error
                }
                if (result.data.success){
                    this.changePassword.successMessage = result.data.success
                    setTimeout(() => {
                        this.changePassword.old = null
                        this.changePassword.new = null
                        this.changePassword.newConfirm = null
                        this.changePassword.successMessage = null
                        this.hidePsswdModalShow()
                    },2000)
                }
            }catch(err){
                console.log(err)
            }
        },
        hideConfirmModal() {
            this.$refs['deleteAccount-modal'].hide()
        },
        hidePsswdModalShow() {
            this.$refs['changePassword-modal'].hide()
        },
        validPassword(psswd) {
            let passwordError = []
            let numbers = /[0-9]/g
            let uppperCaseLetters = /[A-Z]/g
            let lowerCaseLetters = /[a-z]/g
            let specialLetters = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
            if (!numbers.test(psswd)){
                passwordError.push('Avoir au minimum un chiffre.')
            }
            if (psswd.length < 7){
                passwordError.push('Avoir au minimum 8 caractères.')
            }
            if (!uppperCaseLetters.test(psswd)){
                passwordError.push('Avoir au minimum une lettre en majuscule.')
            }
            if (!lowerCaseLetters.test(psswd)){
                passwordError.push('Avoir au minimum une lettre en minuscule.')
            }
            if (!specialLetters.test(psswd)){
                passwordError.push('Avoir au minimum un caractère spécial')
            }
            return passwordError
        },
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
    }
</style>