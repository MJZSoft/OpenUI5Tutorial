sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox"], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("com.mjzsoft.demo.ui5.app7.controller.Main", {
		onInit: function () {
			this._oI18nModel =  this.getView().getModel("i18n").getResourceBundle();
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app7.controller.Main
		 */
		fnAcceptButton: function (oEvent) {
			var oInputFirstName = this.getView().byId("inputFirstName"),
				oInputLastName = this.getView().byId("inputLastName"),
				oInputAddress = this.getView().byId("inputAddress");
			var sName = "Hi " + oInputFirstName.getValue() + " " + oInputLastName.getValue();
			//var sName =  this._oI18nModel.getText("helloString") + " " + oInputFirstName.getValue() + " " + oInputLastName.getValue();
			//alert(sName);	
			MessageBox.show(
					sName, {
					icon: MessageBox.Icon.INFORMATION,
					title: "Welcome",
					//title: this._oI18nModel.getText("welcomeString")
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) { 
						// clean the values
						oInputFirstName.setValue("");
						oInputLastName.setValue("");
						oInputAddress.setValue("");
						// How to use the class functions?
						//this.fnRejectButton();
					} //.bind(this)
				}
			);
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app7.controller.Main
		 */
		fnRejectButton: function (oEvent) {
			var oInputFirstName = this.getView().byId("inputFirstName"),
				oInputLastName = this.getView().byId("inputLastName"),
				oInputAddress = this.getView().byId("inputAddress");
			oInputFirstName.setValue("");
			oInputLastName.setValue("");
			oInputAddress.setValue("");
		}
	});
});