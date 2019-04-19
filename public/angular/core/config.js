(function() {
    angular
        .module('app.core')
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.useApplyAsync(true);
        }])
        .config(configToastr);

    configToastr.$inject=['toastr'];

    function configToastr(toastr){
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-left';
        toastr.options.closeButton = true;
        toastr.options.fadeOut = 250;
        toastr.options.fadeIn = 250;
    }
})();
