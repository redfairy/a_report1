/**
 * 全局的事件监听和访问控制逻辑
 * @2015/11/25
 */
define(["module","js/service.cfg", "js/utils"], function(module, service, Utils){
  
  var $ = Dom7;
  var _f7;
  
  function init(f7){
    _f7 = f7;//缓存一个framework7对象
    
    //global ajax timeout process @2015/07/28
    if(Dom7.ajaxSetup){
      Dom7.ajaxSetup({
        timeout: 20000, 
      });
    }
    
    //这里可以监听应用事件...
    //很奇怪，跟ajax没关系的脚本错误事件也会派发...
    $(document).on('ajaxError', function(){
      _f7.alert("出错啦！");
    });
    
    //一个页面显示了
    $(document).on('renderComplete', function(e){
      var currentPage = e.detail.page;
      console.log(currentPage.name+ ' page showed....');
      
    });
      
    //and more...
    
    
  }//end of init
  
  //也可以做链接的访问控制处理...
  function accessCtrl(){
    
  }
  
  //对外暴露的方法
  return {
    init: init,
    accessCtrl: accessCtrl,
  };
  
});