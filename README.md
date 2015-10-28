# AtomicChartUpdater

Plugin for the ChartJs library, that provides functions for easily make multiple dynamic asynchornous updates to their charts that behave atomically.

This tool ensures that either all the asynchronous changes are applied to the chart, or the changes are reverted to the last valid update.

The requests can be done all at once, with the responses arriving in an indeterminate order, or sequentially in a specific order, with an optional delay between responses, where each change is updated after the previous one is completed.

The developer can also define an error tolerance policy, where the update can be accepted if a certain number of failed responses (defined by him) is not surpassed.

##Basic use

###1 - Initialization
The fitst step is to initialize the tool by using its constructor. It receives an instance of the chart to be updated:
```javascript
var chartUpdater = new ChartUpdater(chartjsObject);
```
The chartUpdater object contains methods that allow to update several values to the chart atomically.
####1.1 - Error tolerance
The default behavior is that as soon as one of the updates fail, all the previous ones defined are reverted. But there may be scenarios where the developer may want to allow a certain number of failures before reverting the state. This can be defined in the initialization with an additional parameter that specifies the maximum number of errors allowed.
```javascript
var chartUpdater = new ChartUpdater(chartjsObject, 3);
```
###2- Utility update functions
The charts from ChartJs can be updated through several means, be it from some of its methods, or by manipulating their data structures. But for easing some of the typical types of updates that can be usually be done when trying to make multiple updates, AutomaticChartUpdater offers some basic utility functions to make individual updates.
```javascript
//pushValueToDataset(datasetPosition, value, label);
//addValueToDataset(datasetPosition, dataPosition, value, label);
```
The pushValueToDataset receives the index of the dataset to be updated, the value, and optionally, the label. The element is pushed to the array of values of that dataset. The addValueToDataset receives both the dataset and the position within the array to be updated.

These methods will be useful when used from the callbacks that are defined for making the multiple updates.

###3 - Parallel updates
An AtomicChartUpdater instance offers methods that allow to update several values to the graph that will be requested at the same time. Either all these requests succeed, or if any of them fails, none of them will be updated to the chart (unless a certain error tolerance has been added in the initialization).

####3.1 - Direct values or Ajax Requests
There are two functions that perform parallel updates. They both receive an array and a function as parameters.
```javascript
//valuesUpdate(arrayOfValues, callback);
//ajaxUpdate(arrayOfAjaxRequests, callback);
```
The first one receives an array of values. The callback will be executed once for each of the values in the array, receiving it as a parameter. This allows the developer to chose how those values will be finally added to the chart.

The second one receives an array of URLs. For each one of them, an ajax request will be sent to those URLs. The callback defined will receive each of the responses.

####3.2 - The callback function parameters
The callback defined for these functions should define two parameters. The first one, represents the received value (the value of the array, or the response from the server in case of an Ajax request. The second one is an object that encapsulates some additional information to identify which element is being received by the callback.

The paramObject always has a reference to the chart to be updated, and a valuePosition/ajaxResponsePosition that states which of the elements of the array is being received. This information can be used in conjunction with the value to determine which of the datasets of the chart is to be updated, or if they should be added at a specific place in the chart.
```javascript
//valuesUpdate(arrayOfValues, callback);
chartUpdater.valuesUpdate([3, 4, 6], function(value, paramsObject){
    chartUpdater.pushValueToDataset(paramsObject.valuePosition, value);
});
//ajaxUpdate(arrayOfAjaxRequests, callback);
chartUpdater.valuesUpdate([url1, url2, url3], function(ajaxResponse, paramsObject){
    var jsonObject = JSON.parse(jsonResponse);
    chartUpdater.pushValueToDataset(paramsObject.valuePosition, jsonObject.value);
});
```
These examples are making use of the utility update functions to update a single value in each dataset of the chart.

###4 - Sequence updates
The second way of updating the charts is sequentially, through the following functions
```javascript
//sequentialValuesUpdate(arrayOfValues, callback, interval);
//sequentialAjaxUpdate(arrayOfAjaxRequests, callback, interval);
```
Like the parallel ones, each of the values of the array will be processed through the callback. The main difference is that each value or request will be processed iteratively in the same order as they are defined in the array, with an optional interval defined in milliseconds.

```javascript
//sequentialValuesUpdate(arrayOfValues, callback, interval);
chartUpdater.sequentialValuesUpdate([3, 4, 6, 2, 3], function(value, paramsObject){
    chartUpdater.pushValueToDataset(0, value);
}, 2000);
//sequentialAjaxUpdate(arrayOfAjaxRequests, callback, interval);
chartUpdater.sequentialAjaxUpdate([url1, url2, url3], function(ajaxResponse, paramsObject){
    var jsonObject = JSON.parse(jsonResponse);
    chartUpdater.pushValueToDataset(0, jsonResponse.value);
}, 2000);
```
These examples are making use of the utility update functions to iteratively add all the values to the same dataset iteratively.

###5 - Error management
All the error management is done automatically, there is no need for the developer to implement this logic. Each time one of these methods is executed to make an update, either all the updates succeed, or none are added to the chart. If the developer defines a number of tolerable errors, the changes on the chart will be reverted from an update only if the defined max ammount of acceptable errors is surpased.
