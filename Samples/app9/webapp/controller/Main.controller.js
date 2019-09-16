sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("com.mjzsoft.demo.ui5.app9.controller.Main", {
		onInit: function () {
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				iconColor: sap.ui.core.IconColor.Default,
				iconTabVisibility: true,
				filtersVisibility: [true, false, false],
				iconTabSelectedKey: 0
			}), "viewModel");
		},
		
		/**
		 * An event handler that react to changes of the slider
		 * @memberOf com.mjzsoft.demo.ui5.app9.controller.Main
		 * @param oEvent
		 * @return null
		 */
		onSliderLiveChange: function (oEvent) {
			var oSlider = oEvent.getSource(),
				iValue = oSlider.getValue(),
				aIconTabFilters = [],
				oViewModel = this.getView().getModel("viewModel");
			for (var i = 0; i < 3; i++) {
				aIconTabFilters.push(this.getView().byId("filter" + i));
			}
			if (iValue === 0) {
				oViewModel.setProperty("/iconTabVisibility", false);
				oViewModel.setProperty("/iconColor", "Default");
			} else {
				oViewModel.setProperty("/iconTabVisibility", true);
			}
			for (i = 0; i < iValue; i++) {
				oViewModel.setProperty("/filtersVisibility/" + i, true);
				oViewModel.setProperty("/iconTabSelectedKey", i);
				oViewModel.setProperty("/iconColor", aIconTabFilters[i].getIconColor());
			}
			for (; i < 3; i++) {
				oViewModel.setProperty("/filtersVisibility/" + i, false);
			}
		}
	});
});