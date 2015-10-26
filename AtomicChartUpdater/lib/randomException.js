define(function () {
    return {
        //chance in total
        throwRandomError: function (chance, total) {
            var number = Math.floor((Math.random() * total) + 1);

            if (number <= chance) {
                throw new Error("Random error thrown: random number " + number + " under the chance " + chance);
            }
        }
    }
});