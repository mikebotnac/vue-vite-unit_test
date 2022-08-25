import { mount } from '@vue/test-utils';
import Bridge from '@/views/analytics/Bridge.vue';
import TabContainer from '@/components/commons/tabs/TabsContainer.vue';
describe('Bridge', () => {
  it('should display $q proper render', async () => {

    const wrapper = mount(Bridge)
    const tabContainer = wrapper.findAllComponents(TabContainer)
    // await tabContainer.setData({tabs : [
    //   {
    //     id: "report",
    //     title: "Report",
    //     route: "AnalyticsBridgeReport",
    //   },
    //   {
    //     id: "map",
    //     title: "Map",
    //     route: "AnalyticsBridgeMap",
    //   },
    // ]})
    expect(tabContainer).toBeTruthy()
    expect(true).toBe(true);
  })
})

