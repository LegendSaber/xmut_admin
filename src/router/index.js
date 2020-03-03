import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const layout = () =>
    import ("../views/layout/index")

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('../views/login/index')
        },
        {
            path: '/dashbord',
            name: 'Home',
            component: layout,
            children: [{
                path: "/",
                component: () =>
                    import ("../views/dashbord/index")
            }]
        }
    ]
})