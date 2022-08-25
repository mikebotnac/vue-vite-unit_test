import { defineStore } from "pinia";
import get_overspeed_list from "../api/notifications/overspeed/overspeed_list.js";
import get_overspeed_stats from "../api/notifications/overspeed/overspeed_stats.js";
import get_overspeed_mileage from "../api/notifications/overspeed/overspeed_mileage.js";
import { sortByAZ, sortByZA } from "../utils/sort";
import userStore from '../store/user'

import { convertOverspeed } from "../utils/notifications.js";
import { convertZonedToUTC } from "../utils/dates.js";
import { set } from "date-fns";

export const useOverspeed = defineStore('overspeed', {
    state: () => ({
        loading: false,
        overspeeds: [],
        report: {
            selectedOverspeed: null,
            pageInfos: null,
            sortedOverspeed: [],
            sorts: {
                date: null,
                unit: null,
                speed_limit_in_kmh: null,
                speed_delta_in_kmh: null,
                duration_in_s: null
            },
            filters: {
                date: null,
                timestamp: null,
                unit: '',
                limit: 25,
                speed_limit_in_kmh: {
                    sign: '>',
                    value: null
                },
                speed_delta_in_kmh: {
                    sign: '>',
                    value: null
                },
            },
        },
        resultCount: 0,
        stats: {
            loading: false,
            stats: [],
            distance:0,
        },
        map: {
            selectedOverspeed: null,
            overspeeds: [],
            loading: false
        }
    }),
    getters: {
        reportOverspeeds: state => {
            return state.report.sortedOverspeed
        },
        mapOverspeeds: state => {
            return state.map.overspeeds
        }
    },
    actions: {
        async fetchOverspeeds(params = {}, mode = 'report') {

            if (mode === 'report') {
                this.loading = true
            } else {
                this.map.loading = true
            }

            const resp = await get_overspeed_list({ ...params, })

            if (mode === 'report') {
                this.overspeeds = resp.data.map(o => {
                    return convertOverspeed({ from: 'report', data: o })
                });
                this.resultCount = resp.count;
                this.report.sortedOverspeed = this.overspeeds
                this.report.pageInfos = {
                    currentPage: 1
                }
            } else {
                this.map.overspeeds = resp.data.map(o => {
                    return convertOverspeed({ from: 'report', data: o })
                });
                this.map.loading = false
            }

            this.loading = false
        },
        async fetchOverspeedsPage(page) {

            const speedUnit = userStore.speedUnit.value;
            let above = this.report.filters.speed_delta_in_kmh.value
            if (speedUnit === 'mph') {
                above = this.report.filters.speed_delta_in_kmh.value / 0.621371
            }

            const selectedUnit =
                this.report.filters.unit
                    ? userStore.userUnits.value.find(_unit => _unit.unit_name === this.report.filters.unit).unit_uuid
                    : null

            const start =
                this.report.filters.date
                    ? convertZonedToUTC(set(new Date(this.report.filters.date), { hours: 0, minutes: 0, seconds: 0 }))
                    : null
            const end =
                this.report.filters.date
                    ? convertZonedToUTC(set(new Date(this.report.filters.date), { hours: 23, minutes: 59, seconds: 59 }))
                    : null

            const params = {
                limit: this.report.filters.limit,
                page: page,
                unit: selectedUnit,
                start: start,
                end: end,
                overspeed_above: above ? Math.round(above) : null
            }
            const resp = await get_overspeed_list(params);
            this.overspeeds = resp.data.map(o => {
                return convertOverspeed({ from: 'report', data: o })
            });
            this.report.sortedOverspeed = this.overspeeds
            this.report.pageInfos = {
                ...this.report.pageInfos,
                currentPage: page
            }
        },
        async fetchOverspeedsStats(params = {}) {
            this.stats.loading = true
            const resp = await get_overspeed_stats(params)
            const resp1 = await get_overspeed_mileage(params)
            this.stats.stats = resp.data
            this.stats.distance = resp1?.data
            this.stats.loading = false
        },
        sortOverspeeds(column, type) {
            this.report.sorts[column] = type;
            this.report.sortedOverspeed =
                this.report.sorts[column] === "up"
                    ? sortByAZ(this.report.sortedOverspeed, column)
                    : sortByZA(this.report.sortedOverspeed, column);
        },
        resetReportFilters() {
            this.report.filters.date = null
            this.report.filters.unit = ''
            this.report.filters.speed_delta_in_kmh = {
                sign: '>',
                value: null
            }
        },
        setReportOverspeeds(overspeeds) {
            this.report.sortedOverspeed = overspeeds
        },
        setSelectedOverspeed(overspeed) {
            this.map.selectedOverspeed = overspeed
        },
        setSelectedReportOverspeed(overspeed) {
            this.report.selectedOverspeed = overspeed
            this.report.pageInfos = null
        },
        reset() {
            this.$reset()
        }
    }
})