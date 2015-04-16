
function querying() {
	'use strict';

	function renderBadge(text, color) {
		// #5CBFA5 green
		// #BF5C76 red
		chrome.browserAction.setBadgeText({
			text: text
		});

		chrome.browserAction.setBadgeBackgroundColor({
			color: color
		});
	}

	function processJson(type, json) {
		if (type == 'workers') {
			var workers_status="";
			// sorting the content by id
			//json.workers.sort(function(a,b) { return a.id - b.id } );
			$.each(json.workers, function(index, d){
				workers_status += "worker " + d.host + ":" + d.instance + " is " + d.status + ".\n";
			});

			return workers_status;
		} else if (type == 'jobs') {
			var results_list="";
			if (json.jobs.length > 0) {
				var has_warning = 0
				$.each(json.jobs, function(index, d){
					results_list += d.id + ": " + d.name + " is " + d.state + "/" + d.result + ".\n";
					if (d.result == "failed" ) {
						has_warning = 1;
					}
				});
				if ( has_warning > 0 ) {
					renderBadge('!', '#BF5C76');
				} else {
					renderBadge(' ', '#5CBFA5');
				}
			} else {
				results_list += "No Data!";
			}
			return results_list;
		}
	}

	var instanceUrl = openqaNotifierSettings.settings.get('instanceUrl');
	// query workers
	$.getJSON(instanceUrl + "api/v1/workers", function(data){
	}).done(function(data){
		var workersStatus = processJson('workers', data);
		openqaNotifierSettings.settings.set('workersStatus', workersStatus);
	}).fail(function(jqXHR, textStatus, errorThrown){
		openqaNotifierSettings.settings.set('workersStatus', "Something goes wrond!");
	});

	var limitsVal = openqaNotifierSettings.settings.get('limits');
	// query jobs, do not show cloned jobs
	$.getJSON(instanceUrl + "api/v1/jobs?scope=current&limit=" + limitsVal, function(data){
	}).done(function(data){
		// update results list
		var resultsList = processJson('jobs', data);
		openqaNotifierSettings.settings.set('resultsList', resultsList);
	}).fail(function(jqXHR, textStatus, errorThrown){
		openqaNotifierSettings.settings.set('resultsList', "Something goes wrond!");
	});

}

chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(querying);
chrome.runtime.onMessage.addListener(querying);

querying();
