require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: "",
    paths: {
        ajaxCall: "../lib/ajaxCall",
        ajaxCallPromises: "../lib/ajaxCallPromises",
        clone: "../lib/clone",
        randomException: "../lib/randomException"
    }
});