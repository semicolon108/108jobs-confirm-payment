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
  // Check for companyId in query params and set to localStorage
  if (to.query.companyId) {
    const urlParams = new URLSearchParams(to.query as any)
    const companyIdSet = setCompanyIdFromQuery(urlParams)

    // If companyId was set, redirect to same route but without query parameter
    if (companyIdSet) {
      const queryWithoutCompanyId = { ...to.query }
      delete queryWithoutCompanyId.companyId

      // Redirect to clean URL without companyId in query
      next({
        path: to.path,
        query: queryWithoutCompanyId,
        hash: to.hash
      })
      return
    }
  }

  // Route protection logic
  if (to.name === 'home') {
    // Check if companyId exists in localStorage
    if (!hasCompanyId()) {
      // Redirect to Hello view if no companyId found
      next({ name: 'welcome' })
      return
    }
  }

  next()
})

export default router
