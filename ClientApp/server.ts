import { createApp } from './app'

export default (params: any) => {
  const context = {
    url: params.url,
    absoluteUrl: params.absoluteUrl,
    baseUrl: params.baseUrl,
    data: params.data,
    domainTasks: params.domainTasks,
    location: params.location,
    origin: params.origin
  }

  // since there could potentially be asynchronous route hooks or components,
  // we will be returning a Promise so that the server can wait until
  // everything is ready before rendering.
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context)

    // @ts-ignore
    const meta = app.$meta()
    params.meta = meta

    // set server-side router's location
    router.push(context.url)

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        // @ts-ignore
        return reject(new Error({ code: 404 }))
      }

      // call `asyncData()` on all matched route components
      Promise.all(matchedComponents.map(Component => {
        Object.assign(router.currentRoute.meta, { context })

        // @ts-ignore
        if (Component.asyncData) {
          // @ts-ignore
          return Component.asyncData({
            store,
            route: router.currentRoute,
            context
          })
        }
      })).then(() => {
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // When we attach the state to the context, and the `template` option
        // is used for the renderer, the state will automatically be
        // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
        params.state = store.state
        params.routeMeta = router.currentRoute.meta

        // the Promise should resolve to the app instance so it can be rendered
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
