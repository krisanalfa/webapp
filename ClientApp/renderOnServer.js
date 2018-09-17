// @ts-check
process.env.VUE_ENV = 'server'

const path = require('path')
const prerendering = require('aspnet-prerendering')
const { createBundleRenderer } = require('vue-server-renderer')
const minify = require('html-minifier').minify

module.exports = prerendering.createServerRenderer(params => {
  return new Promise((resolve, reject) => {
    const context = {
      url: params.url,
      absoluteUrl: params.absoluteUrl,
      baseUrl: params.baseUrl,
      data: params.data,
      domainTasks: params.domainTasks,
      location: params.location,
      origin: params.origin,
      routeMeta: {}
    }

    createBundleRenderer(path.join(__dirname, '../wwwroot/dist/vue-ssr-server-bundle.json'), {
      // recommended for performance
      runInNewContext: false,
      // With the client manifest and the server bundle,
      // the renderer now has information of both the server and client builds,
      // so it can automatically infer and inject preload / prefetch directives and css links / script tags into the rendered HTML.
      clientManifest: require(path.join(__dirname, '../wwwroot/dist/vue-ssr-client-manifest.json'))
    }).renderToString(context, (err, html) => {
      if (err) {
        return reject(err)
      }

      const bodyOpt = { body: true }
      const {
        title,
        htmlAttrs,
        bodyAttrs,
        link,
        style,
        script,
        noscript,
        meta
      } = context.meta.inject()

      const { statusCode } = context.routeMeta

      resolve({
        statusCode: statusCode || 200,
        html: minify(`
          <!DOCTYPE html>
          <html data-vue-meta-server-rendered ${htmlAttrs.text()}>
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              ${meta.text()}
              ${title.text()}

              ${context.renderResourceHints()}

              ${link.text()}
              ${style.text()}
              ${script.text()}
              ${noscript.text()}

              ${context.renderStyles()}
            </head>
            <body ${bodyAttrs.text()}>
              ${html}

              ${context.renderState()}
              ${context.renderScripts()}
              ${script.text(bodyOpt)}
            </body>
          </html>
        `, {
          collapseWhitespace: process.env.ASPNETCORE_ENVIRONMENT = 'Production'
        })
      })
    })
  })
})
