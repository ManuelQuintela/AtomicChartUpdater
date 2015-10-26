define(function () {
    return {
        clone: function (obj) {
            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }
            target.prototype = obj.prototype;
            return target;
        }
    }
});