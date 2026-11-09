sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("logaligroup.invoices.controller.Detail", {

        onInit:function(){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched:function(oEvent){
            const sPath = window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath);
            this.getView().bindElement({
                path: "/" + sPath
            });
        },

        onNavBack:function(){
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        }
    });
});