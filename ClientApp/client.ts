/// <reference types="webpack-env" />
// NProgress
import * as NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './assets/scss/main.scss'

import { createApp } from './app'

const { app, store, router } = createApp({})

// @ts-ignore
if (window.__INITIAL_STATE__) store.replaceState(window.__INITIAL_STATE__)

router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using `router.beforeResolve()` so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // we only care about non-previously-rendered components,
    // so we compare them until the two matched lists differ
    let diffed = false
    const activated = matched.filter((Component, index) => diffed || (diffed = (prevMatched[index] !== Component)))

    if (!activated.length) return next()

    // this is where we should trigger a loading indicator if there is one
    NProgress.start()

    Promise.all(activated.map(Component => {
      // @ts-ignore
      if (Component.asyncData) return Component.asyncData({ store, route: to })
    })).then(() => {
      // stop loading indicator
      NProgress.done()

      next()
    }).catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

if (module.hot) module.hot.accept()
