'use strict'
// NOTE: Also in content.js
const settings = {
	'selector': null,
	'outline': '4px solid yellow'
}

chrome.storage.sync.get(settings, items => {
	for (const setting in settings) {
		if (items[setting]) {
			document.getElementById(setting).value = items[setting]
		}
	}
})

for (const setting in settings) {
	document.getElementById(setting).addEventListener('change', event => {
		if (setting === 'outline' && event.target.value === '') {
			event.target.value = settings.outline
		}
		chrome.storage.sync.set({ [setting]: event.target.value })
	})
}

chrome.runtime.onMessage.addListener(message => {
	if (message.name === 'mutations' || message.name === 'matches') {
		document.getElementById(message.name).innerText = message.data
	} else if (message.name === 'validity') {
		document.getElementById('valid').hidden = message.data === 'invalid'
		document.getElementById('invalid').hidden = message.data === 'valid'
		document.getElementById('selector').setAttribute('aria-invalid',
			message.data === 'invalid')
	}
})

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	chrome.tabs.sendMessage(tabs[0].id, { name: 'get-counters' })
})
