import './style/global.scss';
import './style/index.scss';

import App from './App.svelte';

const FileTemplateEditor = (options) => {
	if (!options?.target) throw Error('请传入容器 Selector！');
	const {target, ...props} = options;

	return new App({
		target: document.querySelector(target),
		props: {
			options: props
		},
	})
}

FileTemplateEditor({
	target: '#root',
	isOff: false
})

export default FileTemplateEditor;
