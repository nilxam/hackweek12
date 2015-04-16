(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var instanceUrl = document.getElementById('instance_url');
		var limitsNum = document.getElementById('limits');

		function loadSettings() {
			instanceUrl.value = openqaNotifierSettings.settings.get('instanceUrl');
			limitsNum.value = openqaNotifierSettings.settings.get('limits');
		}

		loadSettings();

		document.getElementById('save').addEventListener('click', function () {
			var url = instanceUrl.value;
			url = /\/$/.test(url) ? url : url + '/';

			// set limits
			openqaNotifierSettings.settings.set('limits', limitsNum.value);

			// TODO: doesn't work with redirect
			chrome.permissions.request({
				origins: [url]
			}, function (granted) {
				if (granted) {
					openqaNotifierSettings.settings.set('instanceUrl', url);

					loadSettings();
					chrome.runtime.sendMessage('querying');
				} else {
					loadSettings();
					console.error('Permission not granted', chrome.runtime.lastError.message);
				}
			});
		});

		document.getElementById('reset').addEventListener('click', function () {
			openqaNotifierSettings.settings.reset();
			loadSettings();
			chrome.runtime.sendMessage('querying');
		});
	});
})();
