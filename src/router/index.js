import Vue from 'vue'
import Router from 'vue-router'
import store from './../store.js'
import { baseURL } from './../helpers/url';

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Login = () => import('@/views/auth/Login')

const Dashboard = () => import('@/views/Dashboard')

const Categories = () => import('@/views/categories/Index')
const CreateCategory = () => import('@/views/categories/Create')
const EditCategory = () => import('@/views/categories/Edit')

const Products = () => import('@/views/products/Index')
const CreateProduct = () => import('@/views/products/Create')
const EditProduct = () => import('@/views/products/Edit')
const DetailProduct = () => import('@/views/products/Detail')

const Orders = () => import('@/views/orders/Index')
const DetailOrder = () => import('@/views/orders/Detail')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
});

router.beforeEach(async (to, from, next) => {

  let isAuthenticated = store.state.authenticated;

  let fadielLocalStorage = window.localStorage.getItem('fadiel');

  if (!fadielLocalStorage) {
    window.localStorage.setItem('fadiel', JSON.stringify({
      authenticated: false,
      user: null,
      token: null,
      baseURL: baseURL
    }));

    fadielLocalStorage = window.localStorage.getItem('fadiel');
  }

  if (!store.state.copiedFromLocalStorage) {

    const fadielData = JSON.parse(fadielLocalStorage);

    if (fadielData) {
      isAuthenticated = fadielData.authenticated;
      store.commit("set", ["copiedFromLocalStorage", true])
      store.commit("set", ["authenticated", fadielData.authenticated])
      store.commit("set", ["user", fadielData.user])
      store.commit("set", ["token", fadielData.token])
      store.commit("set", ["baseURL", fadielData.baseURL])
    }
  }

  if (to.meta.requiresLogin && !isAuthenticated) next({ name: 'Login' })
  else if (to.name == 'Login' && isAuthenticated) next({ name: 'Dashboard' })
  else next()
})

export default router;

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresLogin: true }
        },
        {
          path: 'categories',
          redirect: '/categories',
          name: 'Categories',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'All category',
              component: Categories,
              meta: { requiresLogin: true }
            },
            {
              path: 'create',
              name: 'Create category',
              component: CreateCategory,
              meta: { requiresLogin: true }
            },
            {
              path: ':id/edit',
              name: 'Edit category',
              component: EditCategory,
              meta: { requiresLogin: true }
            }
          ]
        },
        {
          path: 'products',
          redirect: '/products',
          name: 'Products',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'All product',
              component: Products,
              meta: { requiresLogin: true }
            },
            {
              path: 'create',
              name: 'Create product',
              component: CreateProduct,
              meta: { requiresLogin: true }
            },
            {
              path: ':id',
              name: 'View product',
              component: DetailProduct,
              meta: { requiresLogin: true }
            },
            {
              path: ':id/edit',
              name: 'Edit product',
              component: EditProduct,
              meta: { requiresLogin: true }
            }
          ]
        },
        {
          path: 'orders',
          redirect: '/orders',
          name: 'Orders',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          meta: { requiresLogin: true },
          children: [
            {
              path: '',
              name: 'All order',
              component: Orders,
              meta: { requiresLogin: true }
            },
            {
              path: ':id',
              name: 'View order',
              component: DetailOrder,
              meta: { requiresLogin: true }
            },
          ]
        },
      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        }
      ]
    },
    {
      path: '/errors',
      redirect: '/errors/404',
      name: 'Errors',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
      ]
    }
  ]
}

