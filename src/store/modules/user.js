import axios from 'axios'

const state = {
  user: {},
  solved: [],
  unsolved: []
}

const getters = {
  user: (state) => {
    return state.user
  },
  solved: (state) => {
    return state.solved
  },
  unsolved: (state) => {
    return state.unsolved
  }
}

const mutations = {
  updateUser (state, payload) {
    state.user = payload.user
  },
  updateSolved (state, payload) {
    state.solved = payload.solved
  },
  updateUnsolved (state, payload) {
    state.unsolved = payload.unsolved
  }
}

const actions = {
  fetchUser ({commit}, payload) {
    return axios.get(`/users/${payload.uid}`)
      .then(({data}) => {
        commit('updateUser', data)
        commit('updateSolved', data)
        commit('updateUnsolved', data)
      })
  },
  register ({commit}, payload) {
    return axios.post('/users', payload)
      .then(({data}) => {
        commit('updateSelf', { // session module
          self: data.user
        })
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
