<template>
    <div class="sign-in container">
        <section v-if="!createdSuccess" class="col-md-8 col-lg-7 mx-auto">
            <h2 class="sign-in--signin">Création d'un compte Groupomania !</h2>
            <form @submit.prevent="signup" id="signup-form">
                <div class="form-row">
                    <div class="form-group col-12">
                        <label for="email"><font-awesome-icon icon="envelope" /> Email</label>
                        <input class="form-control" type="email" placeholder="email@groupomania.com" name="email" id="email" v-model="user.email" required>
                    </div>
                    <ul v-if="rulesMessage.email" class="text-danger font-weight-bold">
                        <li>
                            {{ rulesMessage.email }}
                        </li>
                    </ul>
                    <div class="form-group col-12">
                        <label for="password"><font-awesome-icon icon="lock" /> Mot de passe</label>
                        <input class="form-control" type="password" placeholder="Votre mot de passe" name="password" id="password" v-model="user.password" required>
                    </div>
                    <div v-if="rulesMessage.password" class="font-weight-bold">
                        <p>Le mot de passe ne remplit pas les conditions suivante :</p>
                        <ul class="text-danger">
                            <li v-for="rules in rulesMessage.password" :key="rules" >
                                {{ rules }}
                            </li>
                        </ul>
                    </div>
                    <div class="form-group col-6">
                        <label for="first-name">Prénom</label>
                        <input class="form-control" type="text" placeholder="Votre prénom" name="first-name" id="first-name" v-model="user.firstName" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="last-name">Nom</label>
                        <input class="form-control" type="text" placeholder="Votre nom" name="last-name" id="last-name" v-model="user.lastName" required>
                    </div>
                    <div class="form-group col-12">
                        <label class="mr-2">Sexe :</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender-select" id="sexeMan" value="man" checked v-model="user.gender" required>
                            <label class="form-check-label" for="sexeMan">
                                Homme
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="sexeWoman" name="gender-select" value="woman" v-model="user.gender">
                            <label class="form-check-label" for="sexeWoman">
                                Femme
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary sign-in--button">Créer mon compte</button>
            </form>
                <ErrorMess 
                    :showErrorRes="showError"
                    :errorMessage="errorMessage"
                />
                <p class="text-center small pt-3">Vous avez déjà un compte ? <router-link to='/login'>Connectez-vous</router-link></p>
        </section>
        <SucessMessage 
            :dismissCountDown="dismissCountDown"
            :dismissSecs="dismissSecs"
            :countDownChanged="countDownChanged"
            :messageResponse="messageResponse"
        />
    </div>
</template>

<script>

import ErrorMess from '../components/errorMessage'
import SucessMessage from "../components/sucessMessageRedirect"

export default {
    name: "Signup",
    data() {
        return {
            user: {},
            showError: false,
            errorMessage: null,
            dismissSecs: 3,
            dismissCountDown: 0,
            showSucessRes: false,
            messageResponse: null,
            rulesMessage: {
                email: null,
                password: null
            },
            createdSuccess: false
        }
    },
    components: {
        ErrorMess,
        SucessMessage
    },
    mounted: function(){

    },
    methods: {
        signup() {
            this.showError = false
            if (!this.validEmail(this.user.email)){
                this.rulesMessage.email = "Email incorrect"
            }else{ 
                this.rulesMessage.email = null
            }
            if (this.validPassword(this.user.password).length){
                this.rulesMessage.password = this.validPassword(this.user.password)
            }else{
                this.rulesMessage.password = null
            }
            if (this.rulesMessage.password || this.rulesMessage.email){
                return true
            }

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( this.user )
            }
            
            fetch("/api/auth/signup", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.showError = true
                        return this.errorMessage = data.error;
                    }
                    this.createdSuccess = true;
                    this.showAlert()
                    this.messageResponse = 'Compte créé !'
                    setTimeout(() => {
                        this.login();
                    },2900)
                })
                .catch(() => {
                    this.showError = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                    })
        },
        validEmail(email) {
            let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
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
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
            },
        showAlert() {
            this.showSucessRes = true;
            this.dismissCountDown = this.dismissSecs
        },
        login() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( this.user )
            }
            fetch("/api/auth/login", requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        this.showError = true
                        return this.errorMessage = data.error;
                    }
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('userId', data.userId);
                    this.$store.commit("setRequestHeaders", { token: data.token, userId: data.userId })
                    this.$router.push('/');
                    })
                .catch(() => {
                    this.showError = true
                    this.errorMessage = "Une erreur de connection à l'API est survenue."
                    })
        }
    }
    
}
</script>

<style lang="scss">
    .sign-in{
        h2, button{
            display: block;
            margin: 2rem auto;
            text-align: center;
        }
        .accountCreated{
            display: block;
            color: darkgreen;
            font-weight: bold;
            border-bottom: 1px solid;
            width: fit-content;
            margin: 5rem auto;
            font-size: 1.5rem;
        }
    }
</style>