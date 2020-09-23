<template>
    <div class="admin-page" v-if="perm">
        <h1>Section Administrateur</h1>
        <hr />
        <table class="table table-hover table-dark table-responsive mx-auto col-10">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Profile</th>
                    <th>Email</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Nombre d'articles</th>
                    <th>Nombre de commentaires</th>
                    <th>Date Création du compte</th>
                    <th>Dernière connection</th>
                    <th>Bannir Compte</th>
                    <th>Supprimer Compte</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in usersList" :key="user.id">
                    <td>{{user.id}}</td>
                    <td><router-link :to="'/user/'+user.id"><button class="btn btn-secondary btn-sm">Profile</button></router-link></td>
                    <td>{{user.email}}</td>
                    <td>{{user.first_name}}</td>
                    <td>{{user.last_name}}</td>
                    <td>{{user.articleCount}}</td>
                    <td>{{user.replyCount}}</td>
                    <td>{{ user.account_created | formatDateShort }}</td>
                    <td>{{ user.last_conn | formatDateFromNow }}</td>
                    <td>
                        <button v-if="user.permission == 0" @click="banAccount(user.id, -1)" class="btn btn-warning btn-sm">Bannir</button>
                        <button v-else-if="user.permission == -1" @click="banAccount(user.id, 0)" class="btn btn-success btn-sm">Débannir</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" v-if="user.permission !== 1" @click="modalShow = !modalShow, selectId = user.id">Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />

        <b-modal ref="deleteAccount-modal" size="lg" v-model="modalShow" hide-footer centered title="Voulez vous vraiment supprimer cette Utilisateur ?" hide-backdrop content-class="shadow">
            <div class="form-group col-12">
                <label for="confirm-input">Pour confirmer la suppression du compte, merci d'écrire "SUPPRIMER"</label>
                <input class="form-control" id="confirm-input" type="text" v-model="confirm.text">
            </div>
            <p class="text-center text-danger mt-1">{{confirm.error}}</p>
            <b-button class="mt-3 col-6 offset-3" variant="danger" block @click="deleteAccount(selectId)">Supprimer</b-button>
            <b-button class="mt-2 col-6 offset-3" variant="secondary" block @click="hideModal">Annuler</b-button>
        </b-modal>

    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'Admin',
    data() {
        return {
            usersList: [],
            perm: null,
            updateData: false,
            modalShow: false,
            selectId: null,
            resultRequest: null,
            confirm: {
                text: null,
                error: null
            }
        }
    },
    mounted: function() {
        this.getUsersList()
    },
    updated: function() {
        if (this.updateData){
            this.getUsersList()
            this.updateData = false
        }
    },
    methods: {
        async getUsersList(){
            try{
                let result = await axios.get('/api/admin/users', { headers: this.$store.state.requestHeaders })
                this.usersList = result.data.users
                this.perm = result.data.permission
            }catch(err){
                console.log(err)
            }
        },
        async deleteAccount(accountId){
            if (this.confirm.text !== "SUPPRIMER"){
                return this.confirm.error = "Confirmation non validé !"
            }
            try{
                let data = {userId: parseInt(sessionStorage.getItem('userId')), deleteAccountId: accountId}
                let result = await axios.delete('/api/admin/user', { data, headers: this.$store.state.requestHeaders})
                this.resultRequest = result.data
                this.hideModal()
                this.updateData = true
            }catch(err){
                console.log(err)
            }
        },
        async banAccount(accountId, permStatus){
            try{
                let data = { banAccountId: accountId, permStatus: permStatus }
                let result = await axios.put('/api/admin/user', data, { headers: this.$store.state.requestHeaders})
                this.resultRequest = result.data
                this.getUsersList()
            }catch(err){
                console.log(err)
            }
        },
        hideModal() {
            this.$refs['deleteAccount-modal'].hide()
        },
    }
}
</script>

<style lang="scss">
.admin-page{
    h1{
        text-align: center;
    }
}
</style>