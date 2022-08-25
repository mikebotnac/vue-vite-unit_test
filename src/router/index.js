import { createWebHistory, createRouter } from "vue-router"

//LOGIN
//MAP
import MapVehicules from "../views/map/vehicules/MapVehicules.vue";
import MapRoutes from "../views/map/routes/MapRoutes.vue";
//ANALYTICS
import AnalyticsOverspeed from "../views/analytics/Overspeed.vue"
import AnalyticsBridge from "../views/analytics/Bridge.vue"
//VEHICULES
import VehiculesSettings from "../views/vehicles/Settings.vue"
import VehiculesImmobilize from "../views/vehicles/Immobilize.vue"

//STORE
import userStore from "../store/user"
import i18n from '../../i18n';

const routes = [
  //Public routes
  {
    path: "/login",
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import('../views/login/Login.vue'),
      }
    ]
  },
  {
    path: "/forgot-password",
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: "",
        name: "ForgotPassword",
        component: () => import('../views/forgotPassword/ForgotPassword.vue'),
      }
    ]
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import('../views/logout/Logout.vue'),
  },
  //App routes
  {
    path: "/",
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: '/',
        redirect: '/map/vehicles/'
      },
      {
        path: "/map/vehicles/:id?",
        name: 'MapVehicules',
        component: MapVehicules,
        meta: { requiresAuth: true, breadcrumb: ["Map", "Vehicle Locator"] }
      },

      {
        path: "/map/routes/:uuid?",
        name: 'MapRoutes',
        component: MapRoutes,
        meta: { requiresAuth: true, breadcrumb: ["Map", "Route Analysis"] }
      },

      {
        path: "/analytics/overspeed",
        name: 'AnalyticsOverspeed',
        component: AnalyticsOverspeed,
        meta: { requiresAuth: true, breadcrumb: ["Analytics", "Overspeed"] },
        redirect: "/analytics/overspeed/report",
        children: [
          {
            path: "report",
            name: "AnalyticsOverspeedReport",
            component: () => /* webpackChunkName: "analytics-overspeed-report" */ import('../components/pages/analytics/overspeed/report/OverspeedReport.vue')
          },
          {
            path: "stats",
            name: "AnalyticsOverspeedStats",
            component: () => /* webpackChunkName: "analytics-overspeed-stats" */ import('../components/pages/analytics/overspeed/stats/OverspeedStats.vue')
          },
          {
            path: "map",
            name: "AnalyticsOverspeedMap",
            component: () => /* webpackChunkName: "analytics-overspeed-map" */ import('../components/pages/analytics/overspeed/map/OverspeedMap.vue')
          }
        ]
      },
      {
        path: "/analytics/bridge-collision",
        name: 'AnalyticsBridge',
        component: AnalyticsBridge,
        meta: { requiresAuth: true, breadcrumb: ["Analytics", "Bridge Collision Prevention"] },
        redirect: "/analytics/bridge-collision/report",
        children: [
          {
            path: "report",
            name: "AnalyticsBridgeReport",
            component: () => /* webpackChunkName: "analytics-bridge-report" */ import('../components/pages/analytics/bridge/report/BridgeReport.vue')
          },
          {
            path: "map",
            name: "AnalyticsBridgeMap",
            component: () => /* webpackChunkName: "analytics-bridge-map" */ import('../components/pages/analytics/bridge/map/BridgeMap.vue')
          }
        ]
      },
      {
        path: "/vehicles-settings",
        meta: { requiresAuth: true, breadcrumb: ["Management", "Settings"] },
        component: () => /* webpackChunkName: "vehicules-settings" */ import('../views/vehicles/Settings.vue'),
       redirect: "/vehicles-settings/one",
        children: [
          {
            path: "one/:id?",
            name: "VehiclesSettingsOne",
            component: () => /* webpackChunkName: "vehicles-settings-one" */ import('../components/pages/vehicles/settings/one/VehiclesSettingsOne.vue')
          },
          {
            path: "multiples",
            name: "VehiclesSettingsMultiples",
            component: () => /* webpackChunkName: "vehicles-settings-multiples" */ import('../components/pages/vehicles/settings/multiples/VehiclesSettingsMultiples.vue'),
          }
        ]
      },
      {
        path: "/vehicles-status",
        component: () => /* webpackChunkName: "vehicules-status" */ import('../views/vehicles/Status.vue'),
        meta: { requiresAuth: true, breadcrumb: ["Management", "Status"] },
        redirect: "/vehicles-status/report",
        children: [
          {
            path: "report",
            name: "VehiclesStatusReport",
            component: () => /* webpackChunkName: "vehicles-status-report" */ import('../components/pages/vehicles/status/report/VehiclesStatusReport.vue')
          },
          {
            path: "stats",
            name: "VehiclesStatusStats",
            component: () => /* webpackChunkName: "vehicles-status-stats" */ import('../components/pages/vehicles/status/stats/VehiclesStatusStats.vue')
          }
        ]
      },
      {
        path: "/changes-history",
        name: "ChangesHistory",
        component: () => /* webpackChunkName: "vehicules-status" */ import('../views/vehicles/History.vue'),
        meta: { requiresAuth: true, breadcrumb: ["Management", "Changes History"] },
      },
      {
        path: "/profile",
        name: 'Profile',
        component: () => /* webpackChunkName: "my-profile" */ import('../views/profile/Profile.vue'),
        meta: { requiresAuth: true, breadcrumb: ["Profile"] }
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name === 'Logout') {
    next()
  } else {
    //If this route need authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      //Check if a user is authenticated
      if (!userStore.isAuthenticated.value) {
        //Try to auto loggin user
        await userStore.autoLogin()
        //If the auto loggin is not valid
        if (!userStore.isAuthenticated.value) {
          next({
            path: '/login'
          })
        }
        //Else if auto loggin is valid
        else {
          next()
        }
      } else {
        next()
      }
    } else {
      if (userStore.isAuthenticated.value) {
        next({ path: '/' })
      } else {
        next()
      }
    }
  }


})

export default router;
