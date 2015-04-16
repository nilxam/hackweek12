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
	chrome.storage.local.get('instanceInfo', function (result) {
	    renderInstanceInfo(result.instanceInfo);
	});
	chrome.storage.local.get('workersStatus', function (result) {
	    renderWorkersStatus(result.workersStatus);
	});
	chrome.storage.local.get('resultsList', function (result) {
	   renderResultsList(result.resultsList);
	});
});
