import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import axios from 'axios'

function AdminAuth(to, from, next) {

  if(localStorage.getItem('token') != undefined) {

    let req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    }

    console.log(req)

    axios.post("http://localhost:8080/validate", {}, req).then(res => {
    console.log(res);
    next();
    }).catch(err => {
      console.log(err.response);
      console.log(err);
      next("/login")
    })
  }else {
    next("/login")
  }
   
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin/users',
      name: 'users',
      component: Users,
      beforeEnter: AdminAuth
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: "Login",
      component: Login
    }
  ]
})

export default router
