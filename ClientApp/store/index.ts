import Vue from 'vue'
import Vuex, { Store, MutationTree, ActionTree } from 'vuex'
import { Route } from 'vue-router'

Vue.use(Vuex)

// STATE INTERFACE
export interface IState {
  route: Route | null
}

// INITIAL STATE
const state: IState = {
  route: null
}

// MUTATIONS
const mutations: MutationTree<IState> = {
  //
}

// ACTIONS
const actions: ActionTree<IState, IState> = ({
  //
})

export default () => new Store({
  state,
  mutations,
  actions
})
