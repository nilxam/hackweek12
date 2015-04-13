function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
	function processJson(json) {
	    var workers_status="";
		// sorting the content by instance number
		json.workers.sort(function(a,b) { return a.instance - b.instance } );
		$.each(json.workers, function(index, d){
			workers_status += "worker " + d.host + ":" + d.instance + " is " + d.status + ".\n";
		});

		renderStatus(workers_status);
	}

	$.getJSON("http://innoko.suse.de/api/v1/workers", function(data){
	}).done(function(data){
		processJson(data);
	}).fail(function(jqXHR, textStatus, errorThrown){
		renderStatus("Something goes wrong!");
	});
});
