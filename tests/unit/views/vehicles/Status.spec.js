import { mount } from '@vue/test-utils';
import Status from '@/views/vehicles/Status.vue';
import TabContainer from '@/components/commons/tabs/TabsContainer.vue';

describe('Status', () => {
  it('should display $q proper render', async() => {
    const wrapper = mount(Status)
    const tabContainer = wrapper.findAllComponents(TabContainer)
    // await tabContainer.setData({tabs : 
    // [
      // {
      //   id: "report",
      //   title: "Report",
      //   route: "VehiclesStatusReport",
      // },
      // {
      //   id: "stats",
      //   title: "Stats",
      //   route: "VehiclesStatusStats",
      // },
    // ]})
    expect(tabContainer).toBeTruthy()
  })
})

