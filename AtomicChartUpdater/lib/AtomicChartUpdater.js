define(["../../lib/clone", '../../lib/ajaxCall', "../../lib/Reconstructors.min"], function (clone, ajaxCall, reconstructors) {

    var ChartUpdater = function (chart, minNumOfErrorsToRevert) {
        this.chart = chart;

        if (!minNumOfErrorsToRevert) {
            minNumOfErrorsToRevert = 1;
        }

        this.minNumOfErrorsToRevert = minNumOfErrorsToRevert;

        this.initializeReconstruction();
    };


    ChartUpdater.prototype = {
        initializeReconstruction: function () {
            var chart = this.chart;
            var updateFunction = function () {
                chart.scale.valuesCount++;
                chart.update();
            };

            for (var i = 0; i < chart.datasets.length; i++) {
                reconstructable.object.array(chart.datasets[i], "points");
            }
            reconstructable.object.array(this.chart.scale, "xLabels");
            reconstructable.object.reconstructionAsync(this, "ajaxUpdate", new ReconstructionOptions(null, null, null, null, this.minNumOfErrorsToRevert, updateFunction));
            reconstructable.object.reconstructionAsync(this, "sequentialAjaxUpdate", new ReconstructionOptions(null, null, null, null, this.minNumOfErrorsToRevert, updateFunction));
        },

        changeMinNumOfErrorsToRevert: function (minNumOfErrorsToRevert) {
            this.minNumOfErrorsToRevert = minNumOfErrorsToRevert;
        },

        updateChart: function (valuesCount) {
            this.chart.scale.valuesCount = valuesCount;
            this.chart.update();
        },

        pushValueToDataset: function (datasetPosition, value, label) {
            var datasetPoints = this.chart.datasets[datasetPosition].points;
            var clonedPoint = clone.clone(datasetPoints[datasetPoints.length - 1]);
            clonedPoint.value = value;
            clonedPoint.label = label;
            var newPoint = new this.chart.PointClass(clonedPoint);

            datasetPoints.push(newPoint);
            if (typeof label !== "undefined") {
                this.chart.scale.xLabels[datasetPoints.length - 1] = label;
            }
            this.updateChart(datasetPoints.length);
        },

        addValueToDataset: function (datasetPosition, dataPosition, value, label) {
            var datasetPoints = chart.datasets[datasetPosition].points;

            if (dataPosition >= datasetPoints.length) {
                var clonedPoint = clone.clone(datasetPoints[datasetPoints.length - 1]);

                //We fill the gap between the last value and the new insert position with null values.
                //This creates valid objects that will render properly we can modify later.
                for (var i = datasetPoints.length; i <= dataPosition; i++) {
                    datasetPoints[i] = new this.chart.PointClass(clonedPoint);
                    datasetPoints[i].value = null;
                    datasetPoints[i].label = "";
                    this.chart.scale.xLabels[i] = "";
                }
            }

            var point = datasetPoints[dataPosition];
            point.value = value;
            point.label = label;
            if (typeof label !== "undefined") {
                this.chart.scale.xLabels[dataPosition] = label;
            }

            this.updateChart(datasetPoints.length);
        },

        valuesUpdate: function (arrayOfValues, callback) {
            var length = arrayOfValues.length;

            for (var i = 0; i < length; i++) {
                callback(arrayOfValues[i], {valuePosition: i, chart: this.chart});
            }
        },

        ajaxUpdate: function (arrayOfAjaxRequests, callback) {
            var length = arrayOfAjaxRequests.length;
            for (var i = 0; i < length; i++) {
                ajaxCall.request(arrayOfAjaxRequests[i], callback, null, {ajaxCallPosition: i, chart: this.chart});
            }
        },

        sequentialValuesUpdate: function (arrayOfValues, callback, interval) {
            var length = arrayOfValues.length;
            var i = 0;

            var iterativeCall = function () {
                callback(arrayOfValues[i], {valuePosition: i, chart: this.chart});
                i++;
                if (i < length) {
                    setTimeout(iterativeCall, interval);
                }
            }
            setTimeout(iterativeCall, interval);
        },

        sequentialAjaxUpdate: function (arrayOfAjaxRequests, callback, interval) {
            var length = arrayOfAjaxRequests.length;
            var i = 0;

            var iterativeCall = function () {
                ajaxCall.request(arrayOfAjaxRequests[i], callback, function () {
                }, {ajaxCallPosition: i, chart: this.chart});
                i++;
                if (i < length) {
                    setTimeout(iterativeCall, interval);
                }
            }
            setTimeout(iterativeCall, interval);
        }
    };

    return ChartUpdater;
});