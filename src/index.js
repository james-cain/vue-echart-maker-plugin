import chartMaker from './chartMaker';

export default chartMaker;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('chart-maker', chartMaker);
}
