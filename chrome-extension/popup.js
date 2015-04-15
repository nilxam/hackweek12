function renderWorkersStatus(text) {
	document.getElementById('workers_status').textContent = text;
}

function renderInstanceInfo(text) {
	document.getElementById('instance_info').textContent = text;
}

document.addEventListener('DOMContentLoaded', function() {
	function processJson(json) {
	    var workers_status="";
		// sorting the content by instance number
		json.workers.sort(function(a,b) { return a.id - b.id } );
		$.each(json.workers, function(index, d){
			workers_status += "worker " + d.host + ":" + d.instance + " is " + d.status + ".\n";
		});

		renderWorkersStatus(workers_status);
	}

	var instanceUrl = openqaNotifierSettings.settings.get('instanceUrl');
	renderInstanceInfo(instanceUrl);

	$.getJSON(instanceUrl + "api/v1/workers", function(data){
	}).done(function(data){
		processJson(data);
	}).fail(function(jqXHR, textStatus, errorThrown){
		renderWorkersStatus("Something goes wrong!");
	});
});
