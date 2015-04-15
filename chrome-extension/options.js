(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var instanceUrl = document.getElementById('instance_url');
		var versionName = document.getElementById('version_name');
		var distriName = document.getElementById('distri_name');

		function loadSettings() {
			instanceUrl.value = openqaNotifierSettings.settings.get('instanceUrl');
			versionName.value = openqaNotifierSettings.settings.get('versionName');
			distriName.value = openqaNotifierSettings.settings.get('distriName');
		}

		loadSettings();

		document.getElementById('save').addEventListener('click', function () {
			var url = instanceUrl.value;
			url = /\/$/.test(url) ? url : url + '/';

			chrome.permissions.contains({
				origins:[url]
			}, function (result) {
				if (result) {
					chrome.permissions.remove({
						origins: [url]
					});
				}
			});
			// TODO: doesn't work with redirect
			chrome.permissions.request({
				origins: [url]
			}, function (granted) {
				if (granted) {
					openqaNotifierSettings.settings.set('instanceUrl', url);

					loadSettings();
				} else {
					console.error('Permission not granted', chrome.runtime.lastError.message);
				}
			});
		});

		document.getElementById('reset').addEventListener('click', function () {
			chrome.permissions.remove({
				origins: [openqaNotifierSettings.settings.get('instanceUrl')]
			});

			openqaNotifierSettings.settings.reset();
			loadSettings();
		});
	});
})();
