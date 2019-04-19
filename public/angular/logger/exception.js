(function() {
    'use strict';

    angular
        .module('app.logger')
        .factory('exception', exception);

    exception.$inject = ['$q', '$log', 'logger'];

    /* @ngInject */
    function exception($q, $log, logger) {
        let service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(e) {
                let thrownDescription;
                let newMessage;
                if (e.data && e.data.Message) {
                    thrownDescription = '\n' + JSON.stringify(e.data.Message);
                    newMessage = message + thrownDescription;
                    e.Message = newMessage;
                } else {
                    newMessage = message + '. ' + e.status + ' ' + e.statusText;
                    e.Message = newMessage + ' ' + e.statusText
                }
                $log.error(newMessage);
                logger.error(newMessage);
                return $q.reject(e);
            };
        }
    }
})();
