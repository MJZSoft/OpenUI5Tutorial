sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		
		/**
		 * Rounds the number price value to 2 digits and adds a € sign 
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits and € sign rounded
		 */
		numberPrice : function (sValue) {
			if (!sValue) {
				return "€0";
			}
			return "€"+parseFloat(sValue).toFixed(2);
		}

	};

});