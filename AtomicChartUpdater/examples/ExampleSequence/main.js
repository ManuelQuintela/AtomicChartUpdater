require(['../../lib/Chart.min.js', "AtomicChartUpdater", "../../lib/randomException"], function (Chart, ChartUpdater, randomException) {

    window.lineChartUtil = {

        probabilityOfErrorFrom0To10: 0,

        initializeChart: function () {
            window.Chart = Chart;
            window.ChartUpdater = ChartUpdater;

            var data = {
                labels: [],
                datasets: [
                    {
                        label: "Yen",
                        fillColor: "rgba(100,100,100,0.2)",
                        strokeColor: "rgba(100,100,100,1)",
                        pointColor: "rgba(100,100,100,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(100,100,100,1)",
                        data: [0/*, 65, 59, 80, 81, 56, 55, 33*/]
                    }
                ]
            };

            var contextCanvas = document.getElementById("myChart").getContext("2d");
            window.lineChart = new Chart(contextCanvas).Line(data);
            window.chartUpdater = new ChartUpdater(window.lineChart, 0);
        },

        updateCurrencyExchange: function (jsonResponse, paramsObject) {
            var jsonObject = JSON.parse(jsonResponse);
            var currencyName = Object.keys(jsonObject)[0];
            var randomArrayPosition = Math.floor((Math.random() * jsonObject[currencyName].length));

            randomException.throwRandomError(lineChartUtil.probabilityOfErrorFrom0To10, 10);

            chartUpdater.pushValueToDataset(0, jsonObject[currencyName][randomArrayPosition], paramsObject.ajaxCallPosition);
        },

        updateSequence: function (currency, numberOfUpdates, interval, probabilityOfErrorFrom0To10) {
            lineChartUtil.probabilityOfErrorFrom0To10 = probabilityOfErrorFrom0To10
            var nocache;
            var arrayOfAjaxUrl = [];

            for (var i = 0; i < numberOfUpdates; i++) {
                nocache = new Date().getTime();
                arrayOfAjaxUrl.push("../resources/currency_" + currency + ".json?q=" + nocache);
            }

            chartUpdater.sequentialAjaxUpdate(arrayOfAjaxUrl, lineChartUtil.updateCurrencyExchange, interval);
        },
    }

    lineChartUtil.initializeChart();
});