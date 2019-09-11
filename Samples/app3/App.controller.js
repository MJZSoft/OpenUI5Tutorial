sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	return Controller.extend("com.mjzsoft.App", {
		onInit : function () {
			this.getView().setModel(this.getViewModel(), "AppViewModel");
		},
		getViewModel: function(){
			return new JSONModel({
					title: "This is my first UI5 App."
				});
		}
	});
});