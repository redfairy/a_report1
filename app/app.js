//****** require module config ****** 
require.config({
  paths: {
    handlebars: "../bower_components/handlebars/handlebars",
    text: "../bower_components/text/text",
    hbs: "lib/hbs",
    q: "../bower_components/q/q",
    highcharts: "../bower_components/highcharts/highcharts",
    jquery: "../bower_components/jquery/dist/jquery",
    moment: "../bower_components/moment/moment",
    "highcharts-more": "../bower_components/highcharts/highcharts-more",
    exporting: "../bower_components/highcharts/modules/exporting"
  },
  shim: {
    handlebars: {
      exports: "Handlebars"
    }
  },
  config: {
    app: {
      version: 0.1
    }
  },
  packages: [

  ]
});

/******** app module definition ***********/
define("app", 
       ["js/router", 
        "js/utils", 
        "js/partials", 
        "js/service.dao",
         "jquery", "highcharts",
        "js/uicontroller","moment","js/service.http"], function(router, Utils, partials, dao, jQuery, highcharts, controller,moment,services) {

  
  //hide splash, @2015/11/10
  if(navigator.splashscreen) navigator.splashscreen.hide();
  
  //>>>important! 
  //place here to process the first page in main view
  router.init();
  
  // Initialize your app
  var f7 = new Framework7({
    modalTitle: '应用提示',
    animateNavBackIcon: true,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    template7Pages: true,//enable Template7 rendering for pages @2015/08/20
  });
  
  var mainView = f7.addView('.view-main', {
    dynamicNavbar: true
  });
      

  //add app level event listener
  //@2015/08/07
  controller.init(f7);
  // cache app
  router.complete(f7);

  // init patials
  partials.init();
  
  // init service
  dao.init(f7);
  
  
  return {
    f7: f7,
    mainView: mainView,
    router: router,
    jquery: jQuery,
    highcharts: highcharts,
    utils: Utils,
    moment:moment
  };
  
});