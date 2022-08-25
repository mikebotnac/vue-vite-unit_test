import { createApp } from 'vue';
import App from "./App.vue";
import "./index.css";
import Router from "./router";

//STORES
import navigationStore from "./store/navigation"
import gmapStore from "./store/gmap"
import deviceStore from "./store/devices"
import userStore from "./store/user"
import notificationsStore from "./store/notifications"
import uiStore from "./store/ui"

//OTHERS
import { Vue3Mq } from "vue3-mq";

import { createPinia } from 'pinia';

// Monitoring
import { Rollbar } from 'vue-rollbar';
import { datadogRum } from '@datadog/browser-rum';
import VueGtag from "vue-gtag-next";

import i18n from '../i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';



if (import.meta.env.VITE_ENVIRONMENT !== 'development') {
    datadogRum.init({
        applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
        site: 'datadoghq.com',
        service: 'esmart-client-app',
        sampleRate: 100,
        trackInteractions: true,
        defaultPrivacyLevel: 'mask-user-input'
    });
    datadogRum.startSessionReplayRecording();
}

const ClickOutside = {
    beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event, el);
            }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
    },
}

createApp(App)
    .use(Router)
    .use(createPinia())
    .use(Rollbar, {
        accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
        enabled: true,
        source_map_enabled: true,
        environment: import.meta.env.VITE_ENVIRONMENT,
        payload: {
            client: {
                javascript: {
                    code_version: '1.0'
                }
            }
        }
    })
    .use(VueGtag, {
        property: {
            id: import.meta.env.VITE_GOOGLE_TAG,
            params: {
                send_page_view: true,
                appName: 'esmart-client-app',
            }
        },
        appName: 'esmart-client-app',
        useDebugger: import.meta.env.VITE_ENVIRONMENT !== 'development',
        isEnabled: import.meta.env.VITE_ENVIRONMENT !== 'development',
        pageTrackerEnabled: true,
        pageTrackerScreenviewEnabled: true,
        pageTrackerUseFullPath: true,
        pageTrackerPrependBase: true,
        pageTrackerSkipSamePath: true,
    }
    )
    .use(Vue3Mq, {
        breakpoints: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280
        }
    })
    .use(i18n)
    .provide("navigationStore", navigationStore)
    .provide("gmapStore", gmapStore)
    .provide("deviceStore", deviceStore)
    .provide("userStore", userStore)
    .provide("notificationsStore", notificationsStore)
    .provide("uiStore", uiStore)
    /* .directive('ClickOutside', ClickOutside) */
    .mount("#app");
