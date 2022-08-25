import { defineStore } from "pinia";
import get_geofence_list from "../api/notifications/bridge/bridge_list"
import { sortByAZ, sortByZA } from "../utils/sort";
import userStore from '../store/user'
import { set } from "date-fns";
import { convertZonedToUTC } from "../utils/dates"

export const useGeofence = defineStore('geofence', {
    state: () => ({
        loading: false,
        geofences: [],
        report: {
            selectedGeofence: null,
            sortedGeofences: [],
            sorts: {
                date: null,
                unit: null
            },
            filters: {
                date: null,
                unit: null,
                limit: 25
            },
            page: 1
        },
        map: {
            geofences: [],
            selectedGeofence: null,
            loading: false
        }
    }),
    getters: {
        geofencesNotif: state => {
            return state.report.sortedGeofences
        },
        mapGeofences: state => state.map.geofences,
        reportCurrentPage: state => state.report.page,
        loadingReport: state => state.report.loading
    },
    actions: {
        async fetchGeofences(params = {}, mode = 'report') {
            this.loading = true
            this.map.loading = true
            const resp = await get_geofence_list({ ...params })

            if (mode === 'report') {
                this.geofences = resp.data
                this.report.sortedGeofences = this.geofences
                this.map.geofences = this.geofences
                this.loading = false
            } else {
                this.map.geofences = resp.data
                this.map.loading = false
            }
        },

        async fetchGeofencesPage(page) {
            const selectedUnit =
                this.report.filters.unit
                    ? userStore.userUnits.value.find(_unit => _unit.unit_name === this.report.filters.unit).unit_uuid
                    : null
            const start =
                this.report.filters.date.start
                    ? convertZonedToUTC(set(new Date(this.report.filters.date.start), { hours: 0, minutes: 0, seconds: 0 }))
                    : null
            const end =
                this.report.filters.date.end
                    ? convertZonedToUTC(set(new Date(this.report.filters.date.end), { hours: 23, minutes: 59, seconds: 59 }))
                    : null

            const params = {
                limit: this.report.filters.limit,
                page: page,
                unit: selectedUnit,
                start: start,
                end: end,
            }
            const resp = await get_geofence_list(params);
            this.geofences = resp.data
            this.report.sortedGeofences = this.geofences
            this.report.page = page
        },

        sortGeofences(column, type) {
            this.report.sorts[column] = type;
            this.report.sortedGeofences =
                this.report.sorts[column] === "up"
                    ? sortByAZ(this.report.sortedGeofences, column)
                    : sortByZA(this.report.sortedGeofences, column);
        },
        resetReportFilters() {
            this.report.filters.date = {
                start: null,
                end: null
            }
            this.report.filters.unit = null
        },
        setSelectedGeofence(geofence) {
            this.map.selectedGeofence = geofence
        },
        setSelectedReportGeofence(geofence) {
            this.report.selectedGeofence = geofence
            if (geofence) {
                this.report.filters.unit = geofence.unit_name
                this.report.filters.date = geofence.time
            }
        },
        setReportGeofences(geofences) {
            this.report.sortedGeofences = geofences
            this.report.loading = false
        },
        resetMapFilter() {
            this.map.filters = {
                date: {
                    start: null,
                    end: null
                },
                unit: null
            }
        },
        reset() {
            this.$reset()
        }
    }
})