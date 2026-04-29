import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { setCompanyIdFromQuery, hasCompanyId } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/Welcome.vue'),
    }
  ]
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check for paymentCode in query params and set to localStorage
  if (to.query.paymentCode) {
    const urlParams = new URLSearchParams(to.query as any)
    const paymentCodeSet = setCompanyIdFromQuery(urlParams)

    // If paymentCode was set, redirect to same route but without query parameter
    if (paymentCodeSet) {
      const queryWithoutPaymentCode = { ...to.query }
      delete queryWithoutPaymentCode.paymentCode

      // Redirect to clean URL without paymentCode in query
      next({
        path: to.path,
        query: queryWithoutPaymentCode,
        hash: to.hash
      })
      return
    }
  }

  // Route protection logic
  if (to.name === 'home') {
    // Check if paymentCode exists in localStorage
    if (!hasCompanyId()) {
      // Redirect to Hello view if no paymentCode found
      next({ name: 'welcome' })
      return
    }
  }

  next()
})

export default router
