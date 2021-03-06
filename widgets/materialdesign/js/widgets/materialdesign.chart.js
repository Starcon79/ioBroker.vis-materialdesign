/*
    ioBroker.vis vis-materialdesign Widget-Set

    version: "0.3.7"

    Copyright 2019 Scrounger scrounger@gmx.net
*/
"use strict";

vis.binds.materialdesign.chart = {
    bar: function (el, data) {
        try {
            setTimeout(function () {
                let myChartHelper = vis.binds.materialdesign.chart.helper;
                myChartHelper.registerChartAreaPlugin();

                let $this = $(el);
                var chartContainer = $(el).find('.materialdesign-chart-container').get(0);

                $(el).find('.materialdesign-chart-container').css('background-color', myMdwHelper.getValueFromData(data.backgroundColor, ''));
                let globalColor = myMdwHelper.getValueFromData(data.globalColor, '#44739e');

                let colorScheme = myMdwHelper.getValueFromData(data.colorScheme, null);
                if (colorScheme !== null) {
                    colorScheme = vis.binds.materialdesign.colorScheme.get(data.colorScheme, data.dataCount);
                }

                if (chartContainer !== undefined && chartContainer !== null && chartContainer !== '') {
                    var ctx = chartContainer.getContext('2d');

                    // Global Options:
                    Chart.defaults.global.defaultFontColor = '#44739e';
                    Chart.defaults.global.defaultFontSize = 15;
                    Chart.defaults.global.animation.duration = myMdwHelper.getNumberFromData(data.animationDuration, 1000);

                    Chart.plugins.unregister(ChartDataLabels);

                    let dataArray = []
                    let labelArray = [];
                    let dataColorArray = [];
                    let hoverDataColorArray = [];
                    let globalValueTextColor = myMdwHelper.getValueFromData(data.valuesFontColor, 'black')
                    let valueTextColorArray = [];
                    let countOfItems = 0;
                    let jsonData = null;

                    if (data.chartDataMethod === 'jsonStringObject') {
                        try {
                            jsonData = JSON.parse(vis.states.attr(data.oid + '.val'));
                            countOfItems = jsonData.length - 1;
                        } catch (err) {
                            console.error(`[Bar Chart ${data.wid}] cannot parse json string! Error: ${err.message}`);
                        }

                        vis.states.bind(data.oid + '.val', onChange);
                    } else {
                        countOfItems = data.dataCount;
                    }

                    for (var i = 0; i <= countOfItems; i++) {
                        // row data
                        if (colorScheme !== null) {
                            globalColor = colorScheme[i];
                        }

                        let barItem = getBarItemObj(i, data, jsonData, globalColor, globalValueTextColor);

                        dataArray.push(barItem.value);
                        labelArray.push(barItem.label);

                        dataColorArray.push(barItem.dataColor);

                        if (myMdwHelper.getValueFromData(data.hoverColor, null) === null) {
                            hoverDataColorArray.push(myChartHelper.addOpacityToColor(barItem.dataColor, 80))
                        } else {
                            hoverDataColorArray.push(data.hoverColor)
                        }

                        valueTextColorArray.push(barItem.valueColor)

                        vis.states.bind(data.attr('oid' + i) + '.val', onChange);
                    }



                    // Data with datasets options
                    var chartData = {
                        labels: labelArray,
                        datasets: [
                            Object.assign(myChartHelper.getDataset(dataArray, dataColorArray, hoverDataColorArray, undefined, data.hoverBorderColor, undefined, data.hoverBorderWidth),
                                {
                                    // chart specific properties
                                    label: myMdwHelper.getValueFromData(data.barLabelText, ''),
                                    categoryPercentage: myMdwHelper.getNumberFromData(data.barWidth, 80) / 100,
                                    barPercentage: myMdwHelper.getNumberFromData(data.barWidth, 80) / 100,
                                }
                            )
                        ]
                    };

                    // Notice how nested the beginAtZero is
                    var options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: myChartHelper.getLayout(data),
                        legend: myChartHelper.getLegend(data),
                        chartArea: {
                            backgroundColor: myMdwHelper.getValueFromData(data.chartAreaBackgroundColor, ''),
                        },
                        scales: {
                            yAxes: [
                                myChartHelper.get_Y_AxisObject(data.chartType, data.yAxisPosition, data.yAxisTitle, data.yAxisTitleColor, data.yAxisTitleFontFamily, data.yAxisTitleFontSize,
                                    data.yAxisShowAxisLabels, data.axisValueMin, data.axisValueMax, data.axisValueStepSize, data.axisMaxLabel, data.axisLabelAutoSkip, data.axisValueAppendText,
                                    data.yAxisValueLabelColor, data.yAxisValueFontFamily, data.yAxisValueFontSize, data.yAxisValueDistanceToAxis, data.yAxisGridLinesColor,
                                    data.yAxisGridLinesWitdh, data.yAxisShowAxis, data.yAxisShowGridLines, data.yAxisShowTicks, data.yAxisTickLength, data.yAxisZeroLineWidth, data.yAxisZeroLineColor, data.axisValueMinDigits, data.axisValueMaxDigits)
                            ],
                            xAxes: [
                                myChartHelper.get_X_AxisObject(data.chartType, data.xAxisPosition, data.xAxisTitle, data.xAxisTitleColor, data.xAxisTitleFontFamily, data.xAxisTitleFontSize,
                                    data.xAxisShowAxisLabels, data.axisValueMin, data.axisValueMax, data.axisValueStepSize, data.axisMaxLabel, data.axisLabelAutoSkip, data.axisValueAppendText,
                                    data.xAxisValueLabelColor, data.xAxisValueFontFamily, data.xAxisValueFontSize, data.xAxisValueDistanceToAxis, data.xAxisGridLinesColor,
                                    data.xAxisGridLinesWitdh, data.xAxisShowAxis, data.xAxisShowGridLines, data.xAxisShowTicks, data.xAxisTickLength, data.xAxisZeroLineWidth, data.xAxisZeroLineColor, data.xAxisOffsetGridLines, data.axisValueMinDigits, data.axisValueMaxDigits, data.xAxisMinRotation, data.xAxisMaxRotation)
                            ],
                        },
                        tooltips: {
                            enabled: data.showTooltip,
                            backgroundColor: myMdwHelper.getValueFromData(data.tooltipBackgroundColor, 'black'),
                            caretSize: myMdwHelper.getNumberFromData(data.tooltipArrowSize, 5),
                            caretPadding: myMdwHelper.getNumberFromData(data.tooltipDistanceToBar, 2),
                            cornerRadius: myMdwHelper.getNumberFromData(data.tooltipBoxRadius, 4),
                            displayColors: data.tooltipShowColorBox,
                            xPadding: myMdwHelper.getNumberFromData(data.tooltipXpadding, 10),
                            yPadding: myMdwHelper.getNumberFromData(data.tooltipYpadding, 10),
                            titleFontColor: myMdwHelper.getValueFromData(data.tooltipTitleFontColor, 'white'),
                            titleFontFamily: myMdwHelper.getValueFromData(data.tooltipTitleFontFamily, undefined),
                            titleFontSize: myMdwHelper.getNumberFromData(data.tooltipTitleFontSize, undefined),
                            titleMarginBottom: myMdwHelper.getNumberFromData(data.tooltipTitleMarginBottom, 6),
                            bodyFontColor: myMdwHelper.getValueFromData(data.tooltipBodyFontColor, 'white'),
                            bodyFontFamily: myMdwHelper.getValueFromData(data.tooltipBodyFontFamily, undefined),
                            bodyFontSize: myMdwHelper.getNumberFromData(data.tooltipBodyFontSize, undefined),
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    if (tooltipItem && tooltipItem.value) {
                                        return `${chart.datasets[0].label}: ${myMdwHelper.formatNumber(tooltipItem.value, data.tooltipValueMinDecimals, data.tooltipValueMaxDecimals)}${myMdwHelper.getValueFromData(data.tooltipBodyAppend, '')}`
                                            .split('\\n');
                                    }
                                    return '';
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: myMdwHelper.getValueFromData(data.showValues, 'showValuesOn') === 'showValuesOn' ? true : data.showValues === 'showValuesOff' ? false : 'auto',
                                anchor: data.valuesPositionAnchor,
                                align: data.valuesPositionAlign,
                                clamp: true,
                                offset: myMdwHelper.getNumberFromData(data.valuesPositionOffset, 0),
                                rotation: myMdwHelper.getNumberFromData(data.valuesRotation, undefined),
                                formatter: function (value, context) {
                                    if ((value || value === 0) && context.dataIndex % myMdwHelper.getNumberFromData(data.valuesSteps, 1) === 0) {
                                        let barItem = getBarItemObj(context.dataIndex, data, jsonData, globalColor, globalValueTextColor, value);
                                        return `${barItem.valueText}${barItem.valueAppendix}`.split('\\n');
                                    }
                                    return null;
                                },
                                font: {
                                    family: myMdwHelper.getValueFromData(data.valuesFontFamily, undefined),
                                    size: myMdwHelper.getNumberFromData(data.valuesFontSize, undefined),
                                },
                                color: valueTextColorArray,
                                textAlign: data.valuesTextAlign
                            }
                        }
                    };

                    if (data.disableHoverEffects) options.hover = { mode: null };

                    // Chart declaration:
                    var myBarChart = new Chart(ctx, {
                        type: (data.chartType === 'vertical') ? 'bar' : 'horizontalBar',
                        data: chartData,
                        options: options,
                        plugins: [ChartDataLabels]
                    });

                    function onChange(e, newVal, oldVal) {
                        // i wird nicht gespeichert -> umweg über oid gehen, um index zu erhalten
                        if (data.chartDataMethod === 'inputPerEditor') {
                            let oidId = e.type.substr(0, e.type.lastIndexOf("."));

                            for (var d = 0; d <= data.dataCount; d++) {
                                if (oidId === data.attr('oid' + d)) {
                                    let index = d;
                                    myBarChart.data.datasets[0].data[index] = newVal;
                                    myBarChart.update();
                                }
                            }
                        } else {
                            try {
                                let jsonData = JSON.parse(newVal);

                                for (var d = 0; d <= jsonData.length - 1; d++) {
                                    if (colorScheme !== null) {
                                        globalColor = colorScheme[d];
                                    }

                                    let barItem = getBarItemObj(d, data, jsonData, globalColor, globalValueTextColor);

                                    myBarChart.data.datasets[0].data[d] = barItem.value;
                                    myBarChart.data.datasets[0].backgroundColor[d] = barItem.dataColor;
                                    myBarChart.data.labels[d] = barItem.label;

                                    if (myMdwHelper.getValueFromData(data.hoverColor, null) === null) {
                                        myBarChart.data.datasets[0].hoverBackgroundColor[d] = myChartHelper.addOpacityToColor(barItem.dataColor, 80);
                                    } else {
                                        myBarChart.data.datasets[0].hoverBackgroundColor[d] = data.hoverColor;
                                    }

                                    myBarChart.options.plugins.datalabels.color[d] = barItem.valueColor;

                                    myBarChart.options.plugins.datalabels.formatter = function (value, context) {
                                        if (value) {
                                            let barItem = getBarItemObj(context.dataIndex, data, jsonData, globalColor, globalValueTextColor, value);
                                            return `${barItem.valueText}${barItem.valueAppendix}`.split('\\n');
                                        }
                                        return '';
                                    }
                                }
                                myBarChart.update();
                            } catch (err) {
                                console.error(`[Bar Chart ${data.wid}] onChange: cannot parse json string! Error: ${err.message}`);
                            }
                        }
                    }

                    function getBarItemObj(i, data, jsonData, globalColor, globalValueTextColor, value = 0) {
                        if (data.chartDataMethod === 'inputPerEditor') {
                            return {
                                label: myMdwHelper.getValueFromData(data.attr('label' + i), ''),
                                value: vis.states.attr(data.attr('oid' + i) + '.val'),
                                dataColor: myMdwHelper.getValueFromData(data.attr('dataColor' + i), globalColor),
                                valueText: myMdwHelper.getValueFromData(data.attr('valueText' + i), `${myMdwHelper.formatNumber(parseFloat(value), data.valuesMinDecimals, data.valuesMaxDecimals)}${myMdwHelper.getValueFromData(data.valuesAppendText, '')}`),
                                valueColor: myMdwHelper.getValueFromData(data.attr('valueTextColor' + i), globalValueTextColor),
                                valueAppendix: myMdwHelper.getValueFromData(data.attr('labelValueAppend' + i), '')
                            }
                        } else {
                            return {
                                label: myMdwHelper.getValueFromData(jsonData[i].label, ''),
                                value: jsonData[i].value,
                                dataColor: myMdwHelper.getValueFromData(jsonData[i].dataColor, globalColor),
                                valueText: myMdwHelper.getValueFromData(jsonData[i].valueText, `${myMdwHelper.formatNumber(parseFloat(value), data.valuesMinDecimals, data.valuesMaxDecimals)}${myMdwHelper.getValueFromData(data.valuesAppendText, '')}`),
                                valueColor: myMdwHelper.getValueFromData(jsonData[i].valueColor, globalValueTextColor),
                                valueAppendix: myMdwHelper.getValueFromData(jsonData[i].valueAppendix, '')
                            }
                        }
                    }
                }
            }, 1)
        } catch (ex) {
            console.error(`[Bar Chart ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    lineHistory: function (el, data) {
        try {
            let debug = myMdwHelper.getBooleanFromData(data.mdwDebug, false);
            if (debug) console.log(`[Line History Chart ${data.wid}] widget setting: ${JSON.stringify(data)}`);

            setTimeout(function () {
                let myChartHelper = vis.binds.materialdesign.chart.helper;
                myChartHelper.registerChartAreaPlugin();

                var myChart;

                let errorsOnDataLoading = [];

                let $this = $(el);
                var chartContainer = $this.find('.materialdesign-chart-container').get(0);

                var progressBar = $this.find('.material-progress-circular-container');

                progressBar.show();


                let timeInterval = data.timeIntervalToShow;
                let dataRangeStartTime = new Date().getTime() - myChartHelper.intervals[timeInterval];
                if (myMdwHelper.getValueFromData(data.time_interval_oid, null) !== null) {
                    let val = vis.states.attr(data.time_interval_oid + '.val');

                    if (typeof (val) === 'string' && myChartHelper.intervals[val] !== undefined) {
                        dataRangeStartTime = new Date().getTime() - myChartHelper.intervals[val]
                        timeInterval = vis.states.attr(data.time_interval_oid + '.val');
                    } else {
                        dataRangeStartTime = val;
                    }

                    vis.states.bind(data.time_interval_oid + '.val', onChange);
                }

                $this.find('.materialdesign-chart-container').css('background-color', myMdwHelper.getValueFromData(data.backgroundColor, ''));
                let globalColor = myMdwHelper.getValueFromData(data.globalColor, '#44739e');

                let colorScheme = myMdwHelper.getValueFromData(data.colorScheme, null);
                if (colorScheme !== null) {
                    colorScheme = vis.binds.materialdesign.colorScheme.get(data.colorScheme, data.dataCount);
                }

                // manual refresh through dp
                if (myMdwHelper.getValueFromData(data.manualRefreshTrigger, null) !== null) {
                    vis.states.bind(data.manualRefreshTrigger + '.ts', onChange);
                }

                if (data.refreshMethod === 'timeInterval') {
                    setInterval(function () {
                        if (debug) console.log(`[Line History Chart ${data.wid}] ************************************************************** onChange - TimeInterval by Editor **************************************************************`);
                        onChange();
                    }, myChartHelper.intervals[data.refreshTimeInterval]);
                }

                if (chartContainer !== undefined && chartContainer !== null && chartContainer !== '') {
                    var ctx = chartContainer.getContext('2d');

                    // Global Options:
                    Chart.defaults.global.defaultFontColor = '#44739e';
                    Chart.defaults.global.defaultFontSize = 15;
                    Chart.defaults.global.animation.duration = myMdwHelper.getNumberFromData(data.animationDuration, 1000);

                    Chart.plugins.unregister(ChartDataLabels);

                    if (myMdwHelper.getValueFromData(data.historyAdapterInstance, null) !== null) {

                        let operations = [];
                        for (var i = 0; i <= data.dataCount; i++) {
                            if (myMdwHelper.getValueFromData(data.attr('oid' + i), null) !== null) {
                                operations.push(myChartHelper.getTaskForHistoryData(data.attr('oid' + i), data, dataRangeStartTime, debug))

                                if (data.refreshMethod === 'realtime') {
                                    vis.states.bind(data.attr('oid' + i) + '.val', onChange);
                                }
                            }
                        }

                        Promise.all(operations).then((result) => {
                            // execute all db queries -> getting all needed data at same time
                            if (debug) console.log(`[Line History Chart ${data.wid}] promise all datasets - count: ${result.length}`);

                            let myDatasets = [];
                            let myYAxis = [];
                            let myDatalabels = [];

                            errorsOnDataLoading = [];

                            for (var i = 0; i <= result.length - 1; i++) {

                                let dataArray = myChartHelper.getPreparedData(result[i], data, i, debug);

                                if (debug) console.log(`[Line History Chart ${data.wid}] prepare dataset for '${result[i].id}'`);

                                if (result[i].error) {
                                    errorsOnDataLoading.push(`[${i}] ${result[i].error}`);
                                }

                                myDatasets.push(
                                    {
                                        data: dataArray,
                                        lineTension: myMdwHelper.getNumberFromData(data.attr('lineTension' + i), 0.4),
                                        borderWidth: myMdwHelper.getNumberFromData(data.attr('lineThikness' + i), 2),
                                        label: myMdwHelper.getValueFromData(data.attr('legendText' + i), ''),
                                        borderColor: myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor),     // Line Color
                                        pointBackgroundColor: myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor),
                                        fill: myMdwHelper.getBooleanFromData(data.attr('useFillColor' + i), false),
                                        backgroundColor: myMdwHelper.getValueFromData(data.attr('fillColor' + i), myChartHelper.addOpacityToColor(myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor), 10)),  //Fill Background color
                                        pointRadius: myMdwHelper.getNumberFromData(data.pointSize, 3),
                                        pointHoverRadius: myMdwHelper.getNumberFromData(data.pointSizeHover, 4),
                                        pointStyle: myMdwHelper.getValueFromData(data.pointStyle, 'circle'),
                                        pointHoverBorderColor: myMdwHelper.getValueFromData(data.attr('pointHoverColor' + i), myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor)),
                                        pointHoverBackgroundColor: myMdwHelper.getValueFromData(data.attr('pointHoverColor' + i), myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor)),
                                        yAxisID: 'yAxis_id_' + myMdwHelper.getNumberFromData(data.attr('commonYAxis' + i), i),
                                        spanGaps: data.attr('lineSpanGaps' + i),
                                        datalabels: {
                                            // Plugin datalabels
                                            display: myMdwHelper.getValueFromData(data.attr('showValues' + i), 'showValuesOn') === 'showValuesOn' ? true : data.attr('showValues' + i) === 'showValuesOff' ? false : 'auto',
                                            anchor: data.attr('valuesPositionAnchor' + i),
                                            align: data.attr('valuesPositionAlign' + i),
                                            offset: myMdwHelper.getNumberFromData(data.attr('valuesPositionOffset' + i), 0),
                                            clamp: true,
                                            rotation: myMdwHelper.getNumberFromData(data.attr('valuesRotation' + i), undefined),
                                            formatter: function (value, context) {
                                                if ((value.y || value.y === 0) && context.dataIndex % myMdwHelper.getNumberFromData(data.attr('valuesSteps' + context.datasetIndex), 1) === 0) {
                                                    return `${myMdwHelper.formatNumber(value.y, data.attr('valuesMinDecimals' + context.datasetIndex), data.attr('valuesMaxDecimals' + context.datasetIndex))}${myMdwHelper.getValueFromData(data.attr('valuesAppendText' + context.datasetIndex), '')}`
                                                        .split('\\n');
                                                }
                                                return null;
                                            },
                                            font: {
                                                family: myMdwHelper.getValueFromData(data.attr('valuesFontFamily' + i), undefined),
                                                size: myMdwHelper.getNumberFromData(data.attr('valuesFontSize' + i), undefined),
                                            },
                                            color: myMdwHelper.getValueFromData(data.attr('valuesFontColor' + i), myMdwHelper.getValueFromData(data.attr('dataColor' + i), (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor)),
                                            textAlign: data.attr('valuesTextAlign' + i)
                                        },
                                    }
                                );

                                if (debug) console.log(`[Line History Chart ${data.wid}] prepare yAxis for '${result[i].id}'`);

                                myYAxis.push(
                                    {
                                        id: 'yAxis_id_' + i,
                                        type: 'linear',
                                        position: data.attr('yAxisPosition' + i),
                                        display: (myMdwHelper.getNumberFromData(data.attr('commonYAxis' + i), i) === i) ? data.attr('showYAxis' + i) : false,
                                        scaleLabel: {       // y-Axis title
                                            display: (myMdwHelper.getValueFromData(data.attr('yAxisTitle' + i), null) !== null),
                                            labelString: myMdwHelper.getValueFromData(data.attr('yAxisTitle' + i), ''),
                                            fontColor: myMdwHelper.getValueFromData(data.yAxisTitleColor, undefined),
                                            fontFamily: myMdwHelper.getValueFromData(data.yAxisTitleFontFamily, undefined),
                                            fontSize: myMdwHelper.getNumberFromData(data.yAxisTitleFontSize, undefined)
                                        },
                                        ticks: {
                                            min: myMdwHelper.getNumberFromData(data.attr('yAxisMinValue' + i), undefined),
                                            max: myMdwHelper.getNumberFromData(data.attr('yAxisMaxValue' + i), undefined),
                                            stepSize: myMdwHelper.getNumberFromData(data.attr('yAxisStep' + i), undefined),
                                            autoSkip: true,
                                            maxTicksLimit: myMdwHelper.getNumberFromData(data.attr('yAxisMaxLabel' + i), undefined),
                                            fontColor: myMdwHelper.getValueFromData(data.attr('yAxisValueColor' + i), myMdwHelper.getValueFromData(data.yAxisValueLabelColor, undefined)),
                                            fontFamily: myMdwHelper.getValueFromData(data.yAxisValueFontFamily, undefined),
                                            fontSize: myMdwHelper.getNumberFromData(data.yAxisValueFontSize, undefined),
                                            padding: myMdwHelper.getNumberFromData(data.yAxisValueDistanceToAxis, 0),
                                            callback: function (value, index, values) {
                                                let axisId = this.id.replace('yAxis_id_', '');
                                                return `${myMdwHelper.formatNumber(value, data.attr('yAxisValueMinDigits' + axisId), data.attr('yAxisValueMaxDigits' + axisId))}${myMdwHelper.getValueFromData(data.attr('yAxisValueAppendText' + axisId), '')}`.split('\\n');
                                            }
                                        },
                                        gridLines: {
                                            display: true,
                                            color: myMdwHelper.getValueFromData(data.attr('yAxisGridLinesColor' + i), 'black'),
                                            lineWidth: myMdwHelper.getNumberFromData(data.attr('yAxisGridLinesWitdh' + i), 0.1),
                                            drawBorder: data.attr('yAxisShowAxisBorder' + i),
                                            drawOnChartArea: data.attr('yAxisShowGridLines' + i),
                                            drawTicks: data.attr('yAxisShowTicks' + i),
                                            tickMarkLength: myMdwHelper.getNumberFromData(data.attr('yAxisTickLength' + i), 5),
                                            zeroLineWidth: myMdwHelper.getNumberFromData(data.attr('yAxisZeroLineWidth' + i), 1),
                                            zeroLineColor: myMdwHelper.getValueFromData(data.attr('yAxisZeroLineColor' + i), 'rgba(0, 0, 0, 0.25)'),
                                        }
                                    }
                                );
                            }

                            // Data with datasets options
                            var chartData = {
                                datasets: myDatasets,
                            };

                            let xAxisTimeFormats = myChartHelper.defaultTimeFormats();
                            try {
                                xAxisTimeFormats = JSON.parse(data.xAxisTimeFormats)
                            } catch (errJSON) {
                                // Formatierung kann ggf. Binding sein -> Workaroung damit chart in VIS Editor angezeigt wird
                                var bindingVal = vis.states.attr(data.xAxisTimeFormats.replace('{', '').replace('}', '') + '.val');
                                if (bindingVal && bindingVal !== null && bindingVal !== 'null') {
                                    try {
                                        xAxisTimeFormats = JSON.parse(bindingVal)
                                    } catch (errJsonBinding) {
                                        console.error(`[Line History Chart] (${data.wid}): parsing Binding for xaxis time format  failed! error in json syntax: ${errJsonBinding.message}`);
                                    }
                                } else {
                                    console.error(`[Line History Chart] (${data.wid}): xaxis time format parsing failed! error in json syntax: ${errJSON.message}`);
                                }
                            }

                            if (debug) console.log(`[Line History Chart ${data.wid}] prepare chart options`);

                            // Notice how nested the beginAtZero is
                            var options = {
                                responsive: true,
                                maintainAspectRatio: false,
                                layout: myChartHelper.getLayout(data),
                                chartArea: {
                                    backgroundColor: myMdwHelper.getValueFromData(data.chartAreaBackgroundColor, ''),
                                },
                                hover: {
                                    mode: 'nearest'
                                },
                                legend: Object.assign(myChartHelper.getLegend(data), myChartHelper.getLegendClickEvent(myYAxis)),
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        bounds: (myMdwHelper.getValueFromData(data.xAxisBounds, '') === 'axisTicks') ? 'ticks' : 'data',
                                        time:
                                        {
                                            displayFormats: xAxisTimeFormats,      // muss entsprechend konfigurietr werden siehe 
                                            tooltipFormat: 'll'
                                        },
                                        position: data.xAxisPosition,
                                        scaleLabel: {       // x-Axis title
                                            display: (myMdwHelper.getValueFromData(data.xAxisTitle, null) !== null),
                                            labelString: myMdwHelper.getValueFromData(data.xAxisTitle, ''),
                                            fontColor: myMdwHelper.getValueFromData(data.xAxisTitleColor, undefined),
                                            fontFamily: myMdwHelper.getValueFromData(data.xAxisTitleFontFamily, undefined),
                                            fontSize: myMdwHelper.getNumberFromData(data.xAxisTitleFontSize, undefined)
                                        },
                                        ticks: {        // x-Axis values
                                            display: myMdwHelper.getBooleanFromData(data.xAxisShowAxisLabels, true),
                                            autoSkip: true,
                                            autoSkipPadding: 10,
                                            maxTicksLimit: myMdwHelper.getNumberFromData(data.xAxisMaxLabel, undefined),
                                            minRotation: parseInt(myMdwHelper.getNumberFromData(data.xAxisMinRotation, 0)),
                                            maxRotation: parseInt(myMdwHelper.getNumberFromData(data.xAxisMaxRotation, 0)),
                                            callback: function (value, index, values) {                                 // only for chartType: horizontal
                                                return `${value}${myMdwHelper.getValueFromData(data.axisValueAppendText, '')}`.split('\\n');
                                            },
                                            fontColor: myMdwHelper.getValueFromData(data.xAxisValueLabelColor, undefined),
                                            fontFamily: myMdwHelper.getValueFromData(data.xAxisValueFontFamily, undefined),
                                            fontSize: myMdwHelper.getNumberFromData(data.xAxisValueFontSize, undefined),
                                            padding: myMdwHelper.getNumberFromData(data.xAxisValueDistanceToAxis, 0),
                                        },
                                        gridLines: {
                                            display: true,
                                            color: myMdwHelper.getValueFromData(data.xAxisGridLinesColor, 'black'),
                                            lineWidth: myMdwHelper.getNumberFromData(data.xAxisGridLinesWitdh, 0.1),
                                            drawBorder: data.xAxisShowAxis,
                                            drawOnChartArea: data.xAxisShowGridLines,
                                            drawTicks: data.xAxisShowTicks,
                                            tickMarkLength: myMdwHelper.getNumberFromData(data.xAxisTickLength, 5),
                                            zeroLineWidth: myMdwHelper.getNumberFromData(data.xAxisZeroLineWidth, 1),
                                            zeroLineColor: myMdwHelper.getValueFromData(data.xAxisZeroLineColor, 'rgba(0, 0, 0, 0.25)'),
                                            offsetGridLines: myMdwHelper.getBooleanFromData(data.xAxisOffsetGridLines, false),
                                        }
                                    }],
                                    yAxes: myYAxis,
                                },
                                tooltips: {
                                    mode: 'nearest',
                                    enabled: data.showTooltip,
                                    backgroundColor: myMdwHelper.getValueFromData(data.tooltipBackgroundColor, 'black'),
                                    caretSize: myMdwHelper.getNumberFromData(data.tooltipArrowSize, 5),
                                    caretPadding: myMdwHelper.getNumberFromData(data.tooltipDistanceToBar, 2),
                                    cornerRadius: myMdwHelper.getNumberFromData(data.tooltipBoxRadius, 4),
                                    displayColors: data.tooltipShowColorBox,
                                    xPadding: myMdwHelper.getNumberFromData(data.tooltipXpadding, 10),
                                    yPadding: myMdwHelper.getNumberFromData(data.tooltipYpadding, 10),
                                    titleFontColor: myMdwHelper.getValueFromData(data.tooltipTitleFontColor, 'white'),
                                    titleFontFamily: myMdwHelper.getValueFromData(data.tooltipTitleFontFamily, undefined),
                                    titleFontSize: myMdwHelper.getNumberFromData(data.tooltipTitleFontSize, undefined),
                                    titleMarginBottom: myMdwHelper.getNumberFromData(data.tooltipTitleMarginBottom, 6),
                                    bodyFontColor: myMdwHelper.getValueFromData(data.tooltipBodyFontColor, 'white'),
                                    bodyFontFamily: myMdwHelper.getValueFromData(data.tooltipBodyFontFamily, undefined),
                                    bodyFontSize: myMdwHelper.getNumberFromData(data.tooltipBodyFontSize, undefined),
                                    callbacks: {
                                        title: function (tooltipItem, chart) {

                                            let datasetIndex = tooltipItem[0].datasetIndex;

                                            let index = tooltipItem[0].index;
                                            let metaIndex = Object.keys(chart.datasets[datasetIndex]._meta)[0];
                                            let currentUnit = chart.datasets[datasetIndex]._meta[metaIndex].controller._xScale._unit;
                                            let timestamp = moment(chart.datasets[datasetIndex].data[index].t);

                                            let timeFormats = (myMdwHelper.getValueFromData(data.tooltipTimeFormats, null) !== null) ? JSON.parse(data.tooltipTimeFormats) : myChartHelper.defaultToolTipTimeFormats();

                                            return timestamp.format(timeFormats[currentUnit]);
                                        },
                                        label: function (tooltipItem, chart) {


                                            if (tooltipItem && tooltipItem.value) {
                                                return `${chart.datasets[tooltipItem.datasetIndex].label}: ${myMdwHelper.formatNumber(tooltipItem.value, data.tooltipValueMinDecimals, data.tooltipValueMaxDecimals)}${myMdwHelper.getValueFromData(data.tooltipBodyAppend, '')}`
                                                    .split('\\n');
                                            }
                                            return '';
                                        }
                                    }
                                }
                            };

                            if (data.disableHoverEffects) options.hover = { mode: null };

                            if (debug) console.log(`[Line History Chart ${data.wid}] chart creating...`);

                            if (errorsOnDataLoading.length > 0) {
                                options.title = {
                                    display: true,
                                    text: `Error: ${errorsOnDataLoading.join(', ')}`,
                                    fontColor: 'red'
                                };
                            }

                            // Chart declaration:
                            myChart = new Chart(ctx, {
                                type: 'line',
                                data: chartData,
                                options: options,
                                plugins: [ChartDataLabels]     // show value labels
                            });

                            progressBar.hide();

                            if (debug) console.log(`[Line History Chart ${data.wid}] chart successful created`);
                        });
                    }
                }

                function onChange(e, newVal, oldVal) {
                    try {
                        // value or timeinterval changed
                        if (e && e.type && !e.type.includes(data.manualRefreshTrigger) && !e.type.includes(data.time_interval_oid)) {
                            if (debug) console.log(`[Line History Chart ${data.wid}] ************************************************************** onChange - Data changed **************************************************************`);
                            if (debug) console.log(`[Line History Chart ${data.wid}] data changed for '${e.type}'`);
                        }

                        let needsChange = true

                        if (e && e.type && e.type.includes(data.manualRefreshTrigger)) {
                            // oid - manuell refresh trigger
                            if (moment(newVal).diff(moment(oldVal)) < 2000) {
                                if (debug) console.log(`[Line History Chart ${data.wid}] trigger '${e.type}' - you have to wait 2 seconds until next refresh!: ${moment(newVal).diff(moment(oldVal))} ms`);
                                needsChange = false;
                            } else {
                                if (debug) console.log(`[Line History Chart ${data.wid}] ************************************************************** onChange - OID Refresh Trigger **************************************************************`);
                                if (debug) console.log(`[Line History Chart ${data.wid}] time diff since last refresh from '${e.type}': ${moment(newVal).diff(moment(oldVal))} ms`);
                            }
                        }

                        if (myChart && needsChange) {
                            progressBar.show();

                            let timeInterval = data.timeIntervalToShow;
                            dataRangeStartTime = new Date().getTime() - myChartHelper.intervals[timeInterval];

                            if (myMdwHelper.getValueFromData(data.time_interval_oid, null) !== null) {
                                let val = vis.states.attr(data.time_interval_oid + '.val');

                                if (e && e.type && e.type.includes(data.time_interval_oid)) {
                                    if (debug) console.log(`[Line History Chart ${data.wid}] ************************************************************** onChange - OID TimeInterval **************************************************************`);
                                    if (debug) console.log(`[Line History Chart ${data.wid}] time interval changed by '${data.time_interval_oid}' to: ${val}`);
                                }

                                if (typeof (val) === 'string' && myChartHelper.intervals[val] !== undefined) {
                                    dataRangeStartTime = new Date().getTime() - myChartHelper.intervals[val]
                                    timeInterval = vis.states.attr(data.time_interval_oid + '.val');
                                } else {
                                    dataRangeStartTime = val;
                                }
                            }

                            let operations = [];
                            for (var i = 0; i <= data.dataCount; i++) {
                                if (myMdwHelper.getValueFromData(data.attr('oid' + i), null) !== null) {
                                    operations.push(myChartHelper.getTaskForHistoryData(data.attr('oid' + i), data, dataRangeStartTime, debug))
                                }
                            }

                            Promise.all(operations).then((result) => {
                                // execute all db queries -> getting all needed data at same time
                                if (debug) console.log(`[Line History Chart ${data.wid}] promise all datasets - count: ${result.length}`);

                                errorsOnDataLoading = []
                                for (var i = 0; i <= result.length - 1; i++) {
                                    let dataArray = myChartHelper.getPreparedData(result[i], data, i, debug);

                                    myChart.data.datasets[i].data = dataArray;

                                    if (result[i].error) {
                                        errorsOnDataLoading.push(`[${i}] ${result[i].error}`);
                                    }
                                }

                                if (errorsOnDataLoading.length > 0) {
                                    myChart.options.title = {
                                        display: true,
                                        text: `Error: ${errorsOnDataLoading.join(', ')}`,
                                        fontColor: 'red'
                                    };
                                } else {
                                    myChart.options.title = {
                                        display: false
                                    };
                                }

                                if (debug) console.log(`[Line History Chart ${data.wid}] chart updating...`);
                                myChart.update();

                                progressBar.hide();
                                if (debug) console.log(`[Line History Chart ${data.wid}] chart successful updated`);

                            });
                        }
                    } catch (onChangeError) {
                        console.error(`[Line History Chart ${data.wid}] onChange error: ${onChangeError.message}, stack: ${onChangeError.stack}`);
                    }
                };
            }, 1)
        } catch (ex) {
            console.error(`[Line History Chart ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    pie: function (el, data) {
        try {
            setTimeout(function () {
                let myChartHelper = vis.binds.materialdesign.chart.helper;
                myChartHelper.registerChartAreaPlugin();

                let $this = $(el);
                var chartContainer = $(el).find('.materialdesign-chart-container').get(0);

                $(el).find('.materialdesign-chart-container').css('background-color', myMdwHelper.getValueFromData(data.backgroundColor, ''));
                let globalColor = myMdwHelper.getValueFromData(data.globalColor, '#44739e');

                let colorScheme = myMdwHelper.getValueFromData(data.colorScheme, null);
                if (colorScheme !== null) {
                    colorScheme = vis.binds.materialdesign.colorScheme.get(data.colorScheme, data.dataCount);
                }

                if (chartContainer !== undefined && chartContainer !== null && chartContainer !== '') {
                    var ctx = chartContainer.getContext('2d');

                    // Global Options:
                    Chart.defaults.global.defaultFontColor = '#44739e';
                    Chart.defaults.global.defaultFontSize = 15;
                    Chart.defaults.global.animation.duration = myMdwHelper.getNumberFromData(data.animationDuration, 1000);

                    Chart.plugins.unregister(ChartDataLabels);

                    // Chart declaration:
                    var myPieChart = new Chart(ctx, {
                        type: (data.chartType === 'pie') ? 'pie' : 'doughnut',
                        plugins: (data.showValues) ? [ChartDataLabels] : undefined     // show value labels
                    });

                    let dataArray = []
                    let labelArray = [];
                    let dataColorArray = [];
                    let hoverDataColorArray = [];
                    let globalValueTextColor = myMdwHelper.getValueFromData(data.valuesFontColor, 'black')
                    let valueTextColorArray = [];
                    let countOfItems = 0;
                    let jsonData = null;

                    if (data.chartDataMethod === 'jsonStringObject') {
                        try {
                            jsonData = JSON.parse(vis.states.attr(data.oid + '.val'));
                            countOfItems = jsonData.length - 1;
                        } catch (jsonError) {
                            myPieChart.options.title = {
                                display: true,
                                text: `${_("Error in JSON string")}<br>${jsonError.message}`.split('<br>'),
                                fontColor: 'red'
                            };
                            myPieChart.update();

                            console.error(`[Pie Chart ${data.wid}] cannot parse json string! Error: ${jsonError.message}`);
                        }

                        vis.states.bind(data.oid + '.val', onChange);
                    } else {
                        countOfItems = data.dataCount;
                    }

                    for (var i = 0; i <= countOfItems; i++) {
                        // row data
                        if (colorScheme !== null) {
                            globalColor = colorScheme[i];
                        }

                        let pieItem = getBarItemObj(i, data, jsonData, globalColor, globalValueTextColor);

                        dataArray.push(pieItem.value);
                        labelArray.push(pieItem.label);

                        dataColorArray.push(pieItem.dataColor);

                        if (myMdwHelper.getValueFromData(data.hoverColor, null) === null) {
                            hoverDataColorArray.push(myChartHelper.addOpacityToColor(pieItem.dataColor, 80))
                        } else {
                            hoverDataColorArray.push(data.hoverColor)
                        }

                        valueTextColorArray.push(pieItem.valueColor);

                        vis.states.bind(data.attr('oid' + i) + '.val', onChange);
                    }

                    // Data with datasets options
                    var chartData = {
                        labels: labelArray,
                        datasets: [
                            Object.assign(myChartHelper.getDataset(dataArray, dataColorArray, hoverDataColorArray, data.borderColor, data.hoverBorderColor, data.borderWidth, data.hoverBorderWidth),
                                {
                                    // chart specific properties
                                    borderAlign: 'inner',
                                }
                            )
                        ]
                    };

                    // Notice how nested the beginAtZero is
                    var options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: myChartHelper.getLayout(data),
                        legend: myChartHelper.getLegend(data),
                        cutoutPercentage: (data.chartType === 'doughnut') ? myMdwHelper.getNumberFromData(data.doughnutCutOut, 50) : 0,
                        chartArea: {
                            backgroundColor: myMdwHelper.getValueFromData(data.chartAreaBackgroundColor, ''),
                        },
                        tooltips: {
                            enabled: data.showTooltip,
                            backgroundColor: myMdwHelper.getValueFromData(data.tooltipBackgroundColor, 'black'),
                            caretSize: myMdwHelper.getNumberFromData(data.tooltipArrowSize, 5),
                            caretPadding: myMdwHelper.getNumberFromData(data.tooltipDistanceToBar, 2),
                            cornerRadius: myMdwHelper.getNumberFromData(data.tooltipBoxRadius, 4),
                            displayColors: data.tooltipShowColorBox,
                            xPadding: myMdwHelper.getNumberFromData(data.tooltipXpadding, 10),
                            yPadding: myMdwHelper.getNumberFromData(data.tooltipYpadding, 10),
                            titleFontColor: myMdwHelper.getValueFromData(data.tooltipTitleFontColor, 'white'),
                            titleFontFamily: myMdwHelper.getValueFromData(data.tooltipTitleFontFamily, undefined),
                            titleFontSize: myMdwHelper.getNumberFromData(data.tooltipTitleFontSize, undefined),
                            titleMarginBottom: myMdwHelper.getNumberFromData(data.tooltipTitleMarginBottom, 6),
                            bodyFontColor: myMdwHelper.getValueFromData(data.tooltipBodyFontColor, 'white'),
                            bodyFontFamily: myMdwHelper.getValueFromData(data.tooltipBodyFontFamily, undefined),
                            bodyFontSize: myMdwHelper.getNumberFromData(data.tooltipBodyFontSize, undefined),
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    if (tooltipItem) {
                                        return `${labelArray[tooltipItem.index]}: ${myMdwHelper.formatNumber(chart.datasets[0].data[tooltipItem.index], data.tooltipValueMinDecimals, data.tooltipValueMaxDecimals)}${myMdwHelper.getValueFromData(data.tooltipBodyAppend, '')}`
                                            .split('\\n');
                                    }
                                    return '';
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: myMdwHelper.getValueFromData(data.showValues, 'showValuesOn') === 'showValuesOn' ? true : data.showValues === 'showValuesOff' ? false : 'auto',
                                anchor: data.valuesPositionAnchor,
                                align: data.valuesPositionAlign,
                                clamp: true,
                                offset: myMdwHelper.getNumberFromData(data.valuesPositionOffset, 0),
                                rotation: myMdwHelper.getNumberFromData(data.valuesRotation, undefined),
                                formatter: function (value, context) {
                                    if ((value || value === 0) && context.dataIndex % myMdwHelper.getNumberFromData(data.valuesSteps, 1) === 0) {
                                        let pieItem = getBarItemObj(context.dataIndex, data, jsonData, globalColor, globalValueTextColor, value);

                                        return `${pieItem.valueText}${pieItem.valueAppendix}`.split('\\n');
                                    }
                                    return null;
                                },
                                font: {
                                    family: myMdwHelper.getValueFromData(data.valuesFontFamily, undefined),
                                    size: myMdwHelper.getNumberFromData(data.valuesFontSize, undefined),
                                },
                                color: valueTextColorArray,
                                textAlign: data.valuesTextAlign
                            }
                        }
                    };

                    if (data.disableHoverEffects) options.hover = { mode: null };

                    // Chart declaration:
                    myPieChart = new Chart(ctx, {
                        type: (data.chartType === 'pie') ? 'pie' : 'doughnut',
                        data: chartData,
                        options: options,
                        plugins: [ChartDataLabels]
                    });

                    myPieChart.update();

                    function onChange(e, newVal, oldVal) {
                        // i wird nicht gespeichert -> umweg über oid gehen, um index zu erhalten
                        if (data.chartDataMethod === 'inputPerEditor') {
                            let oidId = e.type.substr(0, e.type.lastIndexOf("."));

                            for (var d = 0; d <= data.dataCount; d++) {
                                if (oidId === data.attr('oid' + d)) {
                                    let index = d;
                                    myPieChart.data.datasets[0].data[index] = newVal;
                                    myPieChart.update();
                                }
                            }
                        } else {
                            try {
                                let jsonData = JSON.parse(newVal);

                                for (var d = 0; d <= jsonData.length - 1; d++) {
                                    if (colorScheme !== null) {
                                        globalColor = colorScheme[d];
                                    }

                                    let barItem = getBarItemObj(d, data, jsonData, globalColor, globalValueTextColor);

                                    myPieChart.data.datasets[0].data[d] = barItem.value;
                                    myPieChart.data.datasets[0].backgroundColor[d] = barItem.dataColor;
                                    myPieChart.data.labels[d] = barItem.label;

                                    if (myMdwHelper.getValueFromData(data.hoverColor, null) === null) {
                                        myPieChart.data.datasets[0].hoverBackgroundColor[d] = myChartHelper.addOpacityToColor(barItem.dataColor, 80);
                                    } else {
                                        myPieChart.data.datasets[0].hoverBackgroundColor[d] = data.hoverColor;
                                    }

                                    myPieChart.options.plugins.datalabels.color[d] = barItem.valueColor;

                                    myPieChart.options.plugins.datalabels.formatter = function (value, context) {
                                        if (value) {
                                            let barItem = getBarItemObj(context.dataIndex, data, jsonData, globalColor, globalValueTextColor, value);
                                            return `${barItem.valueText}${barItem.valueAppendix}`.split('\\n');
                                        }
                                        return '';
                                    }
                                }
                                myPieChart.update();
                            } catch (jsonError) {
                                myPieChart.options.title = {
                                    display: true,
                                    text: `${_("Error in JSON string")}<br>${jsonError.message}`.split('<br>'),
                                    fontColor: 'red'
                                };
                                myPieChart.update();

                                console.error(`[Pie Chart ${data.wid}] onChange: cannot parse json string! Error: ${jsonError.message}`);
                            }
                        }
                    };

                    function getBarItemObj(i, data, jsonData, globalColor, globalValueTextColor, value = 0) {
                        if (data.chartDataMethod === 'inputPerEditor') {
                            return {
                                label: myMdwHelper.getValueFromData(data.attr('label' + i), ''),
                                value: vis.states.attr(data.attr('oid' + i) + '.val'),
                                dataColor: myMdwHelper.getValueFromData(data.attr('dataColor' + i), globalColor),
                                valueText: myMdwHelper.getValueFromData(data.attr('valueText' + i), `${myMdwHelper.formatNumber(parseFloat(value), data.valuesMinDecimals, data.valuesMaxDecimals)}${myMdwHelper.getValueFromData(data.valuesAppendText, '')}`),
                                valueColor: myMdwHelper.getValueFromData(data.attr('valueTextColor' + i), globalValueTextColor),
                                valueAppendix: myMdwHelper.getValueFromData(data.attr('labelValueAppend' + i), '')
                            }
                        } else {
                            return {
                                label: myMdwHelper.getValueFromData(jsonData[i].label, ''),
                                value: jsonData[i].value,
                                dataColor: myMdwHelper.getValueFromData(jsonData[i].dataColor, globalColor),
                                valueText: myMdwHelper.getValueFromData(jsonData[i].valueText, `${myMdwHelper.formatNumber(parseFloat(value), data.valuesMinDecimals, data.valuesMaxDecimals)}${myMdwHelper.getValueFromData(data.valuesAppendText, '')}`),
                                valueColor: myMdwHelper.getValueFromData(jsonData[i].valueColor, globalValueTextColor),
                                valueAppendix: myMdwHelper.getValueFromData(jsonData[i].valueAppendix, '')
                            }
                        }
                    }
                }
            }, 1)
        } catch (ex) {
            console.error(`[Pie Chart ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    json: function (el, data) {
        try {
            let debug = myMdwHelper.getBooleanFromData(data.mdwDebug, false);
            if (debug) console.log(`[JSON Chart ${data.wid}] widget setting: ${JSON.stringify(data)}`);

            setTimeout(function () {
                let myChartHelper = vis.binds.materialdesign.chart.helper;
                myChartHelper.registerChartAreaPlugin();

                let $this = $(el);
                var chartContainer = $this.find('.materialdesign-chart-container').get(0);

                var progressBar = $this.find('.material-progress-circular-container');
                progressBar.show();

                $this.find('.materialdesign-chart-container').css('background-color', myMdwHelper.getValueFromData(data.backgroundColor, ''));

                if (chartContainer !== undefined && chartContainer !== null && chartContainer !== '') {
                    var ctx = chartContainer.getContext('2d');

                    // intialize chart -> some parameters needed
                    var myChart = new Chart(ctx, {
                        type: myMdwHelper.getValueFromData(data.chartType, 'bar'),
                        plugins: [ChartDataLabels, myChartHelper.getMyGradientPlugin(data)]     // show value labels
                    });

                    // Global Options:
                    Chart.defaults.global.defaultFontColor = '#44739e';
                    Chart.defaults.global.defaultFontSize = 15;
                    Chart.defaults.global.animation.duration = myMdwHelper.getNumberFromData(data.animationDuration, 1000);

                    Chart.plugins.unregister(ChartDataLabels);

                    if (vis.states.attr(data.oid + '.val') && vis.states.attr(data.oid + '.val') !== 'null') {
                        let mydata = getDataFromJson(vis.states.attr(data.oid + '.val'));

                        if (debug) console.log(`[JSON Chart ${data.wid}] mydata: ${JSON.stringify(mydata)}`);

                        myChart.type = myMdwHelper.getValueFromData(data.chartType, 'bar');
                        myChart.data.labels = mydata.labels;
                        myChart.data.datasets = mydata.datasets;
                        myChart.options = mydata.options;
                        myChart.update();
                        progressBar.hide();

                        vis.states.bind(data.oid + '.val', onChange);
                    } else {
                        myChart.options.title = {
                            display: true,
                            text: `${_("datapoint '{0}' not exist!").replace('{0}', data.oid)}`,
                            fontColor: 'red'
                        };
                        myChart.update();
                        progressBar.hide();

                        console.error(`[JSON Chart ${data.wid}] ${_("datapoint '{0}' not exist!").replace('{0}', data.oid)}`);
                    }

                    function getDataFromJson(oidVal) {
                        let myDatasets = [];
                        let myXAxis = [];
                        let myYAxis = [];
                        let timeAxisSettings = {};
                        let labels = []
                        let options = {}

                        let globalColor = myMdwHelper.getValueFromData(data.globalColor, '#44739e');

                        let jsonData = undefined
                        try {
                            jsonData = JSON.parse(oidVal);
                            if (debug) console.log(`[JSON Chart ${data.wid}] json: ${JSON.stringify(jsonData)}`);
                        } catch (jsonError) {
                            options = {
                                title: {
                                    display: true,
                                    text: `${_("Error in JSON string")}<br>${jsonError.message}`.split('<br>'),
                                    fontColor: 'red'
                                }
                            };
                            console.error(`[JSON Chart ${data.wid}] cannot parse json string! Error: ${jsonError.message}`);
                            return { labels: [], datasets: [], options: options }
                        }

                        if (jsonData && Object.keys(jsonData).length > 0) {

                            labels = (jsonData.axisLabels) ? jsonData.axisLabels : [];

                            let colorScheme = myMdwHelper.getValueFromData(data.colorScheme, null);
                            if (colorScheme !== null) {
                                colorScheme = vis.binds.materialdesign.colorScheme.get(data.colorScheme, data.dataCount);
                            }

                            for (const i of Object.keys(jsonData.graphs)) {
                                let graph = jsonData.graphs[i];
                                let isTimeAxis = false;

                                if (debug) console.log(`[JSON Chart ${data.wid}] graph[${i}]: ${JSON.stringify(graph)}`);

                                if (graph) {
                                    let graphColor = myMdwHelper.getValueFromData(graph.color, (colorScheme) ? myMdwHelper.getValueFromData(colorScheme[i], globalColor) : globalColor);

                                    let fillColor = myChartHelper.addOpacityToColor(graphColor, 20);
                                    if (myMdwHelper.getValueFromData(graph.line_FillColor, null) !== null) {
                                        fillColor = chroma(graph.line_FillColor).css();
                                    }

                                    let barColorHover = myChartHelper.addOpacityToColor(graphColor, 80);
                                    if (myMdwHelper.getValueFromData(graph.barColorHover, null) !== null) {
                                        barColorHover = graph.barColorHover;
                                    }

                                    if (graph.data && graph.data.length > 0) {
                                        if (typeof (graph.data[0]) === 'object') {
                                            isTimeAxis = true;
                                            if (debug) console.log(`[JSON Chart ${data.wid}] graph[${i}].data is data object -> using time axis`);
                                        }
                                    }

                                    if (graph.data) {
                                        if (debug) console.log(`[JSON Chart ${data.wid}] graph[${i}].data length: ${graph.data.length}`);

                                        let graphObj = {
                                            data: isTimeAxis ? graph.data : graph.data.map(Number, null),
                                            label: graph.legendText,
                                            type: graph.type,
                                            order: myMdwHelper.getNumberFromData(graph.displayOrder, i),
                                            yAxisID: `yAxis_id_${myMdwHelper.getNumberFromData(graph.yAxis_id, i)}`,
                                            datalabels: {
                                                // Plugin datalabels
                                                display: graph.datalabel_show && graph.datalabel_show.toString() === 'auto' ? 'auto' : myMdwHelper.getBooleanFromData(graph.datalabel_show, true) === false ? false : true,
                                                anchor: myMdwHelper.getValueFromData(graph.datalabel_anchor, 'end'),
                                                align: myMdwHelper.getValueFromData(graph.datalabel_align, 'top'),
                                                textAlign: myMdwHelper.getValueFromData(graph.datalabel_text_align, 'center'),
                                                offset: myMdwHelper.getNumberFromData(graph.datalabel_offset, 0),
                                                clamp: true,
                                                rotation: myMdwHelper.getNumberFromData(graph.datalabel_rotation, undefined),
                                                formatter: function (value, context) {
                                                    if (!isTimeAxis) {
                                                        if ((value || value === 0) && context.dataIndex % myMdwHelper.getNumberFromData(graph.datalabel_steps, 1) === 0) {
                                                            return `${myMdwHelper.formatNumber(value, graph.datalabel_minDigits, graph.datalabel_maxDigits)}${myMdwHelper.getValueFromData(graph.datalabel_append, '')}`
                                                                .split('\\n');
                                                        }
                                                    } else {
                                                        if ((value.y || value.y === 0) && context.dataIndex % myMdwHelper.getNumberFromData(graph.datalabel_steps, 1) === 0) {
                                                            return `${myMdwHelper.formatNumber(value.y, graph.datalabel_minDigits, graph.datalabel_maxDigits)}${myMdwHelper.getValueFromData(graph.datalabel_append, '')}`
                                                                .split('\\n');
                                                        }
                                                    }
                                                    return null;
                                                },
                                                font: {
                                                    family: myMdwHelper.getValueFromData(graph.datalabel_fontFamily, undefined),
                                                    size: myMdwHelper.getNumberFromData(graph.datalabel_fontSize, undefined),
                                                },
                                                color: myMdwHelper.getValueFromData(graph.datalabel_color, graphColor),
                                                backgroundColor: myMdwHelper.getValueFromData(graph.datalabel_backgroundColor, undefined),
                                                borderColor: myMdwHelper.getValueFromData(graph.datalabel_borderColor, undefined),
                                                borderWidth: myMdwHelper.getNumberFromData(graph.datalabel_borderWidth, 0),
                                                borderRadius: myMdwHelper.getNumberFromData(graph.datalabel_borderRadius, 0),
                                            },
                                            myGradientColors: {
                                                useGradientColor: myMdwHelper.getBooleanFromData(graph.use_gradient_color, false),
                                                gradientColors: myMdwHelper.getBooleanFromData(graph.use_gradient_color, false) ? myMdwHelper.getValueFromData(graph.gradient_color, undefined) : graphColor,
                                                useGradientFillColor: myMdwHelper.getBooleanFromData(graph.use_line_gradient_fill_color, false),
                                                gradientFillColors: myMdwHelper.getBooleanFromData(graph.use_line_gradient_fill_color, false) ? myMdwHelper.getValueFromData(graph.line_gradient_fill_color, undefined) : (graph.type === 'line') ? fillColor : barColorHover,
                                            }
                                        }

                                        if (graph.type && graph.type === 'line') {
                                            // line graph
                                            let fillBetweenLines = myMdwHelper.getValueFromData(graph.line_FillBetweenLines, undefined);

                                            Object.assign(graphObj,
                                                {
                                                    // line graph specific properties
                                                    borderColor: graphColor,

                                                    // JSON Daten
                                                    pointStyle: myMdwHelper.getValueFromData(graph.line_pointStyle, 'circle'),
                                                    pointRadius: myMdwHelper.getNumberFromData(graph.line_pointSize, 3),
                                                    pointHoverRadius: myMdwHelper.getNumberFromData(graph.line_pointSizeHover, 4),

                                                    pointBackgroundColor: myMdwHelper.getValueFromData(graph.line_PointColor, graphColor),
                                                    pointBorderColor: myMdwHelper.getValueFromData(graph.line_PointColorBorder, graphColor),
                                                    pointHoverBackgroundColor: myMdwHelper.getValueFromData(graph.line_PointColorHover, graphColor),
                                                    pointHoverBorderColor: myMdwHelper.getValueFromData(graph.line_PointColorBorderHover, graphColor),
                                                    spanGaps: myMdwHelper.getBooleanFromData(graph.line_spanGaps, true),
                                                    lineTension: myMdwHelper.getNumberFromData(graph.line_Tension, 0.4),
                                                    borderWidth: myMdwHelper.getNumberFromData(graph.line_Thickness, 2),
                                                    fill: fillBetweenLines ? fillBetweenLines : myMdwHelper.getBooleanFromData(graph.line_UseFillColor, false) || myMdwHelper.getBooleanFromData(graph.use_line_gradient_fill_color, false),
                                                    backgroundColor: fillColor,
                                                }
                                            )
                                        } else {
                                            // bar graph
                                            Object.assign(graphObj,
                                                {
                                                    // bar chart specific properties
                                                    backgroundColor: graphColor,
                                                    hoverBackgroundColor: barColorHover,

                                                    // JSON Daten
                                                    borderColor: myMdwHelper.getValueFromData(graph.barBorderColor, 'white'),
                                                    borderWidth: myMdwHelper.getNumberFromData(graph.barBorderWidth, undefined),
                                                    hoverBorderColor: myMdwHelper.getValueFromData(graph.barBorderColorHover, undefined),
                                                    hoverBorderWidth: myMdwHelper.getNumberFromData(graph.barBorderWidthHover, undefined),
                                                    stack: myMdwHelper.getNumberFromData(graph.barStackId, (myMdwHelper.getBooleanFromData(graph.barIsStacked, false)) ? 0 : 5000),

                                                    // Editor Daten
                                                    categoryPercentage: myMdwHelper.getNumberFromData(data.barWidth, 80) / 100,
                                                    barPercentage: myMdwHelper.getNumberFromData(data.barWidth, 80) / 100,
                                                }
                                            )
                                        }

                                        myDatasets.push(graphObj);

                                        myYAxis.push(
                                            {
                                                id: `yAxis_id_${myMdwHelper.getNumberFromData(graph.yAxis_id, i)}`,
                                                type: 'linear',
                                                position: myMdwHelper.getValueFromData(graph.yAxis_position, 'left'),
                                                display: myMdwHelper.getBooleanFromData(graph.yAxis_show, true),
                                                stacked: myMdwHelper.getBooleanFromData(graph.barIsStacked, false),
                                                scaleLabel: {       // y-Axis title
                                                    display: myMdwHelper.getValueFromData(graph.yAxis_title_text, '') !== '' ? true : false,
                                                    labelString: myMdwHelper.getValueFromData(graph.yAxis_title_text, ''),
                                                    fontColor: myMdwHelper.getValueFromData(graph.yAxis_title_color, myMdwHelper.getValueFromData(data.yAxisTitleColor, undefined)),
                                                    fontFamily: myMdwHelper.getValueFromData(graph.yAxis_title_fontFamily, myMdwHelper.getValueFromData(data.yAxisTitleFontFamily, undefined)),
                                                    fontSize: myMdwHelper.getNumberFromData(graph.yAxis_title_fontSize, myMdwHelper.getNumberFromData(data.yAxisTitleFontSize, undefined))
                                                },
                                                ticks: {
                                                    min: myMdwHelper.getNumberFromData(graph.yAxis_min, undefined),
                                                    max: myMdwHelper.getNumberFromData(graph.yAxis_max, undefined),
                                                    stepSize: myMdwHelper.getNumberFromData(graph.yAxis_step, undefined),
                                                    autoSkip: true,
                                                    maxTicksLimit: myMdwHelper.getNumberFromData(graph.yAxis_maxSteps, undefined),
                                                    fontColor: myMdwHelper.getValueFromData(graph.yAxis_color, myMdwHelper.getValueFromData(data.yAxisValueLabelColor, undefined)),
                                                    fontFamily: myMdwHelper.getValueFromData(graph.yAxis_fontFamily, myMdwHelper.getValueFromData(data.yAxisValueFontFamily, undefined)),
                                                    fontSize: myMdwHelper.getNumberFromData(graph.yAxis_fontSize, myMdwHelper.getNumberFromData(data.yAxisValueFontSize, undefined)),
                                                    padding: myMdwHelper.getNumberFromData(graph.yAxis_distance, myMdwHelper.getNumberFromData(data.yAxisValueDistanceToAxis, 0)),
                                                    callback: function (value, index, values) {
                                                        let axisId = this.id.replace('yAxis_id_', '');
                                                        return `${myMdwHelper.formatNumber(value, jsonData.graphs[axisId].yAxis_minimumDigits, jsonData.graphs[axisId].yAxis_maximumDigits)}${myMdwHelper.getValueFromData(jsonData.graphs[axisId].yAxis_appendix, '')}`.split('\\n');
                                                    }
                                                },
                                                gridLines: {
                                                    display: true,
                                                    color: myMdwHelper.getValueFromData(graph.yAxis_gridLines_color, 'black'),
                                                    lineWidth: myMdwHelper.getNumberFromData(graph.yAxis_gridLines_lineWidth, 0.1),
                                                    drawBorder: myMdwHelper.getBooleanFromData(graph.yAxis_gridLines_border_show, true),
                                                    drawOnChartArea: myMdwHelper.getBooleanFromData(graph.yAxis_gridLines_show, true),
                                                    drawTicks: myMdwHelper.getBooleanFromData(graph.yAxis_gridLines_ticks_show, true),
                                                    tickMarkLength: myMdwHelper.getNumberFromData(graph.yAxis_gridLines_ticks_length, 5),
                                                    zeroLineWidth: myMdwHelper.getNumberFromData(graph.yAxis_zeroLineWidth, 1),
                                                    zeroLineColor: myMdwHelper.getValueFromData(graph.yAxis_zeroLineColor, 'rgba(0, 0, 0, 0.25)'),
                                                }
                                            }
                                        )
                                        timeAxisSettings = {
                                            id: i,
                                            display: (i > 0) ? false : true,
                                            stacked: myMdwHelper.getBooleanFromData(graph.barIsStacked, false)
                                        }

                                        if (isTimeAxis) {
                                            timeAxisSettings = Object.assign(timeAxisSettings,
                                                {
                                                    type: 'time',
                                                    bounds: (graph.xAxis_bounds === 'data') ? 'data' : 'ticks',
                                                    time:
                                                    {
                                                        displayFormats: (graph.xAxis_timeFormats) ? graph.xAxis_timeFormats : myChartHelper.defaultTimeFormats(),
                                                        tooltipFormat: (graph.xAxis_tooltip_timeFormats) ? graph.xAxis_tooltip_timeFormats : 'lll',
                                                    }
                                                }
                                            );
                                        }

                                        myXAxis.push(Object.assign(
                                            myChartHelper.get_X_AxisObject(data.chartType, data.xAxisPosition, data.xAxisTitle, data.xAxisTitleColor, data.xAxisTitleFontFamily, data.xAxisTitleFontSize,
                                                data.xAxisShowAxisLabels, data.axisValueMin, data.axisValueMax, data.axisValueStepSize, data.xAxisMaxLabel, data.axisLabelAutoSkip, data.axisValueAppendText,
                                                data.xAxisValueLabelColor, data.xAxisValueFontFamily, data.xAxisValueFontSize, data.xAxisValueDistanceToAxis, data.xAxisGridLinesColor,
                                                data.xAxisGridLinesWitdh, data.xAxisShowAxis, data.xAxisShowGridLines, data.xAxisShowTicks, data.xAxisTickLength, data.xAxisZeroLineWidth, data.xAxisZeroLineColor, data.xAxisOffsetGridLines, undefined, undefined, data.xAxisMinRotation, data.xAxisMaxRotation),
                                            timeAxisSettings
                                        ));

                                    } else {
                                        console.error(`[JSON Chart ${data.wid}] graph[${i}].data is null! Check json string input!`);
                                    }
                                } else {
                                    console.error(`[JSON Chart ${data.wid}] graph[${i}] is null! Check json string input!`);
                                }
                            }

                            // Notice how nested the beginAtZero is
                            options = {
                                responsive: true,
                                maintainAspectRatio: false,
                                layout: myChartHelper.getLayout(data),
                                hover: myMdwHelper.getBooleanFromData(data.disableHoverEffects, false) ? { mode: null } : { mode: 'nearest' },
                                chartArea: {
                                    backgroundColor: myMdwHelper.getValueFromData(data.chartAreaBackgroundColor, ''),
                                },
                                scales: {
                                    xAxes: myXAxis,
                                    yAxes: myYAxis,
                                },
                                legend: Object.assign(myChartHelper.getLegend(data), myChartHelper.getLegendClickEvent(myYAxis)),
                                tooltips: {
                                    mode: data.tooltipMode,
                                    enabled: data.showTooltip,
                                    backgroundColor: myMdwHelper.getValueFromData(data.tooltipBackgroundColor, 'black'),
                                    caretSize: myMdwHelper.getNumberFromData(data.tooltipArrowSize, 5),
                                    caretPadding: myMdwHelper.getNumberFromData(data.tooltipDistanceToBar, 2),
                                    cornerRadius: myMdwHelper.getNumberFromData(data.tooltipBoxRadius, 4),
                                    displayColors: data.tooltipShowColorBox,
                                    xPadding: myMdwHelper.getNumberFromData(data.tooltipXpadding, 10),
                                    yPadding: myMdwHelper.getNumberFromData(data.tooltipYpadding, 10),
                                    titleFontColor: myMdwHelper.getValueFromData(data.tooltipTitleFontColor, 'white'),
                                    titleFontFamily: myMdwHelper.getValueFromData(data.tooltipTitleFontFamily, undefined),
                                    titleFontSize: myMdwHelper.getNumberFromData(data.tooltipTitleFontSize, undefined),
                                    titleMarginBottom: myMdwHelper.getNumberFromData(data.tooltipTitleMarginBottom, 6),
                                    bodyFontColor: myMdwHelper.getValueFromData(data.tooltipBodyFontColor, 'white'),
                                    bodyFontFamily: myMdwHelper.getValueFromData(data.tooltipBodyFontFamily, undefined),
                                    bodyFontSize: myMdwHelper.getNumberFromData(data.tooltipBodyFontSize, undefined),
                                    callbacks: {
                                        label: function (tooltipItem, chart) {
                                            if (tooltipItem && tooltipItem.value) {
                                                return `${chart.datasets[tooltipItem.datasetIndex].label}: ${myMdwHelper.formatNumber(tooltipItem.value, jsonData.graphs[tooltipItem.datasetIndex].tooltip_MinDigits, jsonData.graphs[tooltipItem.datasetIndex].tooltip_MaxDigits)}${myMdwHelper.getValueFromData(jsonData.graphs[tooltipItem.datasetIndex].tooltip_AppendText, '')}`
                                                    .split('\\n');
                                            }
                                            return '';
                                        }
                                    }
                                },
                            }
                        } else {
                            console.error(`[JSON Chart ${data.wid}] ${_("datapoint '{0}' has no data!").replace('{0}', data.oid)}`);
                        }

                        if (myDatasets.length > 0) {
                            return { labels: labels, datasets: myDatasets, options: options }
                        } else {
                            console.error(`[JSON Chart ${data.wid}] ${_("datapoint '{0}' has no datasets!").replace('{0}', data.oid)}`);
                            return { labels: [], datasets: [], options: [] }
                        }
                    }

                    function onChange(e, newVal, oldVal) {
                        try {
                            if (debug) console.log(`[JSON Chart ${data.wid}] ************************************************************** onChange **************************************************************`);
                            progressBar.show();

                            let changedData = getDataFromJson(newVal);

                            let chartNeedsUpdate = false;

                            if (!myUnderscore.isEqual(myChart.data.labels, changedData.labels)) {
                                if (debug) console.log(`[JSON Chart ${data.wid}] [onChange]: chart 'labels' changed`);
                                myChart.data.labels = changedData.labels;
                                chartNeedsUpdate = true;
                            }

                            let datasetsCounter = changedData.datasets.length;
                            if (myChart.data.datasets.length > datasetsCounter) {
                                datasetsCounter = myChart.data.datasets.length;
                            }

                            for (var i = 0; i <= datasetsCounter - 1; i++) {
                                if (myChart.data.datasets[i] && changedData.datasets[i]) {
                                    // dataset exist in chart and json
                                    if (!myUnderscore.isEqual(myChart.data.datasets[i], changedData.datasets[i])) {
                                        for (var prop in changedData.datasets[i]) {
                                            // check only if prop has changed, so chart will only update the changes
                                            if (!myUnderscore.isEqual(myChart.data.datasets[i][prop], changedData.datasets[i][prop])) {

                                                if (debug) {
                                                    if (!Array.isArray(changedData.datasets[i][prop]) && typeof (changedData.datasets[i][prop]) === 'object') {
                                                        for (var subProp in changedData.datasets[i][prop]) {
                                                            if (!myUnderscore.isEqual(myChart.data.datasets[i][prop][subProp], changedData.datasets[i][prop][subProp])) {
                                                                console.log(`[JSON Chart ${data.wid}] [onChange]: chart graph '${changedData.datasets[i].label} (${i})' '${prop}.${subProp}' changed`);
                                                            }
                                                        }
                                                    } else {
                                                        console.log(`[JSON Chart ${data.wid}] [onChange]: chart graph '${changedData.datasets[i].label} (${i})' '${prop}' changed`);
                                                    }
                                                }

                                                myChart.data.datasets[i][prop] = changedData.datasets[i][prop];
                                                chartNeedsUpdate = true;
                                            }
                                        }
                                    }
                                } else {
                                    if (changedData.datasets[i]) {
                                        // new dataset in json
                                        if (debug) console.log(`[JSON Chart ${data.wid}] [onChange]: chart new graph '${changedData.datasets[i].label} (${i})' added`);

                                        myChart.data.datasets.push(changedData.datasets[i]);
                                        chartNeedsUpdate = true;

                                    } else {
                                        // dataset in json removed
                                        if (debug) console.log(`[JSON Chart ${data.wid}] [onChange]: chart graph '${myChart.data.datasets[i].label} (${i})' removed`);

                                        myChart.data.datasets.splice(i);
                                        chartNeedsUpdate = true;
                                    }
                                }
                            }

                            if (!myUnderscore.isEqual(myChart.options, changedData.options)) {
                                for (var prop in changedData.options) {
                                    if (!myUnderscore.isEqual(myChart.options[prop], changedData.options[prop])) {

                                        if (debug) {
                                            if (!Array.isArray(changedData.options[prop]) && typeof (changedData.options[prop]) === 'object') {
                                                for (var subProp in changedData.options[prop]) {
                                                    if (!myUnderscore.isEqual(myChart.options[prop][subProp], changedData.options[prop][subProp])) {
                                                        console.log(`[JSON Chart ${data.wid}] [onChange]: chart option '${prop}.${subProp}' changed`);
                                                    }
                                                }
                                            } else {
                                                console.log(`[JSON Chart ${data.wid}] [onChange]: chart option '${prop}' changed`);
                                            }
                                        }

                                        myChart.options[prop] = changedData.options[prop];
                                        chartNeedsUpdate = true;
                                    }
                                }
                            }

                            if (chartNeedsUpdate) {
                                if (debug) console.log(`[JSON Chart ${data.wid}] [onChange]: chart updated`);

                                myChart.update();
                                progressBar.hide();
                            }
                        } catch (err) {
                            console.error(`[JSON Chart ${data.wid}] [onChange] error: ${err.message}, stack: ${err.stack}`);
                        }
                    }
                }
            }, 1);
        } catch (ex) {
            console.error(`[JSON Chart ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
        }
    }
};


vis.binds.materialdesign.chart.helper = {
    // TODO: chromaJS verwenden
    addOpacityToColor: function (color, opacity) {
        return chroma(color).alpha(opacity / 100).hex();
    },
    get_Y_AxisObject: function (chartType, yAxisPosition, yAxisTitle, yAxisTitleColor, yAxisTitleFontFamily, yAxisTitleFontSize, yAxisShowAxisLabels, axisValueMin,
        axisValueMax, axisValueStepSize, axisMaxLabel, axisLabelAutoSkip, axisValueAppendText, yAxisValueLabelColor, yAxisValueFontFamily, yAxisValueFontSize,
        yAxisValueDistanceToAxis, yAxisGridLinesColor, yAxisGridLinesWitdh, yAxisShowAxis, yAxisShowGridLines, yAxisShowTicks, yAxisTickLength, yAxisZeroLineWidth, yAxisZeroLineColor, axisValueMinDigits, axisValueMaxDigits) {
        return {
            position: yAxisPosition,
            scaleLabel: {       // y-Axis title
                display: (myMdwHelper.getValueFromData(yAxisTitle, null) !== null),
                labelString: myMdwHelper.getValueFromData(yAxisTitle, ''),
                fontColor: myMdwHelper.getValueFromData(yAxisTitleColor, undefined),
                fontFamily: myMdwHelper.getValueFromData(yAxisTitleFontFamily, undefined),
                fontSize: myMdwHelper.getNumberFromData(yAxisTitleFontSize, undefined)
            },
            ticks: {        // y-Axis values
                display: yAxisShowAxisLabels,
                min: myMdwHelper.getNumberFromData(axisValueMin, undefined),                       // only for chartType: vertical
                max: myMdwHelper.getNumberFromData(axisValueMax, undefined),                       // only for chartType: vertical
                stepSize: myMdwHelper.getNumberFromData(axisValueStepSize, undefined),             // only for chartType: vertical
                autoSkip: (chartType === 'horizontal' && (myMdwHelper.getNumberFromData(axisMaxLabel, undefined) > 0) || myMdwHelper.getBooleanFromData(axisLabelAutoSkip, false)),
                maxTicksLimit: (chartType === 'horizontal') ? myMdwHelper.getNumberFromData(axisMaxLabel, undefined) : undefined,
                callback: function (value, index, values) {
                    return `${myMdwHelper.formatNumber(value, axisValueMinDigits, axisValueMaxDigits)}${myMdwHelper.getValueFromData(axisValueAppendText, '')}`.split('\\n');
                },
                fontColor: myMdwHelper.getValueFromData(yAxisValueLabelColor, undefined),
                fontFamily: myMdwHelper.getValueFromData(yAxisValueFontFamily, undefined),
                fontSize: myMdwHelper.getNumberFromData(yAxisValueFontSize, undefined),
                padding: myMdwHelper.getNumberFromData(yAxisValueDistanceToAxis, 0),
            },
            gridLines: {
                display: true,
                color: myMdwHelper.getValueFromData(yAxisGridLinesColor, 'black'),
                lineWidth: myMdwHelper.getNumberFromData(yAxisGridLinesWitdh, 0.1),
                drawBorder: yAxisShowAxis,
                drawOnChartArea: yAxisShowGridLines,
                drawTicks: yAxisShowTicks,
                tickMarkLength: myMdwHelper.getNumberFromData(yAxisTickLength, 5),
                zeroLineWidth: myMdwHelper.getNumberFromData(yAxisZeroLineWidth, 1),
                zeroLineColor: myMdwHelper.getValueFromData(yAxisZeroLineColor, 'rgba(0, 0, 0, 0.25)'),
            }
        }
    },
    get_X_AxisObject: function (chartType, xAxisPosition, xAxisTitle, xAxisTitleColor, xAxisTitleFontFamily, xAxisTitleFontSize, xAxisShowAxisLabels, axisValueMin, axisValueMax, axisValueStepSize,
        axisMaxLabel, axisLabelAutoSkip, axisValueAppendText, xAxisValueLabelColor, xAxisValueFontFamily, xAxisValueFontSize, xAxisValueDistanceToAxis, xAxisGridLinesColor, xAxisGridLinesWitdh,
        xAxisShowAxis, xAxisShowGridLines, xAxisShowTicks, xAxisTickLength, xAxisZeroLineWidth, xAxisZeroLineColor, xAxisOffsetGridLines, axisValueMinDigits, axisValueMaxDigits, minRotation, maxRotation) {
        return {
            position: xAxisPosition,
            scaleLabel: {       // x-Axis title
                display: (myMdwHelper.getValueFromData(xAxisTitle, null) !== null),
                labelString: myMdwHelper.getValueFromData(xAxisTitle, ''),
                fontColor: myMdwHelper.getValueFromData(xAxisTitleColor, undefined),
                fontFamily: myMdwHelper.getValueFromData(xAxisTitleFontFamily, undefined),
                fontSize: myMdwHelper.getNumberFromData(xAxisTitleFontSize, undefined)
            },
            ticks: {        // x-Axis values
                display: xAxisShowAxisLabels,
                min: myMdwHelper.getNumberFromData(axisValueMin, undefined),                       // only for chartType: horizontal
                max: myMdwHelper.getNumberFromData(axisValueMax, undefined),                       // only for chartType: horizontal
                stepSize: myMdwHelper.getNumberFromData(axisValueStepSize, undefined),             // only for chartType: vertical
                autoSkip: (chartType === 'vertical' && (myMdwHelper.getNumberFromData(axisMaxLabel, undefined) > 0) || myMdwHelper.getBooleanFromData(axisLabelAutoSkip, false)),
                autoSkipPadding: 10,
                minRotation: parseInt(myMdwHelper.getNumberFromData(minRotation, 0)),
                maxRotation: parseInt(myMdwHelper.getNumberFromData(maxRotation, 0)),
                maxTicksLimit: (chartType === 'vertical') ? myMdwHelper.getNumberFromData(axisMaxLabel, undefined) : undefined || myMdwHelper.getNumberFromData(axisMaxLabel, undefined),
                callback: function (value, index, values) {
                    return `${myMdwHelper.formatNumber(value, axisValueMinDigits, axisValueMaxDigits)}${myMdwHelper.getValueFromData(axisValueAppendText, '')}`.split('\\n');
                },
                fontColor: myMdwHelper.getValueFromData(xAxisValueLabelColor, undefined),
                fontFamily: myMdwHelper.getValueFromData(xAxisValueFontFamily, undefined),
                fontSize: myMdwHelper.getNumberFromData(xAxisValueFontSize, undefined),
                padding: myMdwHelper.getNumberFromData(xAxisValueDistanceToAxis, 0),
            },
            gridLines: {
                display: true,
                color: myMdwHelper.getValueFromData(xAxisGridLinesColor, 'black'),
                lineWidth: myMdwHelper.getNumberFromData(xAxisGridLinesWitdh, 0.1),
                drawBorder: xAxisShowAxis,
                drawOnChartArea: xAxisShowGridLines,
                drawTicks: xAxisShowTicks,
                tickMarkLength: myMdwHelper.getNumberFromData(xAxisTickLength, 5),
                zeroLineWidth: myMdwHelper.getNumberFromData(xAxisZeroLineWidth, 1),
                zeroLineColor: myMdwHelper.getValueFromData(xAxisZeroLineColor, 'rgba(0, 0, 0, 0.25)'),
                offsetGridLines: myMdwHelper.getBooleanFromData(xAxisOffsetGridLines, false),
            }
        }
    },
    getDataset: function (dataArray, dataColorArray, hoverDataColorArray, borderColor, hoverBorderColor, borderWidth, hoverBorderWidth) {
        return {
            data: dataArray,

            backgroundColor: dataColorArray,
            hoverBackgroundColor: hoverDataColorArray,

            borderColor: myMdwHelper.getValueFromData(borderColor, 'white'),
            hoverBorderColor: myMdwHelper.getValueFromData(hoverBorderColor, undefined),

            borderWidth: myMdwHelper.getNumberFromData(borderWidth, undefined),
            hoverBorderWidth: myMdwHelper.getNumberFromData(hoverBorderWidth, undefined),
        }
    },
    getLegend: function (data) {
        return {
            display: data.showLegend,
            position: data.legendPosition,
            labels: {
                fontColor: myMdwHelper.getValueFromData(data.legendFontColor, undefined),
                fontFamily: myMdwHelper.getValueFromData(data.legendFontFamily, undefined),
                fontSize: myMdwHelper.getNumberFromData(data.legendFontSize, undefined),
                boxWidth: myMdwHelper.getNumberFromData(data.legendBoxWidth, 10),
                usePointStyle: data.legendPointStyle,
                padding: myMdwHelper.getNumberFromData(data.legendPadding, 10),
                filter: function (item, chart) {
                    // Logic to remove a particular legend item goes here
                    if (item && item.text) {
                        return item.text;
                    }
                }
            }
        }
    },
    getLegendClickEvent: function (myYAxis) {
        return {
            // custom to hide / show also yAxis if data de-/selected
            onClick: function (event, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;
                var meta = ci.getDatasetMeta(index);

                // See controller.isDatasetVisible comment
                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

                // ci.options.scales.yAxes[ci.data.datasets[index].yAxisID.replace('yAxis_id_', '')].display = checkAnyDataIsVisible();
                let visibility = checkAnyDataIsVisible();
                for (var i = 0; i <= ci.options.scales.yAxes.length - 1; i++) {
                    if (ci.options.scales.yAxes[i].id === ci.data.datasets[index].yAxisID && myYAxis[index].display) {
                        ci.options.scales.yAxes[i].display = visibility;
                    }
                }
                ci.update();

                function checkAnyDataIsVisible() {
                    let result = null;
                    for (var i = 0; i <= ci.data.datasets.length - 1; i++) {
                        // Schauen ob yAxis gemeinsam genutzt wird und Daten angezeigt werden -> nur ausblenden wenn alle Daten die gemeinsame Achsen nicht sichtbar sind
                        if (ci.data.datasets[i].yAxisID === ci.data.datasets[index].yAxisID) {
                            result = (ci.getDatasetMeta(i).hidden === null) ? true : false;

                            if (result) {
                                return result;
                            }
                        }
                    }
                    return result;
                }
            }
        }
    },
    getLayout: function (data) {
        return {
            padding: {
                top: myMdwHelper.getValueFromData(data.chartPaddingTop, 0),
                left: myMdwHelper.getValueFromData(data.chartPaddingLeft, 0),
                right: myMdwHelper.getValueFromData(data.chartPaddingRight, 0),
                bottom: myMdwHelper.getValueFromData(data.chartPaddingBottom, 0)
            }
        }
    },
    roundNumber(value, maxDecimals) {
        return +(Math.round(value + "e+" + maxDecimals) + "e-" + maxDecimals);
    },
    intervals: {
        '30 seconds': 30000,
        '1 minute': 60000,
        '2 minutes': 120000,
        '5 minutes': 300000,
        '10 minutes': 600000,
        '30 minutes': 1800000,
        '1 hour': 3600000,
        '2 hours': 7200000,
        '4 hours': 14400000,
        '8 hours': 28800000,
        '12 hours': 43200000,
        '1 day': 86400000,
        '2 days': 172800000,
        '3 days': 259200000,
        '7 days': 604800000,
        '14 days': 1209600000,
        '1 month': 2628000000,
        '2 months': 5256000000,
        '3 months': 7884000000,
        '6 months': 15768000000,
        '1 year': 31536000000,
        '2 years': 63072000000
    },
    defaultTimeFormats: function () {
        return JSON.parse(`
            {
                "millisecond":    "H:mm:ss.SSS",
                "second":         "H:mm:ss",
                "minute":         "H:mm",
                "hour":           "H",
                "day":            "ddd DD.",
                "week":           "ll",
                "month":          "MMM YYYY",
                "quarter":        "[Q]Q - YYYY",
                "year":           "YYYY"
            }
            `);
    },
    defaultToolTipTimeFormats: function () {
        return JSON.parse(`
            {
                "millisecond":    "lll:ss",
                "second":         "lll:ss",
                "minute":         "lll",
                "hour":           "lll",
                "day":            "lll",
                "week":           "lll",
                "month":          "lll",
                "quarter":        "lll",
                "year":           "lll"
            }
            `);
    },
    getTaskForHistoryData: function (id, data, dataRangeStartTime, debug = false) {
        return new Promise((resolve, reject) => {
            try {
                let historyOptions = {
                    instance: data.historyAdapterInstance,
                    count: parseInt(myMdwHelper.getNumberFromData(data.maxDataPoints, (data.aggregate === 'minmax') ? 50 : 100)),
                    step: (myMdwHelper.getNumberFromData(data.minTimeInterval, undefined)) ? parseInt(data.minTimeInterval) * 1000 : undefined,
                    aggregate: data.aggregate || 'average',
                    start: dataRangeStartTime,
                    end: new Date().getTime(),
                    timeout: parseInt(myMdwHelper.getNumberFromData(data.chartTimeout, 2)) * 1000
                }

                if (debug) console.log(`[getTaskForHistoryData ${data.wid}] history options for '${id}': ${JSON.stringify(historyOptions)}`);

                vis.getHistory(id, historyOptions, function (err, result) {
                    if (!err && result) {
                        if (debug) console.log(`[getTaskForHistoryData ${data.wid}] history data result '${id}' length: ${result.length}`);
                        if (debug) console.log(`[getTaskForHistoryData ${data.wid}] history data result '${id}': ${JSON.stringify(result)}`);
                        resolve({ id: id, data: result, error: undefined });
                    } else {
                        if (debug) console.error(`[getTaskForHistoryData ${data.wid}] result error: ${err}`);
                        resolve({ id: id, data: null, error: err });
                    }
                });
            } catch (ex) {
                console.error(`[getTaskForHistoryData ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
                resolve({ id: id, data: null, error: ex.message });
            }
        });
    },
    getPreparedData: function (result, data, index, debug = false) {
        let dataArray = [];
        try {
            if (result.data) {
                if (debug) console.log(`[getPreparedData ${data.wid}] prepare data for '${result.id}' length: ${result.data.length}`);
                dataArray = result.data.map(elm => ({
                    t: (elm.ts !== null && elm.ts !== undefined) ? elm.ts : null,
                    y: (elm.val !== null && elm.val !== undefined) ? elm.val * myMdwHelper.getNumberFromData(data.attr('multiply' + index), 1) : null
                }));
            }
        } catch (ex) {
            console.error(`[getPreparedData ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
        }

        return dataArray;
    },
    registerChartAreaPlugin: function () {
        Chart.pluginService.register({
            beforeDraw: function (chart, easing) {
                if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                    var helpers = Chart.helpers;
                    var ctx = chart.chart.ctx;
                    var chartArea = chart.chartArea;

                    ctx.save();
                    ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                    ctx.restore();
                }
            }
        });
    },
    getMyGradientPlugin(data) {
        const pluginId = "myGradientColors";

        const regenerateGradient = (chart, pluginOpts) => {
            try {
                if (chart.chartArea.bottom && !isNaN(chart.chartArea.bottom) && chart.chartArea.top && !isNaN(chart.chartArea.top)) {
                    const gradient = chart.ctx.createLinearGradient(0, chart.chartArea.bottom, 0, chart.chartArea.top);

                    for (var i = 0; i <= chart.data.datasets.length - 1; i++) {
                        let graph = chart.data.datasets[i];

                        // Line / Bar Color
                        if (graph[pluginId] && graph[pluginId].useGradientColor) {
                            if (graph[pluginId].gradientColors && graph[pluginId].gradientColors.length > 0) {
                                let gradient = getGradient(chart, graph, graph[pluginId].gradientColors);

                                if (graph.type === 'line') {
                                    graph.borderColor = gradient;
                                } else if (graph.type === 'bar') {
                                    graph.backgroundColor = gradient;
                                }
                            }
                        } else {
                            // zurück auf graph color
                            graph.borderColor = graph[pluginId].gradientColors;
                        }

                        // FillColor for Line
                        if (graph.type === 'line') {
                            if (graph[pluginId] && graph[pluginId].useGradientFillColor) {
                                if (graph[pluginId].gradientFillColors && graph[pluginId].gradientFillColors.length > 0) {
                                    let gradientFill = getGradient(chart, graph, graph[pluginId].gradientFillColors);

                                    graph.backgroundColor = gradientFill;
                                }
                            } else {
                                graph.backgroundColor = graph[pluginId].gradientFillColors;
                            }
                        }

                        function getGradient(chart, graph, gradientColors) {
                            const scale = chart.scales[graph.yAxisID];

                            gradientColors.forEach(item => {
                                const pixel = scale.getPixelForValue(item.value);
                                const stop = Math.max(scale.getDecimalForPixel(pixel), 0);

                                if (stop <= 1) {
                                    // This if can fail if the levels are outside the scale bounds.
                                    gradient.addColorStop(stop, chroma(item.color).css());
                                }
                            });

                            return gradient
                        }
                    }
                }
            } catch (ex) {
                console.error(`[regenerateGradient ${data.wid}] error: ${ex.message}, stack: ${ex.stack}`);
            }
        }

        return {
            id: pluginId,
            beforeDatasetsUpdate: regenerateGradient,
            resize: (chart, newSize, opts) => regenerateGradient(chart, opts),
        }
    }
}