import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    msg: {
      type: String,
      default: 'Hello World'
    }
  }
})
export default class HelloWorld extends Vue {

}
