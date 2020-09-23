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
    },
    requestHeaders:{
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 
      'userId': sessionStorage.getItem('userId')
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
    },
    setRequestHeaders(state, payload){
      state.requestHeaders.Authorization = 'Bearer '  + payload.token
      state.requestHeaders.userId = payload.userId
    }
  },
  actions: {
  },
  modules: {
  }
})
