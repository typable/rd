import {createShadowDOM, useSource} from './utils.js';

const [el, _] = createShadowDOM('rd-app');
document.body.appendChild(el);
