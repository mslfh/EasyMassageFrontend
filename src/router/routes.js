const routes = [
  //Customer routes
  {
    path: '/',
    component: () => import('layouts/CustomerLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/CustomerIndex.vue') },
      { path: '', component: () => import('pages/CustomerBooking.vue') },
      { path: 'appointment', component: () => import('pages/CustomerAppointment.vue') },
    ]
  },

  //Admin routes
  {
    path: '/admin/login',
    component: () => import('pages/AdminLogin.vue')
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        next('/admin/login'); // Redirect to login if no token
      } else {
        next();
      }
    },
    children: [
      { path: '', component: () => import('pages/AdminAppointment.vue') },
      { path: 'staff', component: () => import('pages/AdminStaff.vue') },
      { path: 'user', component: () => import('pages/AdminUser.vue') },
      { path: 'package', component: () => import('pages/AdminPackage.vue') },
      { path: 'service', component: () => import('pages/AdminService.vue') },
      { path: 'schedule', component: () => import('pages/AdminSchedule.vue') },
      { path: 'appointment', component: () => import('pages/AdminAppointment.vue') },
      { path: 'setting', component: () => import('pages/AdminSetting.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
