var randomException = {
    //chance in total
    throwRandomError: function (chance, total) {
        var number = Math.floor((Math.random() * total) + 1);

        if (number <= chance) {
            throw new Error("Random error thrown: random number " + number + " under the chance " + chance);
        }
    }
};

var lineChartUtil = {

    probabilityOfErrorFrom0To10: 0,

    updateNumber: 0,

    initializeChart: function () {

        var data = {
            labels: [],
            datasets: [
                {
                    label: "Euro",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [2.189/*, 65, 59, 80, 81, 56, 55, 33*/]
                },
                {
                    label: "Dollar",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [1.141/*, 28, 48, 40, 19, 86, 27, 90*/]
                },
                {
                    label: "Yen",
                    fillColor: "rgba(100,100,100,0.2)",
                    strokeColor: "rgba(100,100,100,1)",
                    pointColor: "rgba(100,100,100,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(100,100,100,1)",
                    data: [3.966/*, 65, 59, 80, 81, 56, 55, 33*/]
                },
                {
                    label: "Pound",
                    fillColor: "rgba(50,50,50,0.2)",
                    strokeColor: "rgba(50,50,50,1)",
                    pointColor: "rgba(50,50,50,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(50,50,50,1)",
                    data: [0.617/*, 28, 48, 40, 19, 86, 27, 90*/]
                }
            ]
        };

        var contextCanvas = document.getElementById("myChart").getContext("2d");
        window.lineChart = new Chart(contextCanvas).Line(data);
        window.chartUpdater = new ChartUpdater(window.lineChart);
    },

    updateCurrencyExchange: function (jsonResponse, paramsObject) {
        var jsonObject = JSON.parse(jsonResponse);
        var currencyName = Object.keys(jsonObject)[0];
        var randomArrayPosition = Math.floor((Math.random() * jsonObject[currencyName].length));
        randomException.throwRandomError(window.probabilityOfErrorFrom0To10, 10);
        chartUpdater.pushValueToDataset(paramsObject.ajaxCallPosition, jsonObject[currencyName][randomArrayPosition], lineChartUtil.updateNumber);
    },

    updateParallelOnce: function (probabiltyOfErrorFrom0to10) {
        window.probabilityOfErrorFrom0To10 = probabiltyOfErrorFrom0to10;
        var nocache = new Date().getTime();

        chartUpdater.ajaxUpdate([
            "../resources/currency_euro.json?q=" + nocache,
            "../resources/currency_dollar.json?q=" + nocache,
            "../resources/currency_yen.json?q=" + nocache,
            "../resources/currency_pound.json?q=" + nocache], lineChartUtil.updateCurrencyExchange);
        lineChartUtil.updateNumber++;
    },
}


