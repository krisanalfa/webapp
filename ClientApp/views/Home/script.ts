import Vue from 'vue'
import Component from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld/template.vue' // @ is an alias to /ClientApp

@Component({
  components: {
    HelloWorld
  },
  metaInfo: {
    title: 'Home'
  }
})
export default class Home extends Vue {

}
