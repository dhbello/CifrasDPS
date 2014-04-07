
// URL Fuentes
// divipola.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/vistaappdivipola?$format=json&orden=nombredepartamento,nombremunicipio,orden&$top=10000
// metadatanacionalanual.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalanual/?$format=json&$orderby=anofecha&$top=10000
// metadatanacionalpp.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalpp/?$format=json&$top=10000
// datadptoanual.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptoanual/?$format=json&$orderby=anofecha&$top=10000
// datadptopp.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptopp/?$format=json&$top=10000
// datamunicipalanual.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalanual?$format=json&$orderby=anofecha&$top=50000
// datamunicipalpp.js - http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalpp?$format=json&$top=50000

/*

PARAMETROS CONFIGURABLES

*/
// Ubicación de la versión web de la aplicación
var _url = 'http://dps.azurewebsites.net/';

// Ubicación de la encuesta a los usuarios
var _url_encuesta = 'http://www.dps.gov.co/Servicio_al_Ciudadano/Informacion_de_Contacto.aspx';
var _url_dps = 'http://www.dps.gov.co';

// Ubicación de los servicios de mapas que consume la aplicación
var _map_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer';
var _map_url2 = 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer';

// Ubicación de los servicios de datos (remotos y locales)
var _data_nacional_anual = './data/json/metadatanacionalanual.js';
var _data_nacional_pp = './data/json/metadatanacionalpp.js';
var _data_deptos_anual = './data/json/datadptoanual.js';
var _data_deptos_pp = './data/json/datadptopp.js';
var _data_muni_anual = './data/json/datamunicipalanual.js';
var _data_muni_pp = './data/json/datamunicipalpp.js';

var _data_web  = [
    ['divipola.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/vistaappdivipola?$format=json&orden=nombredepartamento,nombremunicipio,orden&$top=10000'],
    ['metadatanacionalanual.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalanual/?$format=json&$orderby=anofecha'],
    ['metadatanacionalpp.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalpp/?$format=json'],
    ['datadptoanual.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptoanual/?$format=json&$orderby=anofecha'],
    ['datadptopp.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptopp/?$format=json'],
    ['datamunicipalanual.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalanual?$format=json&$orderby=anofecha&$top=10000'],
    ['datamunicipalpp.js', 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalpp?$format=json&$top=10000']
    ];

// Mensaje que aparece en la opcion compartir desde redes sociales
var _msg_share_tw = '@DPSColombia ';
var _msg_share_fb = '@DPSColombia ';
var _name_pp_actual = 'PRESIDENCIAL SANTOS CALDER&Oacute;N';

// Variables con los prefijos (de programas), nombres de la variables y nombres largos de dichas variables
var preffixes = ["fam", "per", "inv", "pro", "has"];
var preffixesDesc = ["Familias", "Personas", "Inversi&oacute;n", "Proyectos", "Hectareas"];
var preffixesDescValor = ["Numero de familias", "Numero de personas", "Millones de pesos", "Numero de proyectos", "Hectareas"];

// Escalas de colores para el mapa
var mapaColores = [[
                        { r: 86, g: 168, b: 45, a: 0.45 },
                        { r: 141, g: 209, b: 107, a: 0.45 },
                        { r: 211, g: 255, b: 191, a: 0.45 },
                        { r: 166, g: 154, b: 166, a: 0.45 },
                        { r: 118, g: 69, b: 138, a: 0.45 }
                    ], // Familias
                    [
                        { r: 86, g: 168, b: 45, a: 0.45 },
                        { r: 141, g: 209, b: 107, a: 0.45 },
                        { r: 211, g: 255, b: 191, a: 0.45 },
                        { r: 166, g: 154, b: 166, a: 0.45 },
                        { r: 118, g: 69, b: 138, a: 0.45 }
                    ], // Personas
                    [
                        { r: 255, g: 255, b: 115, a: 0.45 },
                        { r: 230, g: 230, b: 0, a: 0.45 },
                        { r: 255, g: 170, b: 0, a: 0.45 },
                        { r: 255, g: 0, b: 0, a: 0.45 },
                        { r: 168, g: 0, b: 0, a: 0.45 }
                    ], // Inversión
                    [
                        { r: 229, g: 213, b: 242, a: 0.45 },
                        { r: 191, g: 163, b: 207, a: 0.45 },
                        { r: 157, g: 120, b: 173, a: 0.45 },
                        { r: 123, g: 79, b: 140, a: 0.45 },
                        { r: 93, g: 44, b: 112, a: 0.45 }                    
                    ], //Proyectos
                    [
                        { r: 211, g: 255, b: 191, a: 0.45 },
                        { r: 156, g: 219, b: 125, a: 0.45 },
                        { r: 108, g: 184, b: 70, a: 0.45 },
                        { r: 68, g: 148, b: 28, a: 0.45 },
                        { r: 38, g: 115, b: 0, a: 0.45 }
                    ] // Hectareas
                    ];

// Años que se pueden seleccionar
var annios_seleccion = ["2010", "2011", "2012", "2013"];

// Variables de la entidad que se quiere poner en primer lugar
var dpsName = "DEPARTAMENTO PARA LA PROSPERIDAD SOCIAL";


/*

VARIABLES (NO CONFIGURABLES)

*/

var programas = [];
var cPreffix = -1;
var municipios = [];


var cache_data;
var cache_data_nacional_anual;
var cache_data_nacional_pp;
var cache_data_deptos_anual;
var cache_data_deptos_pp;
var cache_data_muni_anual;
var cache_data_muni_pp;

var map;
var loaded = false;
var gl;
var popup;
var popcontent;
var headerGeom;
var params;

var pLat = 4.598056;
var pLng = -74.075833;

var currentExtent;
var currentPoint;
var pressTimer;
var evtParams;

var ndx;
var all;

var dateDimension;
var datoGroup;
var variableName;
var prefixName;

var dateName = '2012';

var datoTipo = 1;
var tipoReporte = 0;
var currentView = 1;
var tentidades = [];

function init() {    
    
    $('#ftime').find('option').remove().end().append('<option value="-999">Presidencial Actual</option>').val('-999');
    for (var i = 0; i < annios_seleccion.length; i++) {
        $('#ftime').append($('<option>', { value: annios_seleccion[i] }).text(annios_seleccion[i]));
    };
    datoTipo = 1;
    $('#ftime').val(0);
    $('#ftime').selectmenu('refresh', true);
    //$("#btn_seleccion .ui-btn-text").css("font-size", "large");

    $.ajax({
        url: "./data/json/divipola.js",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (data) {
            municipios = data.d;
        }
    });

    $.ajax({
        url: "./data/Maestro_Programas.csv",
        type: 'GET',
        async: false,
        success: function (data) {
            programas = $.csv.toObjects(data);
            programas.sort(function(a, b) {
                return parseInt(a.orden) - parseInt(b.orden);
            })
            var seleccion = 0;
            for (var i = 0; i < programas.length; i++) {
                if ($.inArray(programas[i].ENTIDAD, tentidades) == -1) {
                    if (programas[i].ENTIDAD == dpsName){
                        tentidades.unshift(programas[i].ENTIDAD);
                    } else {
                        tentidades.push(programas[i].ENTIDAD);
                    }
                };
                programas[i].PREFIJO = programas[i].PREFIJO.toString().replace("_", "").toLowerCase();
                $('#fprograma').append($('<option>', { value: i }).text(programas[i].NOMBRE_PROGRAMA));
                if (programas[i].PREFIJO == "dps"){
                    seleccion = i;
                };
            };
            for (var i = 0; i < tentidades.length; i++) {
                $('#fentidad').append($('<option>', { value: tentidades[i] }).text(tentidades[i]));
            };
            $('#fprograma').val(seleccion);
            $('#fprograma').selectmenu('refresh', true);
        }
    });


    if (isPhoneGap()) {
        document.addEventListener("backbutton", function () {
            if ($(".ui-page-active .ui-popup-active").length > 0) {
                $('#reportar').popup('close');
                $('#share').popup('close');
                $('#acerca').popup('close');
                $('#tutorial').popup('close');
                $('#msg').popup('close');
                $('#msg2').popup('close');
                $('#descripcion').popup('close');
            } else {
                navigator.notification.confirm(
                     'Estas seguro que quieres salir?',
                     function (button) {
                         if (button == 2) {
                             navigator.app.exitApp();
                         };
                     },
                     'Salir',
                     'No,Si'
                 );                
            };
        }, true);
        $("#updateBtn").show();

    }
   
    popup = new esri.dijit.InfoWindowLite(null, dojo.create("div"));
    popup.startup();

    $('#ftime').change(function () {
        if ($('#ftime')[0].value == "-999") {
            datoTipo = 1;
        } else {
            datoTipo = 0;
            dateName = parseInt($("#ftime").val());            
        };
        updateDatos();
    });

    $('#fdepto').change(function () {
        fdeptoChange();
        $('#seleccion').popup('reposition', 'positionTo: window');
    });

    $('#fmunicipio').change(function () {
        $('#seleccion').popup('reposition', 'positionTo: window');
        updateDatos();
        updateDepto();
    });

    $('#fentidad').change(function () {
        $('#seleccion').popup('reposition', 'positionTo: window');
        fentidadChange();
    });

    $('#fprograma').change(function () {
        $('#seleccion').popup('reposition', 'positionTo: window');
        updateDatos();
    });

    if (isPhoneGap()) {
        map = new esri.Map("map", {
            zoom: 5,
            minZoom: 3,
            maxZoom: 9,
            infoWindow: popup,
            extent: new esri.geometry.Extent({ xmin: -11613536.329533452, ymin: -731349.486632372, xmax: -4931105.56873198, ymax: 1768447.0864053678, spatialReference: { wkid: 102100 } }),
            autoresize: false
        });
    } else {
        map = new esri.Map("map", {
            zoom: 5,
            minZoom: 3,
            maxZoom: 9,
            nav: true,
            infoWindow: popup,
            extent: new esri.geometry.Extent({ xmin: -11613536.329533452, ymin: -731349.486632372, xmax: -4931105.56873198, ymax: 1768447.0864053678, spatialReference: { wkid: 102100 } }),
            autoresize: false
        });        
    };
    dojo.connect(map, "onLoad", mapLoadHandler);
    gl = new esri.layers.GraphicsLayer();
    var sr = new esri.renderer.SimpleRenderer(
                new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0, 0.45]), 2),
                                                        new dojo.Color([0, 0, 0, 0])));
    gl.setRenderer(sr);

    if (isPhoneGap()) {
        if (((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE))) {
            map.addLayer(new esri.layers.GraphicsLayer());
            map.addLayer(gl, 0);
        } else {
            var mapLayerGris = new esri.layers.ArcGISTiledMapServiceLayer(_map_url);
            var mapLayerEtiquetado = new esri.layers.ArcGISTiledMapServiceLayer(_map_url2);
            map.addLayer(mapLayerGris);
            map.addLayer(mapLayerEtiquetado);
            map.addLayer(gl, 0);

        };
    } else {
        var mapLayerGris = new esri.layers.ArcGISTiledMapServiceLayer(_map_url);
        var mapLayerEtiquetado = new esri.layers.ArcGISTiledMapServiceLayer(_map_url2);
        map.addLayer(mapLayerGris);
        map.addLayer(mapLayerEtiquetado);
        map.addLayer(gl, 0);

    };
    if (isPhoneGap()) {
        params = window.localStorage.getItem("url");
    } else {
        params = getUrlVars()["pos"];
    };
    $('#acerca').popup('open');
    if (params != null) {
        currentView = parseInt(params.split("A")[0]);
        $('#fdepto').val(params.split("A")[1]);
        $('#fdepto').selectmenu('refresh', true);
        if ($('#fdepto')[0].value == "-999") {
            $('#munidiv').hide();
        } else {
            $('#munidiv').show();
            $.each(municipios, function (index, value) {
                if (value.codigodanedpto == $('#fdepto')[0].value) {
                    if ((value.nombremunicipio.indexOf("(DP)")) == -1) {
                        $('#fmunicipio').append($('<option>', { value: value.codigodanempio }).text(value.nombremunicipio));
                    };
                }
            });
        };
        $('#fmunicipio').val(params.split("A")[2]);
        $('#fmunicipio').selectmenu('refresh', true);
        $('#fentidad').val(params.split("A")[3]);
        $('#fentidad').selectmenu('refresh', true);
        $('#fprograma').val(params.split("A")[4]);
        $('#fprograma').selectmenu('refresh', true);
        $('#ftime').val(params.split("A")[5]);
        $('#ftime').selectmenu('refresh', true);
        dateName = parseInt($("#ftime").val());
        datoTipo = parseInt(params.split("A")[6]);
        cPreffix = parseInt(params.split("A")[7]);
        setView(currentView);
    };    
    $("#barBtn" + currentView).addClass("ui-btn-active");
    updateDatos();
    updateMapaDatos();
    updateSize();
}

function home(){
    $('#fdepto').val(-999);
    $('#fdepto').selectmenu('refresh', true);
    fdeptoChange();
    $('#fentidad').val(-999);
    $('#fentidad').selectmenu('refresh', true);
    fentidadChange();
    for (var i = 0; i < programas.length; i++) {
        if (programas[i].PREFIJO == "dps"){
            $('#fprograma').val(i);
            $('#fprograma').selectmenu('refresh', true);
        };
    };
    updateDatos();
}

function fdeptoChange() {
    if ($('#fdepto')[0].value == "-999") {
        updateNacional();
        $('#munidiv').hide();
    } else {
        $('#munidiv').show();
        $('#fmunicipio').find('option').remove().end().append('<option value="-999">Consolidado Departamento</option>').val('-999');
        $('#fmunicipio').selectmenu('refresh', true);
        updateDatos();
        updateDepto();
        $.each(municipios, function (index, value) {
            if (value.codigodanedpto == $('#fdepto')[0].value) {
                if ((value.nombremunicipio.indexOf("(DP)")) == -1) {
                    $('#fmunicipio').append($('<option>', { value: value.codigodanempio }).text(value.nombremunicipio));
                };                
            }
        });

    };
}

function fentidadChange() {
    $('#fprograma').find('option').remove().end();
    if ($('#fentidad')[0].value == "-999") {
        for (var i = 0; i < programas.length; i++) {
            $('#fprograma').append($('<option>', { value: i }).text(programas[i].NOMBRE_PROGRAMA));
        };
    } else {
        for (var i = 0; i < programas.length; i++) {
            if (programas[i].ENTIDAD == $('#fentidad')[0].value) {
                $('#fprograma').append($('<option>', { value: i }).text(programas[i].NOMBRE_PROGRAMA));
            };
        };
    };
    $('#fprograma').val(0);
    $('#fprograma').selectmenu('refresh', true);
    updatePrograma();
    updateRuta();
};

function updateNacional() {
    updateDatos();
    gl.clear();

    $.getJSON("./data/mapas/nacional.js", function (results) {
        for (var i = 0; i < results.features.length; i++) {
            results.features[i].geometry = esri.geometry.fromJson(results.features[i].geometry);
        }
        map.setExtent(esri.graphicsExtent(results.features));
        showResultsDepto(results);
        updatePrograma();
    });

};

function updateDepto() {
    gl.clear();

    $.getJSON("./data/mapas/" + $('#fdepto')[0].value + ".js", function (results) {
        for (var i = 0; i < results.features.length; i++) {
            results.features[i].geometry = esri.geometry.fromJson(results.features[i].geometry);
        }
        map.setExtent(esri.graphicsExtent(results.features));
        showResultsMuni(results);
        updatePrograma();
    });

};

function updatePrograma() {
    variableName = programas[parseInt($('#fprograma')[0].value)].PREFIJO.toString();
    $('#nombre_programa').html(programas[parseInt($('#fprograma')[0].value)].NOMBRE_PROGRAMA.toString());
    $('#descripcion_programa').html(programas[parseInt($('#fprograma')[0].value)].DESCRIPCION.toString());
    
    if (cache_data == null) {
        return;
    };
    var foundpos = -1;
    var firstpos = -1;
    var strBotones = "";

    for (var i = 0; i < preffixes.length; i++) {
        try {
            if (cache_data[0][variableName + preffixes[i]] != null) {
                var valid = false;
                for (var j = 0; j < cache_data.length; j++) {
                    if (cache_data[j][variableName + preffixes[i]] > 0){
                        valid = true;
                        if (firstpos == -1) {
                            firstpos = i;
                        };
                        if (cPreffix == i) {
                            foundpos = i;
                        };
                        break;
                    }
                }

                if (valid){
                   strBotones += '<a href="#" id="btn' + i + '" class="boton-grupo" data-role="button" data-inline="true" data-mini="true" onclick="setPreffix(' + i + ')">' + preffixesDesc[i] + '</a>';
                };
            };

        } catch (err) {

        }
    };

    var fpos;
    if (foundpos != -1) {
        fpos = foundpos;
    } else {
        fpos = firstpos;
    };

    if (fpos != -1) {

        prefixName = preffixes[fpos];
        cPreffix = fpos;
        var k;
        for (k = 0; k < mapaColores[cPreffix].length; k++) {
            try {
                $("#cScale" + k).css("background", (new dojo.Color(mapaColores[cPreffix][k])).toHex());
            } catch (err) {
            };
        };
        $('#msgMap').hide();
        $('#msgChart').hide();
    } else {
        $('#msgMap').show();
        $('#msgChart').show();
    };

    $("#botones").html(strBotones);
    $("#btn" + fpos).addClass("ui-btn-active");    
    $('.boton-grupo').button();
    $("#botones").controlgroup('refresh');

    updateNDX(cache_data);
    updateMapaDatos();
    updateReporte();
    if (isPhoneGapExclusive()) {
        window.localStorage.setItem("url", getParams());
    };
}

function updateReporte(){
    tipoReporte = 0;
    $("#tEntidades").show();
    $("#tProgramas").hide();

    var periodoHeader;
    if ($("#ftime").val() == -999){
        periodoHeader = _name_pp_actual;
    } else {
        periodoHeader = $("#ftime option:selected").text().toString().toUpperCase();
    };
    var headerTXT = "<h4>INFORME SECTORIAL PERIODO " + periodoHeader + "<br />";
    if ($('#fdepto')[0].value == "-999") {
        headerTXT = headerTXT + "CONSOLIDADO NACIONAL";
    } else {
        if ($('#fmunicipio')[0].value == "-999") {
            headerTXT = headerTXT + "CONSOLIDADO " + $('#fdepto').find('option:selected').text().toString().toUpperCase();
        } else {
            headerTXT = headerTXT + "DEPARTAMENTO " + $('#fdepto').find('option:selected').text().toString().toUpperCase() + " - MUNICIPIO " + $('#fmunicipio').find('option:selected').text().toString().toUpperCase();
        };
    };
    headerTXT = headerTXT + "</h4>";

    $("#header1").html(headerTXT);
    $("#tablaEntidades > tbody").html("");
    $("#tablaProgramas > tbody").html("");
    
    for (var i=0; i<tentidades.length; i++){
        var resultados = [];
        var programasC = [];

        for (var j=0; j<programas.length; j++){
            if (programas[j].ENTIDAD == tentidades[i]){
                programasC.push(programas[j].PREFIJO);
            };
        }

        for (var k=0; k<preffixes.length; k++){
            var resultadoT = 0;
            for (var j=0; j<cache_data.length; j++){
                if (datoTipo == 0){
                    if (cache_data[j]["anofecha"] != dateName){
                        continue;
                    };
                }
                for (var m = 0; m < programasC.length; m++) {
                    if (cache_data[j][programasC[m] + preffixes[k]] != null){
                        resultadoT = resultadoT + parseFloat(cache_data[j][programasC[m] + preffixes[k]]);
                    }
                };
            };
            resultados.push(resultadoT);
        };

        var str = "<tr><td><a href='#' onclick='updateReporteDetalle(" + i + ");'>" + tentidades[i] + "</a></td>";
        for (var j=0; j<resultados.length; j++){
            str = str + "<td style='text-align: right;'>" + numberWithCommas(resultados[j]) + "</td>"
        }
        str = str + "</tr>";

        $("#tablaEntidades > tbody:last").append(str);
    };
    $("#tablaEntidades").table( "refresh" );

};

function updateReporteDetalle(pos){
    $("#tEntidades").hide();
    $("#tProgramas").show();

    var periodoHeader;
    if ($("#ftime").val() == -999){
        periodoHeader = _name_pp_actual;
    } else {
        periodoHeader = $("#ftime option:selected").text().toString().toUpperCase();
    };
    var headerTXT = "<h4>INFORME " + tentidades[pos].toString().toUpperCase() + " PERIODO " + periodoHeader + "<br />";
    if ($('#fdepto')[0].value == "-999") {
        headerTXT = headerTXT + "CONSOLIDADO NACIONAL";
    } else {
        if ($('#fmunicipio')[0].value == "-999") {
            headerTXT = headerTXT + "CONSOLIDADO " + $('#fdepto').find('option:selected').text().toString().toUpperCase();
        } else {
            headerTXT = headerTXT + "DEPARTAMENTO " + $('#fdepto').find('option:selected').text().toString().toUpperCase() + " - MUNICIPIO " + $('#fmunicipio').find('option:selected').text().toString().toUpperCase();
        };
    };
    headerTXT = headerTXT + "</h4>";

    $("#header2").html(headerTXT);

    $("#tablaEntidades:visible > tbody").html("");
    $("#tablaProgramas:visible > tbody").html("");

    for (var i = 0; i < programas.length; i++) {
        if (programas[i].ENTIDAD != tentidades[pos]) {
            continue;
        };
        var resultados = [];
        var sumaPrograma = 0;
        for (var k = 0; k < preffixes.length; k++) {
            var resultadoT = 0;
            for (var j = 0; j < cache_data.length; j++) {
                if (datoTipo == 0) {
                    if (cache_data[j]["anofecha"] != dateName) {
                        continue;
                    };
                }
                if (cache_data[j][programas[i].PREFIJO + preffixes[k]] != null) {
                    resultadoT = resultadoT + parseFloat(cache_data[j][programas[i].PREFIJO + preffixes[k]]);
                }

            };
            sumaPrograma += resultadoT;
            resultados.push(resultadoT);
        };
        if (sumaPrograma > 0){
            var str = "<tr><td>" + programas[i].NOMBRE_PROGRAMA + "</td>";
            for (var j = 0; j < resultados.length; j++) {
                str = str + "<td style='text-align: right;'>" + numberWithCommas(resultados[j]) + "</td>"
            }
            str = str + "</tr>";
            $("#tablaProgramas > tbody:last").append(str);
        };
        
    };
    $("#tablaProgramas").table("refresh");

};

function updateMapaDatos() {
    if (gl == null) {
        return;
    };
    if (gl.graphics.length == 0) {
        return;
    }
    var minL2 = 0;
    maxL2 = 0;

    if (gl.graphics[0].attributes["COD_DPTO"] != null) {
        // Mapas Deptos
        if ((datoTipo == 0 ? cache_data_deptos_anual : cache_data_deptos_pp) == null){
            validar((datoTipo == 0 ? "cache_data_deptos_anual" : "cache_data_deptos_pp"));
        };
        var data_dpto = (datoTipo == 0 ? cache_data_deptos_anual : cache_data_deptos_pp);
        if (data_dpto == null) {
            return;
        };
        for (var j = 0; j < data_dpto.length; j++) {
            if (data_dpto[j][variableName + prefixName] != null) {
                maxL2 = Math.max(maxL2, parseInt(data_dpto[j][variableName + prefixName]));
            };
        };

        for (var i = 0; i < gl.graphics.length; i++) {
            var match = false;
            for (var j = 0; j < data_dpto.length; j++) {
                if ((gl.graphics[i].attributes.COD_DPTO == data_dpto[j].dane)
                    &&
                    ((datoTipo == 0 ? dateName == data_dpto[j]["anofecha"] : true))) {
                    var cresultado;
                    if (maxL2 == 0){
                        cresultado = { r: 0, g: 0, b: 0, a: 0 };
                    } else {
                        if (parseInt(data_dpto[j][variableName + prefixName]) == 0){
                            cresultado = { r: 0, g: 0, b: 0, a: 0 };
                        } else {
                            cresultado = mapaColores[cPreffix][parseInt(Math.min((parseInt(data_dpto[j][variableName + prefixName]) / maxL2) * 5, 4))];
                        }
                    }
	
                    gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                                       cresultado));
                    match = true;
                    break;
                };
            };
            if (!match) {
                gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                  new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                   new dojo.Color({ r: 0, g: 0, b: 0, a: 0 })));
            };
        };
    } else {
        // Mapas Municipios        
        if ((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp) == null){
            validar((datoTipo == 0 ? "cache_data_muni_anual" : "cache_data_muni_pp"));
        };
        var data_muni = (datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp);
        if (data_muni == null) {
            return;
        };
        for (var i = 0; i < gl.graphics.length; i++) {
            for (var j = 0; j < data_muni.length; j++) {
                if ((gl.graphics[i].attributes["COD_DANE"].toString() == data_muni[j].dane) &&
                    (datoTipo == 0 ? (dateName == data_muni[j]["anofecha"]) : true)) {
                    if (data_muni[j][variableName + prefixName] != null) {
                        maxL2 = Math.max(maxL2, parseInt(data_muni[j][variableName + prefixName]));
                    }
                    break;
                }
            }
        };
        for (var i = 0; i < gl.graphics.length; i++) {
            var match = false;
            for (var j = 0; j < data_muni.length; j++) {
                if ((gl.graphics[i].attributes["COD_DANE"].toString() == data_muni[j].dane) &&
                    (datoTipo == 0 ? (dateName == data_muni[j]["anofecha"]) : true)) {
                    var cresultado;
                    if (maxL2 == 0) {
                        cresultado = { r: 0, g: 0, b: 0, a: 0 };
                    } else {
                        if (parseInt(data_muni[j][variableName + prefixName]) == 0) {
                            cresultado = { r: 0, g: 0, b: 0, a: 0 };
                        } else {
                            cresultado = mapaColores[cPreffix][parseInt(Math.min((parseInt(data_muni[j][variableName + prefixName]) / maxL2)*5, 4))];
                        }
                    }
                    gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                                       cresultado));
                    match = true;
                    break;
                };
            };
            if (!match) {
                gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                  new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                   new dojo.Color({ r: 0, g: 0, b: 0, a: 0 })));
            };
        };
    };

};

function validar(txt) {
    $('#msgTXT2').html('Cargando datos, por favor, espere.');
    $('#msg2').popup('open');
    if (isPhoneGap()) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fs) {
            fs.root.getDirectory("data", { create: false, exclusive: false },
                function (dirEntry) {
                    var fname;
                    switch (txt){
                        case "cache_data_nacional_anual":
                            fname = _data_nacional_anual;
                            break;
                        case "cache_data_nacional_pp":
                            fname = _data_nacional_pp;
                            break;
                        case "cache_data_deptos_anual":
                            fname = _data_deptos_anual;
                            break;
                        case "cache_data_deptos_pp":
                            fname = _data_deptos_pp;
                            break;
                        case "cache_data_muni_anual":
                            fname = _data_muni_anual;
                            break;
                        case "cache_data_muni_pp":
                            fname = _data_muni_pp;
                            break;
                    };
                    fname = fname.replace("./data/json/", "");
                    dirEntry.getFile(fname, { create: false, exclusive: false },
                         function (fileEntry) {
                             fileEntry.file(function (f) {
                                 var reader = new FileReader();
                                 reader.onloadend = function (evt) {
                                     try {
                                         switch (txt) {
                                             case "cache_data_nacional_anual":
                                                 cache_data_nacional_anual = $.parseJSON(evt.target.result).d;                                                 
                                                 break;
                                             case "cache_data_nacional_pp":
                                                 cache_data_nacional_pp = $.parseJSON(evt.target.result).d;
                                                 break;
                                             case "cache_data_deptos_anual":
                                                 cache_data_deptos_anual = $.parseJSON(evt.target.result).d;
                                                 break;
                                             case "cache_data_deptos_pp":
                                                 cache_data_deptos_pp = $.parseJSON(evt.target.result).d;
                                                 break;
                                             case "cache_data_muni_anual":
                                                 cache_data_muni_anual = $.parseJSON(evt.target.result).d;
                                                 break;
                                             case "cache_data_muni_pp":
                                                 cache_data_muni_pp = $.parseJSON(evt.target.result).d;
                                                 break;
                                         };
                                         $('#msg2').popup('close');
                                         updateDatos();
                                     } catch (err) {
                                         cargarLocal(txt);
                                     };

                                 };
                                 reader.onerror = function (e) {
                                     cargarLocal(txt);
                                 };
                                 reader.readAsText(f);
                             }, function () {
                                 cargarLocal(txt);
                             });
                         },
                         function () {
                             cargarLocal(txt);
                         });
                }, function () {
                    cargarLocal(txt);
                });
        }, function () {
            cargarLocal(txt);
        });
    } else {
        cargarLocal(txt);
    };
};

function cargarLocal(txt) {
    switch (txt){
        case "cache_data_nacional_anual":
           $.ajax({
                url: _data_nacional_anual,
                type: 'GET',
                async: false,
                dataType: 'json',
                success: function (data) {
                    cache_data_nacional_anual = data.d;
                    $('#msg2').popup('close');
                }
            });
        break;
        case "cache_data_nacional_pp":
            $.ajax({
                url: _data_nacional_pp,
                type: 'GET',
                async: false,
                dataType: 'json',
                success: function (data) {
                    cache_data_nacional_pp = data.d;
                    $('#msg2').popup('close');
                }
            });
        break;
        case "cache_data_deptos_anual":
            $.ajax({
                    url: _data_deptos_anual,
                    type: 'GET',
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        cache_data_deptos_anual = data.d;
                        $('#msg2').popup('close');
                    }
                });
        break;
        case "cache_data_deptos_pp":
                $.ajax({
                    url: _data_deptos_pp,
                    type: 'GET',
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        cache_data_deptos_pp = data.d;
                        $('#msg2').popup('close');
                    }
                });
        break;
        case "cache_data_muni_anual":
            $.ajax({
                    url: _data_muni_anual,
                    type: 'GET',
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        cache_data_muni_anual = data.d;  
                        $('#msg2').popup('close');
                    }
            });
        break;
        case "cache_data_muni_pp":
            $.ajax({
                    url: _data_muni_pp,
                    type: 'GET',
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        cache_data_muni_pp = data.d;
                        $('#msg2').popup('close');
                    }
            });
        break;
    };
  
}

function updateDatos() {
    if ($('#fdepto')[0].value == "-999") {
        // Consolidado Nacional
        $("#load_icon").show();
        $("#mainChart").hide();
        if ((datoTipo == 0 ? cache_data_nacional_anual : cache_data_nacional_pp) == null){
            validar((datoTipo == 0 ? "cache_data_nacional_anual" : "cache_data_nacional_pp"));
        };
        cache_data = (datoTipo == 0 ? cache_data_nacional_anual : cache_data_nacional_pp);
        if (cache_data == null) {
            return;
        };
        $("#load_icon").hide();
        $("#mainChart").show();
        updatePrograma();
    } else {
        if ($('#fmunicipio')[0].value == "-999") {
            // Consolidado Departamental
            var deptoNombre;
            var daneImportar;
            deptoNombre = $('#fdepto').find('option:selected').text().toString().toUpperCase();
            daneImportar = $('#fdepto').find('option:selected').val();
            deptoNombre = deptoNombre.replace("Á", "%").replace("É", "%").replace("Í", "%").replace("Ó", "%").replace("Ú", "%");
            $("#load_icon").show();
            $("#mainChart").hide();
            cache_data = [];
            if ((datoTipo == 0 ? cache_data_deptos_anual : cache_data_deptos_pp) == null){
                validar((datoTipo == 0 ? "cache_data_deptos_anual" : "cache_data_deptos_pp"));
            };
            $.each((datoTipo == 0 ? cache_data_deptos_anual : cache_data_deptos_pp), function (index, value) {
               if (value.dane == daneImportar) {
                cache_data.push(value);
               };
            });
            $("#load_icon").hide();
            $("#mainChart").show();
            updatePrograma();
        } else {
            // Consolidado Municipio
            var muniNombre;
            var daneImportar;
            muniNombre = $('#fmunicipio').find('option:selected').text().toString().toUpperCase();
            muniNombre = muniNombre.replace("Á", "%").replace("É", "%").replace("Í", "%").replace("Ó", "%").replace("Ú", "%");
            daneImportar = $('#fmunicipio').find('option:selected').val();
            $("#load_icon").show();
            $("#mainChart").hide();
            cache_data = [];
            if ((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp) == null) {
                validar((datoTipo == 0 ? "cache_data_muni_anual" : "cache_data_muni_pp"));
            };
            $.each((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp), function (index, value) {
                if (value.dane == daneImportar) {
                    cache_data.push(value);
                };
            });
            $("#load_icon").hide();
            $("#mainChart").show();
            updatePrograma();
        };
    };
    updateRuta();
};

function updateRuta() {
    if (cache_data == null) {
        return;
    };
    if (cache_data.length > 0){
        $("#actualizacion1, #actualizacion2, #actualizacion3, #actualizacion4").html("Fecha de corte: " + cache_data[0].mescarga + "/" + cache_data[0].anocarga + "&nbsp;");
        $("#actualizacion5").html(cache_data[0].mescarga + "/" + cache_data[0].anocarga + "&nbsp;");
    };
    if (currentView == 3){
        if ($('#fdepto')[0].value == "-999") {
            $("#ruta").html("Consolidado Nacional");
            
    } else {
	    if ($('#fmunicipio')[0].value == "-999") {
    		$("#ruta").html("Consolidado " + $('#fdepto').find('option:selected').text().toString());
	    } else {
    		$("#ruta").html("Municipio " + $('#fmunicipio').find('option:selected').text().toString());
	    };
    };
    } else {
        if ($('#fdepto')[0].value == "-999") {
            $("#ruta").html("Consolidado Nacional - Programa: " + $('#fprograma').find('option:selected').text().toString());
        } else {
	        if ($('#fmunicipio')[0].value == "-999") {
    		    $("#ruta").html("Consolidado " + $('#fdepto').find('option:selected').text().toString() + " - Programa: " + $('#fprograma').find('option:selected').text().toString());
	        } else {
    		    $("#ruta").html("Municipio " + $('#fmunicipio').find('option:selected').text().toString() + " - Programa: " + $('#fprograma').find('option:selected').text().toString());
	        };
        };
    };
};

function setPreffix(pos) {
    cPreffix = pos;
    for (var j=0; j<mapaColores[cPreffix].length; j++){
        $("#cScale" + j).css("background", (new dojo.Color(mapaColores[cPreffix][j])).toHex());
    }
    prefixName = preffixes[pos];
    updateNDX(cache_data);
    for (var i = 0; i < preffixes.length; i++) {
        $('#btn' + i).removeClass('ui-btn-active');
    };
    $('#btn' + pos).addClass('ui-btn-active');
    updatePrograma();
};

function updateNDX(data) {
    if (data == null) {
        return;
    };

    ndx = crossfilter(data);
    all = ndx.groupAll();

    dateDimension = ndx.dimension(function (d) {
        if (datoTipo == 0) {
            return parseInt(d["anofecha"]);
        } else {
            return 1;
        };
        
    });
    var sizeArray = dateDimension.group().orderNatural().all();

    var minL = 0;
    var maxL = 0;
    if (sizeArray.length > 0) {
        minL = sizeArray[0].key;
        maxL = sizeArray[sizeArray.length - 1].key;
    }

    datoGroup = dateDimension.group().reduce(
        function (p, v) {
            p.dato = p.dato + parseInt(v[variableName + prefixName]);
            return p;
        },
        function (p, v) {
            p.dato = p.dato - parseInt(v[variableName + prefixName]);
            return p;
        },
        function () {
            return {
                dato: 0
            };
        }
    );

    dc.barChart("#mainChart")
        .width($("#lista").width()-10)
        .height($("#lista").height())
        .margins({ top: 30, right: 10, bottom: 30, left: 75 })
        .dimension(dateDimension)
        .group(datoGroup)
        .valueAccessor(function (d) {
            return d.value.dato;
        })
        .colors(['red', '#0071BC'])
        .colorAccessor(function (d, i) {
            if (datoTipo == 0) {
                if (d.data.key == dateName){
                    return 0;
                } else {
                    return 1;
                };
            } else {
                return 1;
            };
        })
        .x(d3.scale.linear().domain((datoTipo == 0 ? [minL-0.5, maxL+0.5] : [minL-1, maxL+1])))
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .centerBar(true)
        .brushOn(false)
        .title(function (d) {
            return d.x + ": " + d.y;
        })
        .yAxisLabel(preffixesDescValor[cPreffix])
        .on("postRender", function (chart) {
            chart.selectAll("rect.bar").each(function(d, i) { 
                   
                var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text2.setAttribute("x", parseInt(this.getAttribute("x"))+parseInt(this.getAttribute("width"))/2);
                text2.setAttribute("y", parseInt(this.getAttribute("y"))+parseInt(this.getAttribute("height"))/2);
                text2.setAttribute("style", "text-anchor: middle;");
                text2.setAttribute("fill", "white");
                var textContent = document.createTextNode(d3.format(".2s")(d.y));
                text2.appendChild(textContent);
                this.parentNode.appendChild(text2, this);
               
            });            
        })
        .xAxis().ticks(5)
        .tickFormat(function (d, i) {
            if (datoTipo == 0) {
                return d3.format("d")(d);
            } else {
                if (d == 1) {
                    return "Periodo Presidencial";
                } else {
                    return "";
                };
            }
        });

    dc.renderAll();
}

function numberWithCommas(x) {
    var parts = x.toFixed(1).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",").replace(",00", "");
}

function updateSize() {
    var the_height = window.innerHeight - $("#header").height() - $("#footer").height();
    $("#lista").height(the_height);
    $("#reporte").height(the_height);
    $("#mapExt").height(the_height);
    $("#map").height(the_height);
    if (map) {
        map.reposition();
        map.resize();
    };
    updatePrograma();
};

function setView(id) {
    currentView = id;
    updateRuta();
    switch (id) {
        case 1:
            $("#lista").hide();
            $("#reporte").hide();
            $('#tablaEntidades-popup').popup('close');
            $("#botones").show();
            $("#mapExt").css("right", "0px");
            break;
        case 2:
            $("#reporte").hide();
            $('#tablaEntidades-popup').popup('close');
            $("#mapExt").css("right", "20000px");
            $("#botones").show();
            $("#lista").show();
            break;
        case 3:
            $("#mapExt").css("right", "20000px");
            $("#lista").hide();
            $("#botones").hide();
            $("#reporte").show();
            break;
    };
    updateSize();
}

function abrirShare() {
    if (isPhoneGap()) {
        if (((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE))) {
            $('#msgTXT').html('Esta funcionalidad requiere acceso a internet. Por favor, verifique su conexión e intente de nuevamente.');
            $('#msg').popup('open');
            return;
        };
        share(3);
    } else {
        $('#share').popup('open');
    };
    
}

function share(id) {
    var _url_params = getParams();
    switch (id) {
        case 3:
            window.plugins.socialsharing.share('CifrasDPS: ' + _url + '?pos=' + _url_params);
            break;
        case 'facebook':
            window.open(encodeURI('http://www.facebook.com/sharer.php?t=' + _msg_share_fb + '&u=' + _url + '?pos=' + _url_params), '_blank', '');
            break;
        case 'twitter':
            window.open(encodeURI('https://twitter.com/intent/tweet?text=' + _msg_share_tw + '&url=' + _url + '?pos=' + _url_params), '_blank', '');
            break;
    }
}

function getParams() {
    return currentView + 'A' + $("#fdepto").val() + "A" + $("#fmunicipio").val() + "A" + $("#fentidad").val() + "A" + $("#fprograma").val() + "A" + $("#ftime").val() + "A" + datoTipo + "A" + cPreffix;
}

function mapLoadHandler(map) {
    map.disableDoubleClickZoom();
    map.infoWindow.resize(150, 100);
    loaded = true;
    
    if (params != null) {
        if ($('#fdepto')[0].value == "-999") {
            updateNacional();
        } else {
            updateDatos();
            updateDepto();
        };
        updateSize();
    } else {
        currentPoint = new esri.geometry.Point(pLng, pLat, map.spatialReference);
        updateNacional();
    };    
    map.centerAndZoom(currentPoint, 5);
    
}

function zoomToLocation(position) {
    pLat = position.coords.latitude;
    pLng = position.coords.longitude;

    try {
        currentPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, map.spatialReference);
        map.centerAndZoom(currentPoint, 5);
    } catch (ex) {

    }
};

function orientationChanged() {
    if (map) {
        map.reposition();
        map.resize();
    }
}

function showResultsDepto(results) {
    for (var i = 0, il = results.features.length; i < il; i++) {
        var value = "";
        var title = "";
        var content = "";

        try {
            value = results.features[i].attributes["COD_DPTO"];
            title = results.features[i].attributes["NOMBRE"];
        } catch (e) {
            
        };
        content = "<a href='#' onclick='analizarDepto(\"" + value + "\");' style=''>Seleccionar</a>"; //<br /><a href='#' onclick='cerrarPopup();' style=''>Cerrar</a>";

        popcontent = new esri.InfoTemplate(title, content);
        try {
            gl.add(new esri.Graphic(results.features[i].geometry,
                                        new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 0, g: 0, b: 0, a: 0 })),
                                        results.features[i].attributes,
                                        popcontent
                        ));
            
        } catch (err) {
            
        }


    }

}

function showResultsMuni(results) {
    for (var i = 0, il = results.features.length; i < il; i++) {
        var value = "";
        var content = "";
        var title = "";

        try {
            value = results.features[i].attributes["COD_DANE"];
            title = results.features[i].attributes["NOMBRE"];
        } catch (e) {

        };
        content = "<a href='#' onclick='analizarMuni(\"" + value + "\");' style=''>Seleccionar</a>"; //<br /><a href='#' onclick='cerrarPopup();' style=''>Cerrar</a>";

        popcontent = new esri.InfoTemplate(title, content);
        try {
            gl.add(new esri.Graphic(results.features[i].geometry,
                                        new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 0, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 0, g: 0, b: 0, a: 0 })),
                                        results.features[i].attributes,
                                        popcontent
                        ));

        } catch (err) {
            
        }


    }

}

function analizarDepto(codigo) {
    gl.clear();
    cerrarPopup();
    $("#fdepto").val(codigo);
    $('#fdepto').selectmenu('refresh', true);
    fdeptoChange();
}

function analizarMuni(codigo) {
    $("#fmunicipio").val(codigo);
    $('#fmunicipio').selectmenu('refresh', true);
    for (var i = 0; i < gl.graphics.length; i++) {
        if (gl.graphics[i].attributes["COD_DANE"].toString() == $('#fmunicipio').find('option:selected').val()){
            map.setExtent(esri.graphicsExtent([gl.graphics[i]]));
            break;
        };
    };
    cerrarPopup();
    updateDatos();
}

function cerrarPopup() {
    popup.hide();
};

function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function getUrlVars() {
    var vars = [], hash;
    var hashes;

    if ($.mobile.activePage.data('url').indexOf("?") != -1) {
        hashes = $.mobile.activePage.data('url').slice($.mobile.activePage.data('url').indexOf('?') + 1).split('&');
    } else {
        hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    }

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');

        if (hash[0] == "pos") {
            hash[1] = hash[1].replace("#", "");
        }

        if (hash.length > 1 && hash[1].indexOf("#") == -1) {
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }

    return vars;
}

function isPhoneGapExclusive() {
    try {
        return (cordova || PhoneGap || phonegap);
    } catch (err) {
        return false;
    }
}

function isPhoneGap() {
    try {
        return (cordova || PhoneGap || phonegap)
        && /^file:\/{3}[^\/]/i.test(window.location.href)
        && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    } catch (err) {
        return false;
    }
}

function abrirEncuesta(){
    window.open(_url_encuesta, '_blank', 'EnableViewPortScale=yes');
}

function abrirDPS() {
    window.open(_url_dps, '_blank', 'EnableViewPortScale=yes');
}

function abrirTweet(id){
    window.open('http://www.twitter.com/DPSColombia/status/' + id, '_blank', '');
}

function abrirActualizar() {
    if (isPhoneGap()) {
        if (((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE))) {
            $('#msgTXT').html('Esta funcionalidad requiere acceso a internet. Por favor, verifique su conexión e intente de nuevamente.');
            $('#msg').popup('open');
            return;
        };
    };
    $('#update').popup('open');
    $.ajax({
        url: _data_web[1][1],
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (data) {
            $("#actualizacion6").html(data.d[0].mescarga + "/" + data.d[0].anocarga + "&nbsp;");
        }
    });
    
};

function actualizar() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fs) {
            fs.root.getDirectory( "data", { create: true, exclusive: false }, 
                function (dirEntry) {
                    transfer(0, dirEntry);
                }, function () {
                    $("#actualizacion7").html("Error descargando archivos. Intente nuevamente m&aacute;s tarde.");
                });
            
        },
        function () {
            $("#actualizacion7").html("Error descargando archivos. Intente nuevamente m&aacute;s tarde.");
        });
};

function transfer(pos, folderDir){
    if (pos == _data_web.length) {
        $("#actualizacion7").html("Actualizaci&aacute;n completa: " + pos + " de " + _data_web.length + " archivos descargados");
        cache_data_nacional_anual = null;
        cache_data_nacional_pp = null;
        cache_data_deptos_anual = null;
        cache_data_deptos_pp = null;
        cache_data_muni_anual = null;
        cache_data_muni_pp = null;
        updateDatos();
        return;
    };

    folderDir.getFile(_data_web[pos][0], { create: true, exclusive: false },
    function (fileEntry) {
 
        $("#actualizacion7").html("Descargando archivo " + (pos + 1) + " de " + _data_web.length);
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(_data_web[pos][1]);

        fileTransfer.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var valProg = (progressEvent.loaded / progressEvent.total);
                if (valProg > 1) {
                    valProg = 1;
                };
                $("#actualizacion7").html("Descargando archivo " + (pos + 1) + " de " + _data_web.length + "(" + parseInt(valProg * 100) + "%)");
            };
        };

        fileTransfer.download(uri, fileEntry.fullPath,
            function (entry) {
                transfer(pos + 1, folderDir);
            },
            function (error) {
                $("#actualizacion7").html("Error descargando archivos. Intente nuevamente m&aacute;s tarde.");
            },
            false);


    }, function () {
        $("#actualizacion7").html("Error descargando archivos. Intente nuevamente m&aacute;s tarde.");
    });

};
