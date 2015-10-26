define(function () {
    return {
        request: function (url, successCallback, failureCallback, params) {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onload = function () {
                if (xmlhttp.status === 200) {
                    successCallback(xmlhttp.responseText, params);
                } else {
                    failureCallback(xmlhttp, params);
                }
            }

            xmlhttp.onerror = function () {
                failureCallback(xmlhttp, params);
            }

            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    };
});
