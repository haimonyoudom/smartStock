import { createRouter, createWebHistory } from 'vue-router'
// import ProductsPage from '@/views/ProductsPage.vue'
import NewSalePage from '@/views/NewSalePage.vue'
// import PlaceholderPage from '@/views/PlaceholderPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/products' },
    // { path: '/products', component: ProductsPage },
    { path: '/new-sale', component: NewSalePage },
    // { path: '/alerts', component: PlaceholderPage, meta: { title: 'Low-stock alerts' } },
    // { path: '/sales', component: PlaceholderPage, meta: { title: 'Sales' } },
  ],
})
