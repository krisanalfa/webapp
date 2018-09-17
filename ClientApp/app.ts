import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from '@/layouts/default/template.vue'
import createStore from './store'
import createRouter from './router'

export const createApp = (_: any) => {
  // create router and store instances
  const router = createRouter()
  const store = createStore()

  // sync so that route state is available as part of the store
  sync(store, router)

  const app = new Vue({
    // inject store into root Vue instance
    store,
    // inject router into root Vue instance
    router,
    render: (h) => h(App)
  })

  // return the app, the router, and the store
  return { app, router, store }
}
