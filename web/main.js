import App from './App.svelte';
import metadata from '../metadata.json';

import 'spectre.css';
import 'spectre.css/dist/spectre-exp.min.css';

const app = new App({
	target: document.body,
	props: {
		...metadata
	}
});

window.app = app;

export default app;