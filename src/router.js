import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import webAuth from './views/WebAuth.vue'
import Profile from './views/Profile.vue'
import Search from './views/Search.vue'
import Match from './views/Match.vue'
import Favorites from './views/Favorites.vue'
import NotFound from './views/NotFound.vue'
import axios from 'axios'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/webAuth',
            name: 'webAuth',
            component: webAuth,
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: Favorites,
            beforeEnter: requireAuth
        },
        {
            path: '/Search',
            name: 'Search',
            component: Search,
            props: (route) => ({
                q: route.query.q
            })
        },
        {
            path: '/Match',
            name: 'Match',
            component: Match,
            props: (route) => ({
                id: route.query.id
            })
        },
        {
            path: '/myprofile',
            name: 'Profile',
            component: Profile,
            props: (route) => ({
                from: route.query.from
            }),
            beforeEnter: requireAuth
        },
        {
            path: '/Profile',
            name: 'Profile',
            component: Profile,
            props: (route) => ({
                from: route.query.from
            }),
            // beforeEnter: requireAuth
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
            path:'*',
            name: 'Not Found',
            component: NotFound
        }
    ]
})

// import { EventBus } from "./event-bus";
import { connection } from "./variables";
//Refresh load bar
// function logOff () {
//     EventBus.$emit('logged', 'User logged');
// }

function requireAuth(to, from, next) {
    var data = JSON.parse(localStorage.getItem('user'));
    var dataStringified = JSON.stringify(data);
    //i dont know why it wont work in other ways.
    if (dataStringified != 'null') {

        axios.post(connection + 'auth/token', {
            id: data.id,
            token: data.token
        })
            .then(response => {
                next();
            })
            .catch(error => {
                localStorage.removeItem('user');
                next({
                    path: '/webAuth',
                    query: {redirect: to.fullPath}
                })
            })
    }
    else {
        localStorage.removeItem('user');
        next({
            path: '/webAuth',
            query: {redirect: to.fullPath}
        })
    }
}