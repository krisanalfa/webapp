const Index = () => import('@/views/Home/template.vue')
const About = () => import('@/views/About/template.vue')
const Error404 = () => import('@/views/Errors/404/template.vue')
import { RouteConfig } from 'vue-router'

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: Index
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: '404',
    path: '*',
    component: Error404,
    meta: {
      statusCode: 404
    }
  }
]
