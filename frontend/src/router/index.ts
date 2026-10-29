import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/products' },
    { path: '/products', name: 'products',
      component: () => import('@/pages/ProductsPage.vue') },
    { path: '/products/:id', name: 'product-detail', props: true,
      component: () => import('@/pages/ProductDetailPage.vue') },
    { path: '/alerts', name: 'alerts', meta: { ownerOnly: true },
      component: () => import('@/pages/AlertsPage.vue') },
    { path: '/sales', name: 'sale',
      component: () => import('@/pages/PlaceholderPage.vue') },
    { path: '/new-sale', name: 'new-sales', meta: { ownerOnly: true },
      component: () => import('@/pages/NewSalePage.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue') },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.ownerOnly && auth.currentUser.role !== 'OWNER') {
    return { name: 'products', query: { denied: '1' } }
  }
})

export default router