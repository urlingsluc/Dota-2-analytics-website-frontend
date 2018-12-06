import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import webAuth from './views/webAuth.vue'
import Profile from './views/Profile.vue'
import Search from './views/Search.vue'
import axios from 'axios'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/index',
            name: 'home',
            component: Home
        },
        {
            path: '/webAuth',
            name: 'webAuth',
            component: webAuth
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
        }
    ]
})

import { EventBus } from "./event-bus";
import { connection } from "./variables";
//Refresh load bar
function logOff () {
    EventBus.$emit('logged', 'User logged');
}

function requireAuth(to, from, next) {
    var data;
    console.log('REQUIRE AUTHENTICATION');
    data = JSON.parse(localStorage.getItem('user'));
    console.log('bbbbb');
    var dataStringified = JSON.stringify(data);
    console.log(dataStringified);
    //i dont know why it wont work in other ways.
    if (dataStringified != 'null') {
        console.log('not null!!');

        axios.post(connection + 'auth/token', {
            id: data.id,
            token: data.token
        })
            .then(response => {
                console.log(response);
                next()
            })
            .catch(error => {
                console.log(error);
                localStorage.removeItem('user');
                // this.logOff();
                next({
                    path: '/webAuth',
                    query: {redirect: to.fullPath}
                })
            })
    }
    else {
        localStorage.removeItem('user');
        // this.logOff();
        next({
            path: '/webAuth',
            query: {redirect: to.fullPath}
        })
    }
}