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
        },
        {
            path: '/user',
            name: 'User',
            component: layout,
            children: [{
                path: '/',
                component: () =>
                    import ("../views/sys/user/index")
            }]
        },
        {
            path: '/experience',
            name: 'Experience',
            component: layout,
            children: [{
                path: '/',
                component: () =>
                    import ("../views/sys/experience/index")
            }]
        },
        {
            path: '/exdetail',
            name: 'ExperienceDetail',
            component: layout,
            children: [{
                path: '/',
                component: () =>
                    import ("../views/sys/experience/detail/index")
            }]
        },
        {
            path: '/knowledge',
            name: 'Knowledge',
            component: layout,
            children: [{
                path: '/',
                component: () =>
                    import ("../views/sys/knowledge/index")
            }]
        }
    ]
})