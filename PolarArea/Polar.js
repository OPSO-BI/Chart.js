define( ["jquery","qlik","./Chart.min"],function ( $, qlik, Chart) {
    'use strict';
    var id;
    var chartData = new Array();
    return {
       initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 3,
                    qHeight: 500
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 5
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 3
                },
                sorting: {
                    uses: "sorting"
                }
            },
            settings : {
                uses : "settings",
                items : {
                    initFetchRows : {
                        ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
                        label : "Initial fetch rows",
                        type : "number",
                        defaultValue : 50
                    }
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint : function($element,layout) {
            var Highlight = new Array("#FF5A5E","#5AD3D1","#FFC870","#A8B3C5","#616774");
            var dimensions = layout.qHyperCube.qDimensionInfo,
                matrix = layout.qHyperCube.qDataPages[0].qMatrix;
            id = "polar_"+ layout.qInfo.qId;
            if ( dimensions && dimensions.length > 0 ) {
                matrix.forEach(function ( row ) {
                    var data ={
                        value : parseFloat(row[1].qText),
                        color : getRandomColor(),
                        highlight : Highlight[0],
                        label : row[0].qText
                    };
                    chartData.push(data);
                });
                chartData = JSON.parse(JSON.stringify(chartData));                  
            }         
            if(layout.qHyperCube.qDataPages[0] && matrix) {
                    if (document.getElementById(id)) {
                        $("#" + id).empty();
                    }
                    else {
                        $element.append($('<canvas/>').attr("id", id));
                    }
                    var ctx =$('#'+id).get(0).getContext("2d");
                    var myPolar = new Chart(ctx).PolarArea(chartData,{responsive: true,
                                                                      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"});           
            }
        }
    }
 });  
 function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}     