declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module "vue/types/vue" {
  import { MetaInfo } from 'vue-meta'
  interface Vue {
    metaInfo?: MetaInfo | (() => MetaInfo)
  }
}
