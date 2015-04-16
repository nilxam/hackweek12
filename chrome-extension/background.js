//var instanceInfo='Your host';
//var workersStatus='Loading...';
//var resultsList='Loading...';

function querying() {

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
				$.each(json.jobs, function(index, d){
					results_list += d.id + ": " + d.name + " is " + d.state + "/" + d.result + ".\n";
				});
			} else {
				results_list += "No Data!";
			}
			return results_list;
		}
	}

	var instanceInfo = openqaNotifierSettings.settings.get('instanceUrl');
	chrome.storage.local.set({'instanceInfo': instanceInfo}, function () {});

	// query workers
	$.getJSON(instanceInfo + "api/v1/workers", function(data){
	}).done(function(data){
		var workersStatus = processJson('workers', data);
		chrome.storage.local.set({'workersStatus': workersStatus}, function () {});
	}).fail(function(jqXHR, textStatus, errorThrown){
		chrome.storage.local.set({'workersStatus': "Something goes wrong!"}, function () {});
	});

	var limitsVal = openqaNotifierSettings.settings.get('limits');
	// query jobs, do not show cloned jobs
	$.getJSON(instanceInfo + "api/v1/jobs?scope=current&limit=" + limitsVal, function(data){
	}).done(function(data){
		var resultsList = processJson('jobs', data);
		chrome.storage.local.set({'resultsList': resultsList}, function () {});
	}).fail(function(jqXHR, textStatus, errorThrown){
		chrome.storage.local.set({'resultsList': "Something goes wrong!"}, function () {});
	});
}

chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(querying);
chrome.runtime.onMessage.addListener(querying);

querying();
