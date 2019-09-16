/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/mjzsoft/demo/ui5/app10/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});