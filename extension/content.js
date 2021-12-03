'use strict'
const KEY = 'query'  // also in popup.js
const highlighted = new Set([])
const originalInlineOutlines = {}

function highlight(elements) {
	for (const element of elements) {
		if (!highlighted.has(element)) {
			originalInlineOutlines[element] = element.style.outline
			element.style.outline = '4px solid yellow'
			highlighted.add(element)
		}
	}
}

function removeHighlightsExceptFor(matches = new Set()) {
	for (const element of highlighted) {
		if (!matches.has(element)) {
			element.style.outline = originalInlineOutlines[element] ?? ''
			delete originalInlineOutlines[element]
			highlighted.delete(element)
		}
	}
}

function updateHighlights(query) {
	if (query) {
		try {
			const matches = new Set(document.querySelectorAll(query))
			if (matches) {
				removeHighlightsExceptFor(matches)
				highlight(matches)
			}
		} catch {
			console.error(`Probably an invalid selector: ${query}`)
		}
	} else {
		removeHighlightsExceptFor()
	}
}

chrome.storage.onChanged.addListener((changes) => {
	if (KEY in changes) {
		updateHighlights(changes[KEY].newValue)
	}
})

chrome.storage.sync.get([ KEY ], items => {
	updateHighlights(items[KEY])
})
