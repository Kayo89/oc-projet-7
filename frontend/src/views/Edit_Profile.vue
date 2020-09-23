<template>
    <div class="edit-profile">
        <h1>Modifier Profile</h1>
        <section class="col-md-8 col-lg-7 mx-auto">
            <form @submit.prevent="saveProfile" enctype="multipart/form-data">
                <div class="form-row">
                    <div class="form-group col-12">
                        <label for="email">Email</label>
                        <input class="form-control" type="email" placeholder="Email" id="email" v-model="user.email" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="first-name">Prénom</label>
                        <input class="form-control" type="text" placeholder="Prénom" id="first-name" v-model="user.first_name" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="last-name">Nom</label>
                        <input class="form-control" type="text" placeholder="Nom" id="last-name" v-model="user.last_name" required>
                    </div>
                    <div class="form-group col-12">
                        <label for="photo">Ajouter une Photo</label>
                        <input class="form-control" type="file" ref="file" id="photo" @change="processFile">
                    </div>
                    <div class="form-group col-6">
                        <label for="born-date">Date de Naissance</label>
                        <input class="form-control" type="date" id="born-date" v-model="user.born_date">
                    </div>
                    <div class="form-group col-6">
                        <label for="city">Ville</label>
                        <input class="form-control" type="text" placeholder="Lieu de résidence" id="city" v-model="user.city">
                    </div>
                    <div class="form-group col-12">
                        <label for="about">A propos de vous</label>
                        <textarea class="form-control" id="about" rows="3" v-model="user.about_you"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary sign-in--button">Enregistrer</button>&nbsp;
                <router-link to="/profile"><button class="btn btn-secondary">Annuler</button></router-link>
            </form>
        <ErrorMess 
            :showErrorRes="showErrorRes"
            :errorMessage="errorMessage"
        />
        <SucessMessage 
            :dismissCountDown="dismissCountDown"
            :dismissSecs="dismissSecs"
            :countDownChanged="countDownChanged"
            :messageResponse="messageResponse"
        />
        </section>
    </div>
</template>

<script>

import axios from 'axios'
import ErrorMess from '../components/errorMessage'
import SucessMessage from "../components/sucessMessageRedirect"

export default {
    name: "EditProfile",
    components: {
        ErrorMess,
        SucessMessage
    },
    data(){
        return {
            user: {},
            file: null,
            showErrorRes: false,
            errorMessage: null,
            dismissSecs: 1,
            dismissCountDown: 0,
            showSucessRes: false,
            messageResponse: null
        }
    },

    updated: function(){
        if(this.showSucessRes == true){
            if (this.dismissCountDown == 0){
                this.$router.push('/profile/');
            }
        }
    },
    methods: { 
        editProfile(){
            this.showErrorRes = true
            this.errorMessage = "En cours de Development.";
        },
        processFile(event){
            this.file = event.target.files[0]
        },
        async saveProfile() {
            this.user.userId = parseInt(sessionStorage.getItem('userId'));
            const formData = new FormData();
            if (this.file){
                formData.append('file', this.file);
            }
            formData.append('user', JSON.stringify(this.user));
            
            try{
                await axios.put('/api/auth/profile', 
                   formData
                );
                this.showAlert();
                this.messageResponse = "Profile modifié"
            }catch(err){
                this.showErrorRes = true
                this.errorMessage = "Une erreur de connection à l'API est survenue."
            }
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
            },
        showAlert() {
            this.showSucessRes = true;
            this.dismissCountDown = this.dismissSecs
        },
        convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat)
            return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')
            }
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
                this.user.born_date = this.convertDate(this.user.born_date)
                })
            .catch(error => {
                this.showErrorRes = true
                this.errorMessage = "Une erreur de connection à l'API est survenue.";
                console.error("There was an error!", error);
            });
    }
}
</script>

<style lang="scss" scoped>
  h1{
    text-align: center;
    font-size: 1.8rem;
  }
</style>