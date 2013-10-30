/// <reference path="data/json/datamunicipalanual.js" />
/// <reference path="data/json/datamunicipalanual.js" />
/*

PARAMETROS CONFIGURABLES

*/
// Ubicación de la versión web de la aplicación
var _url = 'http://dps.azurewebsites.net/';
// Mensaje que aparece en la opcion compartir desde redes sociales
var _msg_share_tw = '@DPSColombia Información DPS';
var _msg_share_fb = 'Información DPS';

// Ubicación de la versión web de la aplicación
var _map_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer';

var _data_nacional_anual_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalanual/?$format=json&$orderby=anofecha';
var _data_nacional_anual = './data/json/metadatanacionalanual.js';
var _data_nacional_pp_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalpp/?$format=json';
var _data_nacional_pp = './data/json/metadatanacionalpp.js';

var _data_deptos_anual_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptoanual/?$format=json&$orderby=anofecha&$filter=nombredepartamento%20like%20';
var _data_deptos_anual = './data/json/datadptoanual.js';
var _data_deptos_pp_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptopp/?$format=json&$filter=depto%20like%20';
var _data_deptos_pp = './data/json/datadptopp.js';

var _data_muni_anual_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalanual?$format=json&$orderby=anofecha&$filter=nombremunicipio%20like%20';
var _data_muni_anual = './data/json/datamunicipalanual.js';
var _data_muni_pp_web = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalpp?$format=json&$filter=nombremunicipio%20like%20';
var _data_muni_pp = './data/json/datamunicipalpp.js';

var cache_data;
var cache_data_nacional_anual;
var cache_data_nacional_pp;
var cache_data_deptos_anual;
var cache_data_deptos_pp;
var cache_data_muni_anual;
var cache_data_muni_pp;

// Variables de los programas y sus respectivos prefijos
var programas = [];
var preffixes = ["fam", "per", "inv", "pro", "has"];
var preffixesDesc = ["Familias", "Personas", "Inversi&oacute;n", "Proyectos", "Hectareas"];

// Variable de los municipios (DIVIPOLA)
var municipios = [];

var map;
var loaded = false;
var gl;
var popup;
var popcontent;
var headerGeom;

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
var dateNameT = '2012';

var datoTipo = 1;
var tipoReporte = 0;

var tentidades = [];

function init() {    
    
    $.ajax({
        url: "./data/DIVIPOLA.csv",
        type: 'GET',
        async: false,
        success: function (data) {
            municipios = $.csv.toObjects(data);
        }
    });

    $.ajax({
        url: "./data/Maestro_Programas.csv",
        type: 'GET',
        async: false,
        success: function (data) {
            programas = $.csv.toObjects(data);
            for (var i = 0; i < programas.length; i++) {
                if ($.inArray(programas[i].ENTIDAD, tentidades) == -1) {
                    tentidades.push(programas[i].ENTIDAD);
                };
                programas[i].PREFIJO = programas[i].PREFIJO.toString().replace("_", "").toLowerCase();
                $('#fprograma').append($('<option>', { value: i }).text(programas[i].NOMBRE_PROGRAMA));
            };
            for (var i = 0; i < tentidades.length; i++) {
                $('#fentidad').append($('<option>', { value: tentidades[i] }).text(tentidades[i]));
            };
            $('#fprograma').val(0);
            $('#fprograma').selectmenu('refresh', true);
        }
    });


    if (isPhoneGapExclusive()) {
        document.addEventListener("backbutton", function () {
            if ($(".ui-page-active .ui-popup-active").length > 0) {
                $('#reportar').popup('close');
                $('#share').popup('close');
                $('#acerca').popup('close');
                $('#tutorial').popup('close');
                $('#msg').popup('close');
                $('#msg2').popup('close');
                $('#popupGeneral').popup('close');
            } else {
                navigator.app.exitApp();
            };
        }, true);
    }

    /*
    if (getUrlVars()["pos"] == null) {
        $('#popupGeneral').popup('open');
    };
    */

    popup = new esri.dijit.InfoWindowLite(null, dojo.create("div"));
    popup.startup();
    
    $('#fchart').change(function () {
        dateName = parseInt($("#fchart").val());
        updateMapaDatos();
    });

    $('#ftable').change(function () {
        dateNameT = parseInt($("#ftable").val());
        updateReporte();
    });

    $('#fdepto').change(function () {
        fdeptoChange();
    });

    $('#fmunicipio').change(function () {
        updateDatos();
        updateDepto();
    });

    $('#fentidad').change(function () {
        fentidadChange();
    });

    $('#fprograma').change(function () {
        updatePrograma();
    });

    if (isPhoneGap()) {
        map = new esri.Map("map", {
            zoom: 5,
            minZoom: 3,
            maxZoom: 9,
            infoWindow: popup,
            autoresize: false
        });
    } else {
        map = new esri.Map("map", {
            zoom: 5,
            minZoom: 3,
            maxZoom: 9,
            nav: true,
            infoWindow: popup,
            autoresize: false
        });        
    };
    dojo.connect(map, "onLoad", mapLoadHandler);

    if (isPhoneGap()) {
        if (((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE))) {
            map.addLayer(new esri.layers.GraphicsLayer());
        } else {
            var streetMapLayer = new esri.layers.ArcGISTiledMapServiceLayer(_map_url);
            map.addLayer(streetMapLayer);
        };
    } else {
        var streetMapLayer = new esri.layers.ArcGISTiledMapServiceLayer(_map_url);
        map.addLayer(streetMapLayer);        
    };
    updateSize();
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
            if (value.COD_DEPTO == $('#fdepto')[0].value) {
                $('#fmunicipio').append($('<option>', { value: value.COD_MUNI }).text(value.NOMBRE));
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
        updateMapaDatos();
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
        updateMapaDatos();
    });

};

function updatePrograma() {
    variableName = programas[parseInt($('#fprograma')[0].value)].PREFIJO.toString();
    if (cache_data == null) {
        return;
    };
    var first = true;
    var strBotones = "";
    for (var i = 0; i < preffixes.length; i++) {
        try {
            if (cache_data[0][variableName + preffixes[i]] != null) {
                if (first) {
                    strBotones += '<a href="#" id="btn' + i + '" class="ui-btn-active" data-role="button" data-inline="true" data-mini="true" onclick="setPreffix(' + i + ')">' + preffixesDesc[i] + '</a>';
                    first = false;
                    prefixName = preffixes[i];
                } else {
                    strBotones += '<a href="#" id="btn' + i + '" data-role="button" data-inline="true" data-mini="true" onclick="setPreffix(' + i + ')">' + preffixesDesc[i] + '</a>';
                };
            };

        } catch (err) {

        }
    };
    $("#botones").html(strBotones);
    for (var i = 0; i < preffixes.length; i++) {
        $('#btn' + i).button();
    };

    updateNDX(cache_data);
    var sizeArray = dateDimension.group().orderNatural().all();
    if (sizeArray.length > 0) {
        $('#fchart').find('option').remove().end();
        for (var i = 0; i < sizeArray.length; i++) {
            $('#fchart').append($('<option>', { value: sizeArray[i].key })
                 .text(sizeArray[i].key));
        };
        dateName = sizeArray[sizeArray.length - 1].key;
        $('#fchart').val(dateName);
        $('#fchart').selectmenu('refresh', true);

        $('#ftable').find('option').remove().end();
        for (var i = 0; i < sizeArray.length; i++) {
            $('#ftable').append($('<option>', { value: sizeArray[i].key })
                 .text(sizeArray[i].key));
        };
        dateNameT = sizeArray[sizeArray.length - 1].key;
        $('#ftable').val(dateName);
        $('#ftable').selectmenu('refresh', true);
    }
    updateMapaDatos();
    updateReporte();
}

function updateReporte(){
    tipoReporte = 0;
    $("#tEntidades").show();
    $("#tProgramas").hide();
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
                    if (cache_data[j]["anofecha"] != dateNameT){
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
            str = str + "<td>" + resultados[j] + "</td>"
        }
        str = str + "</tr>";

        $("#tablaEntidades > tbody:last").append(str);
    };
    $("#tablaEntidades").table( "refresh" );

};

function updateReporteDetalle(pos){
    $("#tEntidades").hide();
    $("#tProgramas").show();
    $("#tablaEntidades:visible > tbody").html("");
    $("#tablaProgramas:visible > tbody").html("");

    for (var i = 0; i < programas.length; i++) {
        if (programas[i].ENTIDAD != tentidades[pos]) {
            continue;
        };
        var resultados = [];

        for (var k = 0; k < preffixes.length; k++) {
            var resultadoT = 0;
            for (var j = 0; j < cache_data.length; j++) {
                if (datoTipo == 0) {
                    if (cache_data[j]["anofecha"] != dateNameT) {
                        continue;
                    };
                }
                if (cache_data[j][programas[i].PREFIJO + preffixes[k]] != null) {
                    resultadoT = resultadoT + parseFloat(cache_data[j][programas[i].PREFIJO + preffixes[k]]);
                }

            };
            resultados.push(resultadoT);
        };

        var str = "<tr><td>" + programas[i].NOMBRE_PROGRAMA + "</td>";
        for (var j = 0; j < resultados.length; j++) {
            str = str + "<td>" + resultados[j] + "</td>"
        }
        str = str + "</tr>";

        $("#tablaProgramas > tbody:last").append(str);
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
        for (var j = 0; j < data_dpto.length; j++) {
            if (data_dpto[j][variableName + prefixName] != null) {
                maxL2 = Math.max(maxL2, parseInt(data_dpto[j][variableName + prefixName]));
            };
        };

        for (var i = 0; i < gl.graphics.length; i++) {
            var match = false;
            for (var j = 0; j < data_dpto.length; j++) {
                if (
                    (datoTipo == 0 ?
                        (gl.graphics[i].attributes["NOM_DPTO"].toString().toUpperCase() == data_dpto[j]["nombredepartamento"].replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U").replace("Ñ", "N")) :
                        (gl.graphics[i].attributes["NOM_DPTO"].toString().toUpperCase() == data_dpto[j]["depto"].replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U").replace("Ñ", "N"))
                    )
                    &&
                    ((datoTipo == 0 ? dateName == data_dpto[j]["anofecha"] : true))) {
                    var resultado;
                    if (maxL2 == 0){
                        resultado = 0;
                    } else {
                        if (parseInt(data_dpto[j][variableName + prefixName]) == 0){
                            resultado = 0;
                        } else {
                            resultado = Math.max(parseInt(data_dpto[j][variableName + prefixName]) / maxL2, 0.15);
                        }
                    }
                    gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 255, g: 0, b: 0, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 255, g: 0, b: 0, a: resultado })));
                    match = true;
                    break;
                };
            };
            if (!match) {
                gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                  new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 255, g: 0, b: 0, a: 0.45 }), 2),
                                                   new dojo.Color({ r: 255, g: 0, b: 0, a: 0 })));
            };
        };
    } else {
        // Mapas Municipios        
        if ((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp) == null){
            validar((datoTipo == 0 ? "cache_data_muni_anual" : "cache_data_muni_pp"));
        };
        var data_muni = (datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp);
        for (var i = 0; i < gl.graphics.length; i++) {
            for (var j = 0; j < data_muni.length; j++) {
                if ((gl.graphics[i].attributes["COD_MPIO"].toString() == data_muni[j]["daneimportar"].trim()) &&
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
                if ((gl.graphics[i].attributes["COD_MPIO"].toString() == data_muni[j]["daneimportar"].trim()) &&
                    (datoTipo == 0 ? (dateName == data_muni[j]["anofecha"]) : true)) {
                    var resultado;
                    if (maxL2 == 0) {
                        resultado = 0;
                    } else {
                        if (parseInt(data_muni[j][variableName + prefixName]) == 0) {
                            resultado = 0;
                        } else {
                            resultado = Math.max(parseInt(data_muni[j][variableName + prefixName]) / maxL2, 0.15);
                        }
                    }
                    gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 255, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 0, g: 0, b: 255, a: resultado })));
                    match = true;
                    break;
                };
            };
            if (!match) {
                gl.graphics[i].setSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                  new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 255, a: 0.45 }), 2),
                                                   new dojo.Color({ r: 0, g: 0, b: 255, a: 0 })));
            };
        };
    };

};

function validar(txt){
    $('#msgTXT2').html('Cargando datos, por favor, espere.');
    $('#msg2').popup('open');
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
        $("#ruta").html("Consolidado Nacional - Programa: " + $('#fprograma').find('option:selected').text().toString());
        $("#load_icon").show();
        $("#mainChart").hide();
        if ((datoTipo == 0 ? cache_data_nacional_anual : cache_data_nacional_pp) == null){
            validar((datoTipo == 0 ? "cache_data_nacional_anual" : "cache_data_nacional_pp"));
        };
        cache_data = (datoTipo == 0 ? cache_data_nacional_anual : cache_data_nacional_pp);
        $("#load_icon").hide();
        $("#mainChart").show();
        updatePrograma();
    } else {
        if ($('#fmunicipio')[0].value == "-999") {
            // Consolidado Departamental
            var deptoNombre;
            var daneImportar;
            $("#ruta").html("Consolidado " + $('#fdepto').find('option:selected').text().toString() + " - Programa: " + $('#fprograma').find('option:selected').text().toString());
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
                if (datoTipo == 0) {
                    // TODO CAMBIAR DANEIMPORTAR
                    if (value["nombredepartamento"] == deptoNombre) {
                        cache_data.push(value);
                    };
                } else {
                    if (value["daneimportar"] == daneImportar) {
                        cache_data.push(value);
                    };
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
            $("#ruta").html("Detalle " + $('#fmunicipio').find('option:selected').text().toString() + " - Programa: " + $('#fprograma').find('option:selected').text().toString());
            $("#load_icon").show();
            $("#mainChart").hide();
            cache_data = [];
            if ((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp) == null) {
                validar((datoTipo == 0 ? "cache_data_muni_anual" : "cache_data_muni_pp"));
            };
            $.each((datoTipo == 0 ? cache_data_muni_anual : cache_data_muni_pp), function (index, value) {
                if (datoTipo == 0) {
                    if (value["daneimportar"] == daneImportar) {
                        cache_data.push(value);
                    };
                } else {
                    if (value["daneimportar"].trim() == daneImportar) {
                        cache_data.push(value);
                    };
                };
            });
            $("#load_icon").hide();
            $("#mainChart").show();
            updatePrograma();
        };
    };
};

function setPreffix(pos) {
    prefixName = preffixes[pos];
    updateNDX(cache_data);
    for (var i = 0; i < preffixes.length; i++) {
        $('#btn' + i).removeClass('ui-btn-active');
    };
    $('#btn' + pos).addClass('ui-btn-active');
    updateMapaDatos();
};

function setTipo(pos) {
    datoTipo = pos;
    if (datoTipo == 0) {
        $('#btntp0').addClass('ui-btn-active');
        $('#btntp1').removeClass('ui-btn-active');
        $("#mapControls").show();
        $("#tableControls").show();
    } else {
        $('#btntp1').addClass('ui-btn-active');
        $('#btntp0').removeClass('ui-btn-active');
        $("#mapControls").hide();
        $("#tableControls").hide();
    };
    updateSize();
    if (map) {
        map.reposition();
        map.resize();
        updateMapaDatos();
    };
    updateDatos();
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
        .width($("#lista").width() - 150)
        .height($("#lista").height())
        .margins({ top: 10, right: 50, bottom: 30, left: 100 })
        .dimension(dateDimension)
        .group(datoGroup)
        .valueAccessor(function (d) {
            return d.value.dato;
        })
        .x(d3.scale.linear().domain((datoTipo == 0 ? [minL, maxL] : [minL-1, maxL+1])))
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .centerBar(true)
        .brushOn(false)
        .title(function (d) {
            return d.x + ": " + d.y;
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


function updateSize() {
    var the_height = window.innerHeight - $("#header").height() - $("#footer").height() - 10;   
    $("#lista").height(the_height);
    $("#reporte").height(the_height);
    $("#mapExt").height(the_height);
    if ($("#mapControls").is(":visible")) {
        $("#map").height(the_height - $("#mapControls").height());
    } else {
        $("#map").height(the_height);
    };
    if (map) {
        map.reposition();
        map.resize();
    };
};

function setView(id) {
    switch (id) {
        case 1:
            $("#lista").hide();
            $("#reporte").hide();
            //$("#mapExt").show();
            $("#mapExt").css("right", "0px");
            break;
        case 2:
            $("#reporte").hide();
            $("#mapExt").css("right", "2000px");
            //$("#mapExt").hide();
            $("#lista").show();
            break;
        case 3:
            //$("#mapExt").hide();
            $("#mapExt").css("right", "2000px");
            $("#lista").hide();
            $("#reporte").show();
            break;
    };
}

function share(id) {
    switch (id) {
        case 'facebook':
            window.open(encodeURI('http://www.facebook.com/sharer.php?t=' + _msg_share_fb + '&u=' + _url + '?pos='), '_blank', '');
            break;
        case 'twitter':
            window.open(encodeURI('https://twitter.com/intent/tweet?text=' + _msg_share_tw + '&url=' + _url + '?pos='), '_blank', '');
            break;
        case 'email':
            window.open('mailto:?subject=Encontré este lugar en Vivi&body=' + _url + '?pos=', '_system', '');
            break;
    }
}


function mapLoadHandler(map) {
    map.disableDoubleClickZoom();
    map.infoWindow.resize(150, 100);

    loaded = true;
    gl = new esri.layers.GraphicsLayer();
    var sr = new esri.renderer.SimpleRenderer(
             new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                              new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.5]), 2),
                                                       new dojo.Color([255, 0, 0, 0.5])));
    gl.setRenderer(sr);
    map.addLayer(gl, 0);
    
    if (getUrlVars()["pos"] != null) {
        //currentPoint = new esri.geometry.Point(parseFloat(getUrlVars()["pos"].split("A")[0]), parseFloat(getUrlVars()["pos"].split("A")[1]), map.spatialReference);
    } else {
        currentPoint = new esri.geometry.Point(pLng, pLat, map.spatialReference);
    };    
    map.centerAndZoom(currentPoint, 5);

    /*
    if (getUrlVars()["pos"] != null) {

    };
    */
    updateNacional();

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
            title = results.features[i].attributes["NOM_DPTO"];
        } catch (e) {
            
        };
        content = "<a href='#' onclick='analizarDepto(\"" + value + "\");' style=''>Ver datos</a><br /><a href='#' onclick='cerrarPopup();' style=''>Cerrar</a>";

        popcontent = new esri.InfoTemplate(title, content);
        try {
            gl.add(new esri.Graphic(results.features[i].geometry,
                                        new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 255, g: 0, b: 0, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 255, g: 0, b: 0, a: 0.45 })),
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
            value = results.features[i].attributes["COD_MPIO"];
            title = results.features[i].attributes["NOM_MPIO"];
        } catch (e) {

        };
        content = "<a href='#' onclick='analizarMuni(\"" + value + "\");' style=''>Ver datos</a><br /><a href='#' onclick='cerrarPopup();' style=''>Cerrar</a>";

        popcontent = new esri.InfoTemplate(title, content);
        try {
            gl.add(new esri.Graphic(results.features[i].geometry,
                                        new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color({ r: 0, g: 0, b: 255, a: 0.45 }), 2),
                                                                       new dojo.Color({ r: 0, g: 0, b: 255, a: 0.45 })),
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
    $("#ruta").html("Detalle " + $('#fmunicipio').find('option:selected').text().toString() + " - Programa: " + $('#fprograma').find('option:selected').text().toString());
    for (var i = 0; i < gl.graphics.length; i++) {
        if (gl.graphics[i].attributes["COD_MPIO"].toString() == $('#fmunicipio').find('option:selected').val()){
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