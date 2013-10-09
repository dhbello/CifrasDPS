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
var _map_deptos = 'http://190.25.231.249/arcgis/rest/services/Divipola/CentrosPobladosyEntidadesTerritoriales/MapServer/3';
var _map_municipios = 'http://190.25.231.249/arcgis/rest/services/Divipola/CentrosPobladosyEntidadesTerritoriales/MapServer/5';

var _data_nacional = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/metadatanacionalanual/?$format=json&$orderby=anofecha';
var _data_deptos = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datadptoanual/?$format=json&$orderby=anofecha&$filter=nombredepartamento%20like%20';
var _data_municipios = 'http://servicedatosabiertoscolombia.cloudapp.net/v1/dps/datamunicipalanual?$format=json&$orderby=anofecha&$filter=nombremunicipio%20like%20';

var cache_data;
var cache_data_GEO;

var query_muni = 'http://190.25.231.249/arcgis/rest/services/Divipola/CentrosPobladosyEntidadesTerritoriales/MapServer/5/query?text=&orderByFields=NOM_MPIO&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=COD_MPIO%2CNOM_MPIO&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson&where=COD_DPTO+%3D+'
// Variables a desplejar
var variables = [
    ["Activos para la Prosperidad", "act_pros"],
["AfroPaz", "afro"],
["Atencion a Victimas de la Violencia por 2 S.M.M.L.V", "avv2"],
["Atencion a Victimas de la Violencia por 40 S.M.M.L.V", "avv40"],
["Atencion de Victimas de la Violencia por Reparacion Administrativa", "avvra"],
["Atencion Humanitaria", "ahe"],
["Ayuda Humanitaria", "ayuhum"],
["Ayuda Humanitaria", "ayu_hum"],
["Bancarizacion de Familias en accion ", "fam_ban"],
["Campo que indica las personas Victimas Expulsadas", "expul"],
["Campo que indica las personas Victimas Recepcionadas", "recep"],
["Departamento para la Prosperidad Social", "dps"],
["Desarraigados", "desarra"],
["Desarrollo Regional, Paz y Estabilidad", "drpe"],
["Desarrollo y Paz", "pdp"],
["Empleo de Emergencia", "gi_pee"],
["Encargo Fiduciario para Ninos, Ninas y Adolescentes", "en_nna"],
["Familias Beneficiadas por el programa Familias con Bienestar", "icbf_fam_biene"],
["Familias en Accion", "fa_fact"],
["Familias en Accion - Desplazados", "fa_des"],
["Familias en Accion - Desplazados", "fa_des"],
["Familias en Accion - Indigenas", "fa_ind"],
["Familias en Accion - Indigenas", "fa_ind"],
["Familias en Accion - Sisben", "fa_sis"],
["Familias en Accion - Sisben", "fa_sis"],
["Familias en Accion Periodo Presidencial Santos - Desplazados", "fasan_des"],
["Familias en Accion Periodo Presidencial Santos - Desplazados", "fasan_des"],
["Familias en Accion Periodo Presidencial Santos - Indigenas", "fasan_ind"],
["Familias en Accion Periodo Presidencial Santos - Indigenas", "fasan_ind"],
["Familias en Accion Periodo Presidencial Santos - Sisben", "fasan_sis"],
["Familias en Accion Periodo Presidencial Santos - Sisben", "fasan_sis"],
["Familias en su Tierra", "irr"],
["Familias GuardaBosques", "pfg"],
["Generacion de Ingresos", "giv"],
["Generacion de Ingresos", "giv"],
["Generacion de Ingresos - Capitalizacion", "gi_cap"],
["Generacion de Ingresos - Capitalizacion", "gi_cap"],
["Generacion de Ingresos - Desarrollo Economico Incluyente", "gi_dei"],
["Generacion de Ingresos - Desarrollo Economico Incluyente", "gi_dei"],
["Generacion de Ingresos - Enfoque Diferencial - IRACA", "gi_iraca"],
["Generacion de Ingresos - Enfoque Diferenciasl - IRACA", "gi_iraca"],
["Generacion de Ingresos - Enfoque Étnico - IRACA", "gi_iraca"],
["Generacion de Ingresos - Icetex", "gi_icetex"],
["Generacion de Ingresos - Icetex ", "gi_icetex"],
["Generacion de Ingresos - Incentivo a la Capacitacion para el Empleo", "gi_ice"],
["Generacion de Ingresos - Incentivo a la Capacitacion para el Empleo", "gi_ice"],
["Generacion de Ingresos - Mujeres Ahorradoras", "gi_ma"],
["Generacion de Ingresos - Mujeres Ahorradoras", "gi_ma"],
["Generacion de Ingresos - Mujeres Productivas", "gi_mp"],
["Generacion de Ingresos - Mujeres Productivas", "gi_mp"],
["Generacion de Ingresos - Otras Estrategias", "gi_otras"],
["Generacion de Ingresos - Otras Estrategias", "gi_otras"],
["Generacion de Ingresos - Programa de Atencion Integral", "gi_pai"],
["Generacion de Ingresos - Programa de Atencion Integral", "gi_pai"],
["Generacion de Ingresos - Recuperacion de Activos Improductivos", "gi_rai"],
["Generacion de Ingresos - Recuperacion de Activos Improductivos", "gi_rai"],
["Generacion de Ingresos - Ruta de Ingresos y Empresarismo", "gi_rie"],
["Generacion de Ingresos - Ruta de Ingresos y Empresarismo", "gi_rie"],
["Generacion de Ingresos - Subsidio Integral de Tierras", "gi_sit"],
["Generacion de Ingresos - Subsidio Integral de Tierras", "gi_sit"],
["Generacion de Ingresos - Titulacion de Tierras", "gi_tt"],
["Generacion de Ingresos - Titulaciones de Tierras", "gi_tt"],
["Generacion de Ingresos - Trabajando Unidos", "gi_tu"],
["Generacion de Ingresos - Trabajando Unidos", "gi_tu"],
["Grupo de Apoyo Misional", "gam"],
["Grupo Movil de Erradicacion", "gme"],
["Grupo Paz, Desarrollo y Estabilidad", "gpde"],
["Habitad", "hab"],
["Habitad - Mejoramiento a la Habitalidad", "hab_mh"],
["Habitad - Mejoramiento para la Habitalidad", "hab_mh"],
["Habitad - Mejoramiento Subsidio Rural", "hab_rur"],
["Habitat", "hab"],
["Indemnizacion Ley 1290", "ind1290"],
["Indemnizacion Ley 418", "ind418"],
["Indemnizacion por ley 1290", "ind1290"],
["Indemnizacion por ley 418", "ind418"],
["Ingreso Para la Prosperidad", "ips"],
["inversion ejecutada total en el Sector", "tot"],
["Jovenes en Accion", "jea"],
["Jovenes en Accion", "jea_reg"],
["Jovenes en Accion", "jea_mat"],
["Jovenes en Accion", "jea_cup"],
["Jovenes en Accion", "jea_enrol"],
["Jovenes en Accion", "jea_pro_mat"],
["Laboratorios de Paz", "lp"],
["Legion del Afecto", "la"],
["Mas Familias en Accion", "mfa_ban"],
["Mas Familias en Accion - Desplazados", "mfa_des"],
["Mas Familias en Accion - Indigenas", "mfa_ind"],
["Mas Familias en Accion - Sisben", "mfa_sis"],
["Mas Familias en Accion - Unidos", "mfa_uni"],
["Mas Familias es Accion", "mfa_ins"],
["Mas Familias es Accion - Desplazados", "mfa_des"],
["Mas Familias es Accion - Indigenas", "mfa_ind"],
["Mas Familias es Accion - Sisben", "mfa_sis"],
["Mas Familias es Accion - Unidos", "mfa_uni"],
["Musica para la Reconciliacion", "musica"],
["Musica para la Reconciliacion", "musica"],
["Musica para la Reconciliacion - Coro", "mpr_cor"],
["Musica para la Reconciliacion - Discapacidad", "mpr_dis"],
["Musica para la Reconciliacion - Preorquesta", "mpr_preor"],
["Musica para la Reconciliacion - Preorquestal", "mpr_preor"],
["ninos y ninas atendidos en hogares icbf que brindan atencion, cuidado y nutricion sin el componente de educacion inicial", "icbf_nn_sin_edu_ini"],
["ninos y ninas atendidos en programas de atencion integral", "nn_pai"],
["ninos, ninas y adolescentes atendidos con el generaciones con bienestar", "icbf_gen_biene"],
["ninos, ninas y adolescentes atendidos con el programa PAE", "icbf_nna_pae"],
["Nuevos Territorios de Paz", "ntp"],
["Obras para la Prosperidad", "opp"],
["Programa de Atencion Integral", "gi_pai"],
["Programa de Desarrollo y Paz", "pdf"],
["Programa de Empleo de Emergencias", "gi_pee"],
["programa Generacion de Ingresos - Icetex", "gi_icetex"],
["Proteccion de Tierras", "prot_tier"],
["Proyectos Especiales", "pe"],
["Proyectos Productivos", "pp"],
["Pueblos indigenas", "pi"],
["Red de Seguridad Alimentaria", "resa"],
["Retorno", "retorno"],
["Retornos", "retor"],
["Unidos", "unidos"],
["Unidos", "uni_prom"],
["Unidos", "uni_cog"]


];
var preffixes = ["fam", "per", "inv", "pro", "has"];
var preffixesDesc = ["Familias", "Personas", "Inversi&oacute;n", "Proyectos", "Hectareas"];

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

function init() {

    for (var i = 0; i < variables.length; i++) {
        $('#fprograma').append($('<option>', { value: i }).text(variables[i][0]));
    };
    $('#fprograma').val(0);
    updatePrograma();

    $("#lista").height(parseInt($(document).height() * 0.5));
    //$("#lista").height(parseInt(400));
    $("#lista").show();

    if (isPhoneGapExclusive()) {
        if ((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE)) {
            $('#msgTXT').html('DPS requiere una conexi&oacute;n de datos para funcionar correctamente. Por favor, verifique su configuraci&oacute;n de red e intente nuevamente.');
            $('#msg').popup('open');
            return;
        };
        document.addEventListener("backbutton", function () {
            if ($(".ui-page-active .ui-popup-active").length > 0) {
                /*
                $('#reportar').popup('close');
                $('#share').popup('close');
                $('#configuracion').popup('close');
                $('#acerca').popup('close');
                $('#tutorial').popup('close');
                $('#msg').popup('close');
                $('#msg2').popup('close');
                $('#popupGeneral').popup('close');
                */
            } else {
                navigator.app.exitApp();
            };
        }, true);
    }

    updateSize();

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

    $('#fdepto').change(function () {
        fdeptoChange();
    });

    $('#fmunicipio').change(function () {
        updateDatos();
        updateDepto();
    });

    $('#fprograma').change(function () {
        updatePrograma();
    });

    if (isPhoneGap()) {

        map = new esri.Map("map", {
            zoom: 5,
            infoWindow: popup,
            autoresize: true
        });

        dojo.connect(map, "onLoad", mapLoadHandler);
        dojo.connect(map, "onDblClick", mapClickHandler);
    } else {
        map = new esri.Map("map", {
            zoom: 5,
            nav: true,
            infoWindow: popup,
            autoresize: true
        });

        dojo.connect(map, "onLoad", mapLoadHandler);
        dojo.connect(map, "onClick", mapClickHandler);
    };

    var streetMapLayer = new esri.layers.ArcGISTiledMapServiceLayer(_map_url);
    map.addLayer(streetMapLayer);
    map.resize();
}

function fdeptoChange() {
    if ($('#fdepto')[0].value == "-999") {
        updateNacional();
        $('#munidiv').hide();
    } else {
        $.ajax({
            url: query_muni + "%27" + $('#fdepto')[0].value + "%27",
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#munidiv').show();
                $('#fmunicipio')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option value="-999">Consolidado Departamento</option>')
                    .val('-999');
                updateDatos();
                updateDepto();
                for (var i = 0; i < data.features.length; i++) {
                    $('#fmunicipio').append($('<option>', { value: data.features[i].attributes["COD_MPIO"] })
                         .text(data.features[i].attributes["NOM_MPIO"]));
                };

            },
            error: function () {
                $('#msgTXT2').html('Servicio de municipios no disponible, por favor, intente m&aacute;s tarde.');
                $('#msg2').popup('open');
            }
        });
    };
}

function updateNacional() {
    updateDatos();
    gl.clear();
    var queryTask = new esri.tasks.QueryTask(_map_deptos);
    var queryParams = new esri.tasks.Query();
    queryParams.spatialReference = new esri.SpatialReference(3857);
    queryParams.geometry = new esri.geometry.Extent(-1.0761122486903157E7, -482219.85410090536, -6575141.198273913, 1994285.0989090009, new esri.SpatialReference(3857));
    queryParams.maxAllowableOffset = 0.01;
    queryParams.outSpatialReference = map.spatialReference;
    queryParams.outFields = ["COD_DPTO", "NOM_DPTO"]
    queryParams.returnGeometry = true;
    
    queryTask.execute(queryParams, function (results) {
        map.setExtent(esri.graphicsExtent(results.features));
        showResultsDepto(results);
        updateMapaDatos();
    }, function (error) {
        
    });
};

function updateDepto() {
    gl.clear();
    var queryTask = new esri.tasks.QueryTask(_map_municipios);
    var queryParams = new esri.tasks.Query();
    queryParams.spatialReference = new esri.SpatialReference(3857);
    queryParams.geometry = new esri.geometry.Extent(-1.0761122486903157E7, -482219.85410090536, -6575141.198273913, 1994285.0989090009, new esri.SpatialReference(3857));
    queryParams.maxAllowableOffset = 0.01;
    queryParams.outSpatialReference = map.spatialReference;
    queryParams.where = "COD_DPTO = '" + $('#fdepto')[0].value + "'"
    queryParams.outFields = ["COD_MPIO", "NOM_MPIO"]
    queryParams.returnGeometry = true;

    queryTask.execute(queryParams, function (results) {
        map.setExtent(esri.graphicsExtent(results.features));
        showResultsMuni(results);
        updateMapaDatos();
    }, function (error) {

    });
};

function updatePrograma() {
    variableName = variables[parseInt($('#fprograma')[0].value)][1].toString().replace("_", "");
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
    }
    updateMapaDatos();
}

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
        for (var j = 0; j < data_dpto.length; j++) {
            if (data_dpto[j][variableName + prefixName] != null) {
                maxL2 = Math.max(maxL2, parseInt(data_dpto[j][variableName + prefixName]));
            };
        };

        for (var i = 0; i < gl.graphics.length; i++) {
            var match = false;
            for (var j = 0; j < data_dpto.length; j++) {
                if ((gl.graphics[i].attributes["NOM_DPTO"].toString().toUpperCase() == data_dpto[j]["nombredepartamento"].replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U").replace("Ñ", "N")) &&
                    (dateName == data_dpto[j]["anofecha"])) {
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
        for (var i = 0; i < gl.graphics.length; i++) {
            for (var j = 0; j < data_muni.length; j++) {
                if ((gl.graphics[i].attributes["NOM_MPIO"].toString().toUpperCase() == data_muni[j]["nombremunicipio"]) &&
                    (dateName == data_muni[j]["anofecha"])) {
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
                if ((gl.graphics[i].attributes["NOM_MPIO"].toString().toUpperCase() == data_muni[j]["nombremunicipio"]) &&
                    (dateName == data_muni[j]["anofecha"])) {
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

function updateDatos() {
    $('#seleccion').popup('close');
    if ($('#fdepto')[0].value == "-999") {
        // Consolidado Nacional
        $("#ruta").text("Consolidado Nacional");
        $("#load_icon").show();
        $("#mainChart").hide();
        $.ajax({
            url: _data_nacional,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                $("#load_icon").hide();
                $("#mainChart").show();
                cache_data = data.d;
                updatePrograma();
            },
            error: function (err) {

            }
        });

    } else {
        if ($('#fmunicipio')[0].value == "-999") {
            // Consolidado Departamental
            var deptoNombre;
            $("#ruta").text("Consolidado " + $('#fdepto').find('option:selected').text().toString());
            deptoNombre = $('#fdepto').find('option:selected').text().toString().toUpperCase();
            deptoNombre = deptoNombre.replace("Á", "%").replace("É", "%").replace("Í", "%").replace("Ó", "%").replace("Ú", "%");
            $("#load_icon").show();
            $("#mainChart").hide();
            $.ajax({
                url: _data_deptos + '%27' + deptoNombre + '%27',
                type: 'GET',
                dataType: 'jsonp',
                success: function (data) {
                    $("#load_icon").hide();
                    $("#mainChart").show();
                    cache_data = data.d;
                    updatePrograma();
                },
                error: function (err) {

                }
            });

        } else {
            // Consolidado Municipio
            var muniNombre;
            muniNombre = $('#fmunicipio').find('option:selected').text().toString().toUpperCase();
            muniNombre = muniNombre.replace("Á", "%").replace("É", "%").replace("Í", "%").replace("Ó", "%").replace("Ú", "%");
            $("#ruta").text("Detalle " + $('#fmunicipio').find('option:selected').text().toString());
            $("#load_icon").show();
            $("#mainChart").hide();
            $.ajax({
                url: _data_municipios + '%27' + muniNombre + '%27',
                type: 'GET',
                dataType: 'jsonp',
                success: function (data) {
                    $("#load_icon").hide();
                    $("#mainChart").show();
                    cache_data = data.d;
                    updatePrograma();
                },
                error: function (err) {

                }
            });

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

function updateNDX(data) {
    if (data == null) {
        return;
    };

    ndx = crossfilter(data);
    all = ndx.groupAll();

    dateDimension = ndx.dimension(function (d) {
        return parseInt(d.anofecha);
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
        .height($("#lista").height() - 150)
        .margins({ top: 10, right: 50, bottom: 30, left: 100 })
        .dimension(dateDimension)
        .group(datoGroup)
        .valueAccessor(function (d) {
            return d.value.dato;
        })
        .x(d3.scale.linear().domain([minL, maxL]))
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .centerBar(true)
        .brushOn(false)
        .title(function (d) {
            return d.x + ": " + d.y;
        })
        .xAxis().ticks(5).tickFormat(d3.format("d"));

    dc.renderAll();
}


function updateSize() {
    if ($("#lista").is(":visible")) {
        $("#lista").height(parseInt($(document).height() * 0.5));
    } else {
        $("#lista").height(0);
    };
    var the_height = $(window).height() - $("#header").height() - $("#lista").height() - 8;
    $("#map").height(the_height);
    if (map) {
        map.reposition();
        map.resize();
    }
};

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
        var obj = {};
        obj.mapPoint = currentPoint;
        mapClickHandler(obj);
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

function mapClickHandler(evt) {
    if (isPhoneGapExclusive()) {
        if ((navigator.network.connection.type == Connection.UNKNOWN) || (navigator.network.connection.type == Connection.NONE)) {
            $('#msgTXT').html('DPS requiere una conexi&oacute;n de datos para funcionar correctamente. Por favor, verifique su configuraci&oacute;n de red e intente nuevamente.');
            $('#msg').popup('open');
            return;
        };
    }
    if (mapLock) {
        return;
    };
    mapLock = true;
    gl.clear();
    map.infoWindow.hide();
    /*
    if (!($("#lista").is(":visible"))) {
        displayLista();
    };
    */

    var mapPoint;
    mapPoint = evt.mapPoint;
    currentPoint = evt.mapPoint;
    
    

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
        content = "<a href='#' onclick='analizarDeptoD(\"" + value + "\");' style=''>Ver datos</a><br /><a href='#' onclick='analizarDepto(\"" + value + "\");' style=''>Ver detalle (drill-down)</a><br /><a href='#' onclick='cerrarPopup();' style=''>Cerrar</a>";

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
    fdeptoChange();
}

function analizarDeptoD(codigo) {
    $("#fdepto").val(codigo);
    $("#ruta").text("Consolidado " + $('#fdepto').find('option:selected').text().toString());
    cerrarPopup();
    updateDatos();
};

function analizarMuni(codigo) {
    $("#fmunicipio").val(codigo);
    $("#ruta").text("Detalle " + $('#fmunicipio').find('option:selected').text().toString());
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