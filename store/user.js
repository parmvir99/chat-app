export const state = () => ({
  userName: null
})

export const getters = {
  getUser (state) {
    return state.user
  }
}

export const mutations = {
  setUser (state, user) {
    state.userName = user
  }
}

export const actions = {
  setUser ({ commit }, user) {
    commit('setUser', user)
  }
}
