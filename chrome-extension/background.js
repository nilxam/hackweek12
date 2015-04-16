
function querying() {
	'use strict';

	var latestJobID = openqaNotifierSettings.settings.get('latestJobID');

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

	function processJson(type, json, oldJobID, newJobID) {
		var hasWarning = openqaNotifierSettings.settings.get('hasWarning');
		var returnText="";
		if (type == 'workers') {
			// sorting the content by id
			//json.workers.sort(function(a,b) { return a.id - b.id } );
			$.each(json.workers, function(index, d){
				returnText += "worker " + d.host + ":" + d.instance + " is " + d.status + ".\n";
				if ( d.status == "dead" ) {
					hasWarning = 1;
				}
			});
			if ( hasWarning > 0 ) {
				renderBadge('!', '#BF5C76');
			} else {
				renderBadge(' ', '#5CBFA5');
			}
		} else if (type == 'jobs') {
			if (json.jobs.length > 0) {
				$.each(json.jobs, function(index, d){
					returnText += "job" + d.id + ": " + d.name + " is " + d.state + " / " + d.result + ".\n";
					if ( d.id > oldJobID && newJobID >= d.id) {
						if ( d.result == "failed" || d.result == "incomplete" ) {
							hasWarning = 1;
						}
					}
				});
				if ( hasWarning > 0 ) {
					renderBadge('!', '#BF5C76');
				} else {
					renderBadge(' ', '#5CBFA5');
				}
			} else {
				returnText += "No Data!";
			}
		}
		openqaNotifierSettings.settings.set('hasWarning', hasWarning);
		return returnText;
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
		var resultsList = processJson('jobs', data, latestJobID, data.jobs[0].id);
		openqaNotifierSettings.settings.set('resultsList', resultsList);

		if (data.jobs[0].id > latestJobID) {
			openqaNotifierSettings.settings.set('latestJobID', data.jobs[0].id);	
		}
	}).fail(function(jqXHR, textStatus, errorThrown){
		openqaNotifierSettings.settings.set('resultsList', "Something goes wrond!");
	});

}

chrome.alarms.create({periodInMinutes: 5});
chrome.alarms.onAlarm.addListener(querying);
chrome.runtime.onMessage.addListener(querying);

querying();
