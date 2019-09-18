sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
	"use strict";
	return BaseController.extend("com.mjzsoft.demo.ui5.app12.controller.Object", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay, oViewModel = new JSONModel({
				busy: true,
				delay: 0,
				formEditable: false,
				saveButtonVisible: false
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("Products", {
					ProductID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				// TODO Explain this target for viewers  
				return;
			}
			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ProductID,
				sObjectName = oObject.ProductName;
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [
				sObjectName,
				sObjectId,
				location.href
			]));
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app12.controller.Object
		 */
		onEditButtonPressed: function (oEvent) {
			var oViewModel = this.getModel("objectView"),
				oButton = oEvent.getSource();
			if (oViewModel.getProperty("/formEditable") === true) {
				if (this._bDataChanged === true) {
					this.getModel().updateBindings(true);
					this._bDataChanged = false;
				}
				oButton.setIcon("sap-icon://edit");
				oViewModel.setProperty("/saveButtonVisible", false);
			} else {
				this._bDataChanged = false;
				oButton.setIcon("sap-icon://cancel");
				oViewModel.setProperty("/saveButtonVisible", true);
			}
			oViewModel.setProperty("/formEditable", !oViewModel.getProperty("/formEditable"));
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app12.controller.Object
		 */
		onInputChange: function (oEvent) {
			var oButton = this.getView().byId("buttonEdit");
			this._bDataChanged = true;
			oButton.setIcon("sap-icon://undo");
		},
		/**
		 *@memberOf com.mjzsoft.demo.ui5.app12.controller.Object
		 */
		onSaveButtonPress: function (oEvent) {
			if(this._bDataChanged === false){
				sap.m.MessageToast.show("You changed nothing.");
				return;
			}
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				aControls = oView.getControlsByFieldGroupId("productField"),
				oButton = this.getView().byId("buttonEdit"),
				oModel = this.getModel(),
				oObject = {};
			aControls.forEach(function (oControl) {
				if (oControl.getMetadata().getName() === "sap.m.Input") {
					oObject[oControl.getBindingPath("value")] = oControl.getValue();
				} else if (oControl.getMetadata().getName() === "sap.m.CheckBox") {
					oObject[oControl.getBindingPath("selected")] = oControl.getSelected();
				}
			});
			// This part tries to make the object properties compatible with their data type. 
			var oEntity = this._extractEntity("NorthwindModel.Product");
			if (oEntity && oEntity.property) {
				oEntity.property.forEach(function (oItem) {
					if (oItem.type === "Edm.Int32" || oItem.type === "Edm.Int16") {
						oObject[oItem.name] = parseInt(oObject[oItem.name], 10);
					} else if (oItem.type === "Edm.Decimal") {
						oObject[oItem.name] = parseFloat(oObject[oItem.name], 10);
					}
				});
			}
			//End of compatibility code 
			oModel.update(oView.getElementBinding().getPath(), oObject, {
				success: function () {
					this._bDataChanged = false;
					oButton.setIcon("sap-icon://edit");
					oViewModel.setProperty("/saveButtonVisible", false);
					oViewModel.setProperty("/formEditable", false);
					sap.m.MessageToast.show("Your changes has been saved successfully.");
				}.bind(this),
				error: function (oError) {
					sap.m.MessageToast.show("Some error happened during the update process.");
				}
			});
		},
		/*
		 * Extracts the related entity object from the metadata 
		 */
		_extractEntity: function (sEntityName) {
			var aRes = sEntityName.split("."),
				sNamespace = aRes[0],
				sEntity = aRes[1],
				oEntity,
				oModel = this.getModel(),
				oMetaData = oModel.getServiceMetadata();
			for (var j = 0; j < oMetaData.dataServices.schema.length; j++) {
				if (oMetaData.dataServices.schema[j].namespace === sNamespace) {
					var aEntities = oMetaData.dataServices.schema[j].entityType;
					for (var i = 0; i < aEntities.length; i++) {
						if (aEntities[i].name === sEntity) {
							oEntity = aEntities[i];
							break;
						}
					}
					break;
				}
			}
			return oEntity;
		},
	});
});