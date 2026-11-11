// sap.ui.define registra este archivo como un módulo UI5 y declara sus dependencias.
// El primer array lista los módulos que necesita cargar antes de ejecutar el código.
sap.ui.define([
    "sap/ui/core/mvc/Controller", // Clase base de la que heredan todos los controladores UI5
    "sap/ui/model/Filter", // Clase para crear condiciones de filtro (campo, operador, valor)
    "sap/ui/model/FilterOperator" // Operadores de filtro disponibles, ej: Contains, EQ
], 

// Bloque JSDoc: no ejecuta nada, solo documenta los tipos de los parámetros de la función
// de abajo, en el mismo orden que el array de dependencias, para que el editor ayude al escribir.
// "typeof" indica que cada parámetro es la clase en sí (la que se usa con "new"), no una instancia.
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 */
// Función callback que recibe como parámetro cada dependencia declarada arriba,
// en el mismo orden: Controller, Filter y FilterOperator.
function(Controller, Filter, FilterOperator) {
    "use strict"; // Activa el modo estricto de JavaScript (evita errores silenciosos comunes)

    // Extiende la clase base Controller para crear un controlador específico de esta vista.
    // El string identifica de forma única este controlador: namespace + carpeta + nombre de archivo.
    return Controller.extend("logaligroup.invoices.controller.MainView", {
        
        // onInit se ejecuta automáticamente cuando la vista asociada se inicializa,
        // antes de que se muestre en pantalla. Es el lugar típico para cargar modelos de datos.
        onInit:function() {
            
            // // Crea una nueva instancia de JSONModel, que permite manejar datos en formato JSON
            // // y enlazarlos (data binding) directamente a los controles de la vista.
            // const oJSONModel = new sap.ui.model.json.JSONModel();
            
            // // Obtiene la referencia a la vista actual, para poder asignarle el modelo más abajo.
            // const oView = this.getView();

            // // Ruta absoluta al JSON, independiente de la página que abra la app
            // const sPath = sap.ui.require.toUrl("logaligroup/invoices/model/SelectScreenMenu.json");

            // // Carga los datos del archivo JSON de forma asíncrona desde la ruta calculada arriba
            // oJSONModel.loadData(sPath);
            
            // // Asigna el modelo cargado a la vista, con el nombre "selectionScreen".
            // // Este nombre es el que se usa en el XML para hacer binding, ej: {selectionScreen>/Countries}
            // oView.setModel(oJSONModel, "selectionScreen");
        },
                // Se ejecuta al pulsar el botón "Filtrar": arma los filtros según lo que el usuario
        // escribió y eligió, y se los aplica a la lista de facturas.
        onFilter:function(oEvent){
            // Lee los datos actuales del modelo JSON (ShipName del Input y CountryKey del Select)
            const oData = this.getView().getModel("selectionScreen").getData();

            // Arreglo donde se acumulan las condiciones de filtro
            let filters =[];

            // Si hay un nombre de barco escrito, filtra las facturas cuyo ShipName lo contenga
            if(oData.ShipName !== ""){
                filters.push(new Filter("ShipName", FilterOperator.Contains, oData.ShipName));
            }
            // Si hay un país elegido, filtra las facturas cuyo Country sea exactamente ese (EQ = igual)
            if(oData.CountryKey !== ""){
                filters.push(new Filter("Country", FilterOperator.EQ, oData.CountryKey));
            }

            // Obtiene la lista de facturas de la vista, usando el id definido en el XML
            const oList = this.getView().byId("invoicesList");
            // Obtiene el binding "items", la conexión entre la lista y el modelo OData (/Invoices)
            const oBinding = oList.getBinding("items");
            // Aplica los filtros: con el modelo OData, se envían al servicio y la lista se vuelve a cargar.
            // Filtros sobre campos distintos se combinan con "Y"; con el arreglo vacío no se filtra nada.
            oBinding.filter(filters);

        },
        // Se ejecuta al pulsar el botón "Limpiar filtros": vacía los campos y restablece la lista.
        onClearFilter:function(){
            // Obtiene el modelo "selectionScreen" para limpiar los campos del panel de filtros
            const oModelSelScreen = this.getView().getModel("selectionScreen");
            oModelSelScreen.setProperty("/ShipName", "");
            oModelSelScreen.setProperty("/CountryKey", "");

            // Quita los filtros de la lista pasándole un arreglo vacío, y vuelve a mostrar todas las facturas
            const oList = this.getView().byId("invoicesList");
            const oBinding = oList.getBinding("items");
            oBinding.filter([]);
        },
        onItemPress:function(oEvent){
            const oItem = oEvent.getSource();
            const sPath = oItem.getBindingContext().getPath();
            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                invoicePath: window.encodeURIComponent(sPath.substr(1))
            });
        },
        onUpdateFinished:function(oEvent){
            // El total puede no estar listo en la primera pasada, así que se comprueba
            const oBinding = oEvent.getSource().getBinding("items");
            if (oBinding.isLengthFinal()) {
                const iTotal = oEvent.getParameter("total");
                const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.byId("invoicesTitle").setText(oResourceBundle.getText("invoicesTitleCount", [iTotal]));
            }
        },
        onFilter:function(){
            this._applyFilters();
        },

        onSearch:function(){
            this._applyFilters();
        },

        onClearFilter:function(){
            const oModel = this.getView().getModel("selectionScreen");
            oModel.setProperty("/ShipName", "");
            oModel.setProperty("/CountryKey", "");
            oModel.setProperty("/SearchQuery", "");
            this._applyFilters();
        },

        _applyFilters:function(){
            const oData = this.getView().getModel("selectionScreen").getData();
            const aFilters = [];

            if (oData.ShipName) {
                aFilters.push(new Filter("ShipName", FilterOperator.Contains, oData.ShipName));
            }
            if (oData.CountryKey) {
                aFilters.push(new Filter("Country", FilterOperator.EQ, oData.CountryKey));
            }
            if (oData.SearchQuery) {
                // El texto libre se busca en tres campos y basta con que coincida en uno (O)
                aFilters.push(new Filter({
                    filters: [
                        new Filter("ShipName", FilterOperator.Contains, oData.SearchQuery),
                        new Filter("Country", FilterOperator.Contains, oData.SearchQuery),
                        new Filter("ProductName", FilterOperator.Contains, oData.SearchQuery)
                    ],
                    and: false
                }));
            }

            const oBinding = this.byId("invoicesList").getBinding("items");
            // Todos los filtros deben cumplirse a la vez (Y)
            oBinding.filter(aFilters.length ? new Filter({ filters: aFilters, and: true }) : []);
        },
    });
});