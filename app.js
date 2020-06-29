// app.js (bootstrapper): minimal — imports and initializes the Homepage module.

import initHomepage from './pages/Homepage.js';

document.addEventListener('DOMContentLoaded', () => {
  initHomepage(document.getElementById('app'));
});