import { mount } from '@vue/test-utils';
import Settings from '@/views/vehicles/Settings.vue';
import TabContainer from '@/components/commons/tabs/TabsContainer.vue';

describe('Settings', () => {
  it('should display $q proper render', async() => {
    const wrapper = mount(Settings)
    const tabContainer = wrapper.findAllComponents(TabContainer)
    // await tabContainer.setData({tabs : 
    // [
    //   {
    //     id: "one",
    //     title: "One Vehicle",
    //     route: "VehiclesSettingsOne",
    //   },
    //   {
    //     id: "multiple",
    //     title: "Multiple Vehicle",
    //     route: "VehiclesSettingsMultiples",
    //   },
    // ]})
    expect(tabContainer).toBeTruthy()
  })
})

