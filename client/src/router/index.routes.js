import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth.guard'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "auth" */ '../views/LoginView.vue'),
        },
        {
            path: '/signup-success',
            name: 'SignupSuccess',
            component: () => import(/* webpackChunkName: "auth" */ '../views/SignupSuccess.vue'),
        },
        {
            path: '/signup',
            name: 'Signup',
            component: () => import(/* webpackChunkName: "auth" */ '../views/SignupView.vue'),
        },
        {
            path: '/profile/:id/:type',
            name: 'Profile',
            component: () => import(/* webpackChunkName: "auth" */ '../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/payment-deposit',
            name: 'PaymentDeposit',
            component: () => import(/* webpackChunkName: "auth" */ '../views/PaymentDeposit.vue'),
        },
        {
            name: '404',
            path: '/:pathMatch(.*)*',
            component: () => import(/* webpackChunkName: "auth" */ '../views/404View.vue'),
        },
        {
            path: '/',
            name: '',
            component: () => import(/* webpackChunkName: "auth" */ '../views/MainView.vue'),
        },
        {
            path: '/payment-info/:id/:type',
            name: 'PaymentInfo',
            component: () => import(/* webpackChunkName: "auth" */ '../views/PaymentInfo.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import(/* webpackChunkName: "auth" */ '../views/AdminView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/roulette',
            name: "Roulette",
            component: () => import(/* webpackChunkName: "auth" */ '../views/RouletteView.vue'),
        },
        {
            path: '/flip-coin',
            name: "Flip Coin",
            component: () => import(/* webpackChunkName: "auth" */ '../views/CoinView.vue'),
        }


    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        authGuard(to, from, next)
    } else {
        next()
    }
})

export default router
