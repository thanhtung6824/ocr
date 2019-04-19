(function () {
    'use strict';
    angular
        .module('app.logger')
        .factory('logger', logger);

    logger.$inject = ['toastr', '$log'];

    function logger(toastr, $log) {
        let option = {
            success: success,
            error: error,
            warn: warn,
            info: info
        };
        return option;

        function error(message,title ,onClick) {
            toastr.error(message, title, {onclick: onClick});
            //$log.error('Error: ' + message);
        }

        function info(message, title, onClick) {
            toastr.info(message, title, {onclick: onClick});
            //$log.info('Info: ' + message);
        }

        function success(message, title, onClick) {
            toastr.success(message, title, {onclick: onClick});
            // $log.info('Success: ' + message);
        }

        function warn(message, title, onClick) {
            toastr.warning(message, title, {onclick: onClick});
            //$log.warn('Warning: ' + message);
        }

    }
})();
