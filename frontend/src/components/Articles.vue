<template>
    <div class="Articles">
        <div class="table-responsive">
            <table class="table table-hover table-dark mt-2">
                <thead>
                <tr>
                    <th scope="col">Titre des articles</th>
                    <th scope="col">Créé par</th>
                    <th scope="col">Réponses</th>
                    <th scope="col">Likes / Dislikes</th>
                    <th scope="col">Ajouté</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="article in articles" :key="article.id">
                    <td><router-link :to="'/article/'+article.id"> {{ article.title }} </router-link></td>
                    <td><router-link :to="'/user/'+article.user_id">{{ article.first_name }} {{ article.last_name }}</router-link></td>
                    <td>{{ article.replyCount }} <i class="fa fa-reply" aria-hidden="true"></i></td>
                    <td> {{ article.likes }} <i  class="fa fa-thumbs-up" aria-hidden="true"></i> / {{ article.dislikes }} <i class="fa fa-thumbs-down" aria-hidden="true"></i></td>
                    <td>{{ article.date_created | formatDateFromNow }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "Articles",
    props: ["articles"]
}
</script>

<style lang="scss" scoped>
    a{
            color: lightblue;
            font-weight: bold;
        }
</style>