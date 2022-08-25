import { reactive, readonly } from "vue";

const state = reactive({
    isSidenavOpen: true,
    isMobileMenuOpenned: false,
    navigation: [
        {
            name: "Map",
            icon: "map",
            hiddenOnMobile: false,
            children: [
                {
                    name: "Vehicle Locator",
                    to: "MapVehicules",
                    otherRoutes: [],
                    hiddenOnMobile: false
                },
                {
                    name: "Route Analysis",
                    to: "MapRoutes",
                    otherRoutes: [],
                    hiddenOnMobile: true
                },
            ],
        },
        {
            name: "Analytics",
            icon: "analytics",
            hiddenOnMobile: true,
            children: [
                {
                    name: "Overspeed",
                    to: "AnalyticsOverspeedReport",
                    otherRoutes: ["AnalyticsOverspeedStats", "AnalyticsOverspeedMap"],
                    hiddenOnMobile: true
                },
                {
                    name: "Bridge Collision Prevention",
                    to: "AnalyticsBridgeReport",
                    otherRoutes: ["AnalyticsBridgeMap"],
                    hiddenOnMobile: true
                },
            ],
        },
        {
            name: "Vehicle Management",
            icon: "vehicule",
            hiddenOnMobile: false,
            children: [
                {
                    name: "Settings",
                    to: "VehiclesSettingsOne",
                    otherRoutes: ["VehiclesSettingsMultiples"],
                    hiddenOnMobile: false
                },
                {
                    name: "Status",
                    to: "VehiclesStatusReport",
                    otherRoutes: ["VehiclesStatusReport", "VehiclesStatusStats"],
                    hiddenOnMobile: true
                },
                {
                    name: "Changes History",
                    to: "ChangesHistory",
                    otherRoutes: [],
                    hiddenOnMobile: true
                },
                /*
                {
                    name: "Immobilize Vehicule",
                    to: "/vehicles-immobilize/",
                    hiddenOnMobile: true
                },
                */
            ],
        },
        /*
        {
            name: "Admin",
            icon: "admin",
            hiddenOnMobile: true,
            children: [
                {
                    name: "Company Profile",
                    to: "/admin/company",
                    hiddenOnMobile: true
                },
                {
                    name: "Manage Users",
                    to: "/admin/users",
                    hiddenOnMobile: true
                },
                {
                    name: "Manage Companies",
                    to: "/admin/companies",
                    hiddenOnMobile: true
                },
            ],
        },
        */
    ],
});

const openSidenav = () => {
    state.isSidenavOpen = true
}
const closeSidenav = () => {
    state.isSidenavOpen = false
}
const openMenuMobile = () => {
    state.isMobileMenuOpenned = true
}
const closeMenuMobile = () => {
    state.isMobileMenuOpenned = false
}


export default {
    state: readonly(state),
    openSidenav,
    closeSidenav,
    openMenuMobile,
    closeMenuMobile
};
