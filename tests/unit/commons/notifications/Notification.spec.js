import { mount } from '@vue/test-utils';
import Notification from '@/components/commons/notifications/Notification.vue';


describe('Notification', () => {
  it('should display proper render', () => {
    const wrapper = mount(Notification, { props: { notification:{
      title:"Nofification titile"
    }} })
    const labelText = wrapper.find('p');
    expect(labelText.text()).toContain('Nofification titile')
  })
  

})

