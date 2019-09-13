sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("com.mjzsoft.demo.ui5.app8.controller.Main", {
		onInit: function () {
			this.getView().setModel( new sap.ui.model.json.JSONModel({
				iconColor: "sap.ui.core.IconColor.Default" //#fff" 
			}), "viewModel");
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app8.controller.Main
		 */
		onSliderLiveChange: function (oEvent) {
			var oSlider = oEvent.getSource(),
				iValue = oSlider.getValue(),
				aIconTabFilters = [],
				oIconTabBar = this.getView().byId("bar0"),
				oViewModel = this.getView().getModel("viewModel");
				for(var i=0; i<3; i++){
					aIconTabFilters.push(this.getView().byId("filter" + i));
				}
				if(iValue === 0){
					oIconTabBar.setVisible(false);
					oViewModel.setProperty("/iconColor", "sap.ui.core.IconColor.Default");
				} else{
					oIconTabBar.setVisible(true);
				}
				for(i=0; i< iValue; i++){
					aIconTabFilters[i].setVisible(true);
					oIconTabBar.setSelectedKey(i); 
					oViewModel.setProperty("/iconColor", aIconTabFilters[i].getIconColor());
				}
				for(; i<3; i++){
					aIconTabFilters[i].setVisible(false); 
				}
		}
	});
});