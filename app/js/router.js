
define(["js/service.cfg", "js/utils"], function(service, utils) {
	var $ = Dom7;
	var _app;
    var _controller;

	/**
	 * Init router, that handle page events
	 */
    function init() {
      //for controller add listener after animation
      $(document).on('pageAfterAnimation', function(){
        if(_controller && _controller.pageAfterAnimation){
          _controller.pageAfterAnimation();
        }
      });
      
      //response to backbutton for android @2015/06/24
      $(document).on('deviceready', function(){
        //listen on back button press in android
        $(document).on('backbutton', function (e) {
          var currentPage = _app.getCurrentView().activePage.name;
          if(currentPage == 'index' || currentPage == 'recommend'){
            navigator.app.exitApp();
          }else{
            _app.getCurrentView().router.back();
            e.preventDefault();
          }
        }, false );
        
        if(service.userLoggedin()){
          //geolocation available
          getCurrentPosition();
        }
        
      }, false);//end of device ready

      $(document).on('pageInit', function (e) {
        var page = e.detail.page;
        
        //FIXME: exclude plain page of no data-page attribute
        // @2015/07/01
        if(!page.name) return;
        // FIXME: exclude for form select page
        // @2015/06/03
        if(page.name.indexOf('smart-select')>-1) return;
        // FIXME: use page.container 
        // @2015/06/03
        load(page);
      });

      $(document).on('pageBeforeRemove', function(e){
        $(document).trigger("destroy", {page: e.detail.page.name});
      });

      /*
       * after page back,then send notification to the current page;
       * like the resume event in android
       *
       * @2015/07/02
       */
      $(document).on('pageAfterBack', function(e){
        var currentPage = _app.getCurrentView().activePage.name;
        //the page in history reappear to client
        $(document).trigger("active", {page: currentPage});
        //FIXED, 销毁上一个controller，防止pageAfterAnimation被调用
        //@2015/11/28
        _controller = null;
      });
      
      // swith among the bottom tab, and load view page
      $('.tab').on('show', function(event){
        //load content to tab
        var currentView = _app.getCurrentView();
        if(event.target.id == 'view-1') return;//view-1 has already loaded
        // dynamic load page according to menu....
        // currentView.loadPage("page/"+event.target.id+".html");
        currentView.router.load({url: "page/"+event.target.id+".html", animatePages: true});
      });
      
      //listen to login action and check location
      //@2015/08/07
      $(document).on('logged', getCurrentPosition);
      
    }//end of init

    function getCurrentPosition(){
            
      if(!navigator.geolocation){
        alert("geolocation is inavailable!");
        return;
      }
      //alert("get current postition...");
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
    }
  
    function onSuccess(postion){
      //家里：39.923662199999995,116.5802911, @2015/11/09
      var lat = postion.coords.latitude;//纬度
      var lng = postion.coords.longitude;//经度
      
      if(!lat || !lng) return;
      
      
      console.log("sending location: "+lat+","+lng);
      
      //cache
      utils.save('lat', lat);
      utils.save('lng', lng);
      
      //alert("geolocation got!");
    }
  
    function onError(error) {
        //alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
    }

    // cache the app instance
    //@2015/06/02
    function complete(app){
    	_app = app;
    }

  function open(controllerName, query) {
    require(['module/' + controllerName + '/initController'], function(controller) {
      controller.init(query);
    });
  }

	/**
     * 灰常流弊的代码...
	 * Load (or reload) controller from js code (another controller) - call it's init function
	 * @param page object
	 */
	function load(page) {
      var controllerName = page.name;
      var query = page.query;
      require(['module/' + controllerName + '/initController'], function(controller) {
        //FIXME, @2015/04/26 add validation check for init method export
        if(controller && typeof controller['init'] !== 'undefined'){
          // FIXME, @2015/06/03
          controller.init(page);//to use page obj render page content
        }else{
          console.error('init method undefined in this controller!');
        }
        //cache the instance for later callback
        //@2015/07/09
        _controller = controller;
      });
	}

	return {
      init: init,
      load: load,
      open: open,
      complete: complete
    };
  
});