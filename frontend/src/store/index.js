import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{
      id: null
    },
    article: {
      id: null
    },
    modify: {
      content: null
    },
    reply: {
      id: null
    }
  },
  mutations: {
    setUserId(state, payload){
      state.user.id = payload.userId
    },
    setArticleId(state, payload){
      state.article.id = payload.articleId
    },
    whatToModify(state, payload){
      state.modify.content = payload.content
    },
    setReplyId(state, payload){
      state.reply.id = payload.replyId
    }
  },
  actions: {
  },
  modules: {
  }
})
