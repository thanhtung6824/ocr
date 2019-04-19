(function () {
    'use strict';
    angular
        .module('app.core', [
            'app.logger'
        ])
        .constant('toastr', toastr)
        .config(configToastr);

    configToastr.$inject = ['toastr'];

    function configToastr(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-left';
        toastr.options.closeButton = true;
        toastr.options.fadeOut = 250;
        toastr.options.fadeIn = 250;
    }
})();
