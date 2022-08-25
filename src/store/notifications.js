import { reactive, readonly } from "vue";
import hash from "object-hash"

/*

*/

const state = reactive({
    notifications: []
});

const addNotification = (notification) => {
    const notificationHash = hash(notification + new Date())

    if (state.notifications.filter(n => n.hash === notificationHash).length === 0) {
        state.notifications.push({
            hash: notificationHash,
            ...notification
        })
    } else {
        let tempNotifications = state.notifications.filter(n => n.hash !== notificationHash)
        tempNotifications.push({
            hash: notificationHash,
            ...notification
        })
        state.notifications = tempNotifications
    }
}

const closeNotification = (hash) => {

    state.notifications = state.notifications.filter(n => n.hash !== hash)

}

export default {
    state: readonly(state),
    addNotification,
    closeNotification
};
