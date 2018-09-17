import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import { routes } from './routes'

Vue.use(VueRouter)
Vue.use(VueMeta)

export default () => new VueRouter({
  mode: 'history',
  routes
})
