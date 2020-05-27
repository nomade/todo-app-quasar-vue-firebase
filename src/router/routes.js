
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '/', 
        component: () => import('pages/Login.vue'),
        meta: {
          auth: false
        }
      },
      { 
        path: '/todo', 
        component: () => import('pages/Todo.vue') ,
        meta: {
          auth: true
        }
      },
      { 
        path: '/help', 
        component: () => import('pages/Help.vue'),
        meta: {
          auth: true
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
