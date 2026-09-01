// sap.ui.define([
//     "sap/ui/core/mvc/Controller" // Dependencia: clase base para controladores UI5
// ], (Controller) => {
//     "use strict"; // Modo estricto de JavaScript

//     // Crea el controlador extendiendo la clase base, identificado por su namespace completo
//     return Controller.extend("logaligroup.invoices.controller.MainView", {
//         onInit() { // Se ejecuta automáticamente al inicializar la vista
//             const oJSONModel = new sap.ui.model.json.JSONModel(); // Crea un modelo de datos JSON
//             const oView = this.getView(); // Obtiene referencia a la vista actual
//             oJSONModel.loadData("model/SelectScreenMenu.json"); // Carga los datos desde el archivo JSON
//             oView.setModel(oJSONModel, "selectionScreen"); // Asigna el modelo a la vista con nombre "selectionScreen"
//         }
//     });
// });

// sap.ui.define registra este archivo como un módulo UI5 y declara sus dependencias.
// El primer array lista los módulos que necesita cargar antes de ejecutar el código.
sap.ui.define([
    "sap/ui/core/mvc/Controller" // Clase base de la que heredan todos los controladores UI5
], 

// Función callback que recibe como parámetro cada dependencia declarada arriba,
// en el mismo orden (aquí solo "Controller").
function(Controller) {
    "use strict"; // Activa el modo estricto de JavaScript (evita errores silenciosos comunes)

    // Extiende la clase base Controller para crear un controlador específico de esta vista.
    // El string identifica de forma única este controlador: namespace + carpeta + nombre de archivo.
    return Controller.extend("logaligroup.invoices.controller.MainView", {
        
        // onInit se ejecuta automáticamente cuando la vista asociada se inicializa,
        // antes de que se muestre en pantalla. Es el lugar típico para cargar modelos de datos.
        onInit:function() {
            
            // Crea una nueva instancia de JSONModel, que permite manejar datos en formato JSON
            // y enlazarlos (data binding) directamente a los controles de la vista.
            const oJSONModel = new sap.ui.model.json.JSONModel();
            
            // Obtiene la referencia a la vista actual, para poder asignarle el modelo más abajo.
            const oView = this.getView();
            
            // Carga los datos del archivo JSON de forma asíncrona desde la ruta especificada
            // (relativa a la raíz de la app, dentro de la carpeta "model").
            oJSONModel.loadData("model/SelectScreenMenu.json");
            
            // Asigna el modelo cargado a la vista, con el nombre "selectionScreen".
            // Este nombre es el que se usa en el XML para hacer binding, ej: {selectionScreen>/Countries}
            oView.setModel(oJSONModel, "selectionScreen");
        },
        onFilter:function(oEvent){

        },
        onClearFilter:function(){
            // Obtiene el modelo "selectionScreen" y limpia el país seleccionado dejando el campo vacío
            const oModelSelScreen = this.getView().getModel("selectionScreen");
            oModelSelScreen.setProperty("/ShipName", "");
            oModelSelScreen.setProperty("/CountryKey", "");
        },
    });
});

