import { mount } from '@vue/test-utils';
import Running from '@/components/gmap/markers/Running.vue';


describe('Running', () => {
  it('should display proper render', () => {
    const wrapper = mount(Running, { props: { label: 'RUNNING' } })
    const labelText = wrapper.find('div');
    expect(labelText.text()).toContain('RUNNING')
  })
})

