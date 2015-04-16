(function () {
	'use strict';

	window.openqaNotifierSettings = (function () {
		var defaults = {
			instanceUrl: 'http://openqa.opensuse.org/',
			limits: 10,
		};

		var data = {
			settings: {
				get: function (name) {
					var item = localStorage.getItem(name);
					if (item === null || item === undefined) {
						return ({}.hasOwnProperty.call(defaults, name) ? defaults[name] : void 0);
					} else if (item === 'true' || item === 'false') {
						return (item === 'true');
					}
					return item;
				},
				set: localStorage.setItem.bind(localStorage),
				reset: function () {
					Object.keys(localStorage).forEach(data.settings.revert);
				},
				revert: localStorage.removeItem.bind(localStorage)
			}
		};

		return data;
	})();
})();
