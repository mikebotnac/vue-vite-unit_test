import { mount } from '@vue/test-utils';
import Overspeed from '@/views/analytics/Overspeed.vue';
import TabContainer from '@/components/commons/tabs/TabsContainer.vue';

describe('Overspeed', () => {
  it('should display $q proper render', () => {
    const wrapper = mount(Overspeed)
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

