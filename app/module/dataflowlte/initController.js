
define(["app", "hbs!module/dataflowlte/pageContent"], function (app, template) {

    var $ = Dom7;
    var _page;

    function init(page) {
        _page = page;

        var templateHTML = template({});
        app.f7.popup(templateHTML);

    }//end of init



    function activeHandler(event) {
        if (event.detail.page != _page.name) return;
        console.log(_page.name + ' is back...');

    }


    return {
        init: init
    };

});
