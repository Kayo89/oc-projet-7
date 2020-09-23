<template>
    <section class="row p-2">
        <article v-for="article in articles" :key="article.id" class="article col-md-10 mx-auto">
            <router-link :to="'/article/'+article.id">
                    <header class="article__header">
                        <span v-if="article.user_id != 0">Posté par <router-link :to="'/user/'+article.user_id">{{ article.first_name }} {{ article.last_name }}</router-link> {{ article.date_created | formatDateFromNow }}</span>
                        <span v-else>Posté par <span class="user-delete">Utilisateur Supprimé</span> {{ article.date_created | formatDateFromNow }}</span>
                        <h3> {{ article.title }} </h3>
                    </header>
                    <section class="article__content">
                        <p v-html="article.content_txt"></p>
                    </section>
                    <footer class="article__footer">
                        <p><font-awesome-icon icon="comment-alt" /> {{ article.replyCount }} Commentaires</p>
                        <span class="article__footer--likes">
                            <span v-if="article.likes > 0">{{ article.likes }} <i  class="fa fa-thumbs-up" aria-hidden="true"></i></span>
                            <span v-if="article.dislikes > 0">{{ article.dislikes }} <i class="fa fa-thumbs-down" aria-hidden="true"></i></span>
                        </span>
                    </footer>
            </router-link>
        </article>
    </section>
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
    .article{
        border: 1px black solid;
        border-radius: 8px;
        background-color: white;
        padding: .4rem;
        margin: 2rem auto;
        color: black;
        a{
            text-decoration: none;
        }
        &__header{
            color: black;
            span{
                font-size: 0.8rem;
                a{
                    color: darkgreen;
                }
                border-bottom: 1px solid black;
                .user-delete{
                    font-style: italic;
                }
            }
            h3{
                font-size: 1.5rem;
                margin-top: 0.5rem;
                margin-left: 0.6rem;
            }
        }
        &__content{
            border-radius: 8px;
            background-color: whitesmoke;
            padding: 0.8rem;
            margin: 0.5rem 0; 
            color: black;
            font-size: 0.8rem;
            p{
                overflow: hidden;
                max-height: 200px;
            }
        }
        &__footer{
            display: flex;
            justify-content: space-between;
            color: black;
            margin: 0 0.6rem;
            font-size: 0.8rem;
            &--likes{
                span{
                    margin: 0 0.2rem;
                }
            }
        }
        &:hover{
            box-shadow: 5px 5px 5px grey;
        }
    }
</style>