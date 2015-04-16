function renderWorkersStatus(text) {
	document.getElementById('workers_status').textContent = text;
}

function renderInstanceInfo(text) {
	document.getElementById('instance_info').textContent = text;
}

function renderResultsList(text) {
	document.getElementById('results_list').textContent = text;
}

document.addEventListener('DOMContentLoaded', function() {
	renderInstanceInfo(openqaNotifierSettings.settings.get('instanceUrl'));
	renderWorkersStatus(openqaNotifierSettings.settings.get('workersStatus'));
	renderResultsList(openqaNotifierSettings.settings.get('resultsList'));
	// reset hasWarning flag
	openqaNotifierSettings.settings.set('hasWarning', 0);
	// reset badge
	chrome.browserAction.setBadgeText({ text: '' });
});
