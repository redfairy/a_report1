define(function(){
  var config = {};

  //TODO: 换成你自己的IP
  var DEVELPMENT_URL = 'http://xxx.xx.xxx.xx/';
  var PRODUCTION_URL = 'http://xxx.xx.xxx.xxx/';
  

//  config.appStatus = 'release';//or release
  config.appStatus = 'debug';//or release
  
  //GEE咖啡
  config.lat = 39.92;
  config.lng = 116.57;

  if (config.appStatus === 'debug') {
    config.apiURL = DEVELPMENT_URL;
  }else{
    config.apiURL = PRODUCTION_URL;
  }

  config.userLoggedin = function(){
    return window.localStorage.getItem("logged");
  };
  
  config.userRole = function(){
    return window.localStorage.getItem("role");
  };
  
  config.userToken = function(){
    return window.localStorage.getItem("token");
  };
  
  
  config.latestLat = function(){
    return window.localStorage.getItem("lat")?Number(window.localStorage.getItem("lat")):config.lat;
  };
  
  config.latestLng = function(){
    return window.localStorage.getItem("lng")?Number(window.localStorage.getItem("lng")):config.lng;
  };
  
  config.loginFailureCount = function(){
    if(!window.localStorage.getItem("logcnt")){
      window.localStorage.setItem("logcnt", '0');
    }
    
    window.localStorage.setItem("logcnt", Number(window.localStorage.getItem("logcnt"))+1);
    
    console.log('log count add 1...');
    
    if(Number(window.localStorage.getItem("logcnt"))>=5){//已经到了最大尝试次数，记录登录时间
      window.localStorage.setItem("failureTime", new Date().getTime());
      console.log('beyond the max login attempt');
    }
    
  };
  
  //只能运行4次登录失败
  config.canLogin = function(){
    var logcnt = window.localStorage.getItem("logcnt")?Number(window.localStorage.getItem("logcnt")):0;
    if(logcnt<5){
      return true;
    }
    var failureTime = new Date().getTime() - Number(window.localStorage.getItem("failureTime"));
    if(logcnt>=5 && failureTime<60000*5){//5分钟内登录过5次的不能再登录
      return false;
    }
    
    return true;//过了5分钟了，可以登录
  };
  
  config.loginCountClear = function(){//登录成功了
    window.localStorage.setItem("logcnt", '0');
  };
  
  //有值表示用过了，不是第一次使用, @2015/11/25
  config.isFirstUse = function(){
    return window.localStorage.getItem("fstuse")?false:true;
  };
  //为首页引导层加标记
  config.firstUsed = function(){
    window.localStorage.setItem("fstuse", true);
  };
  
  
  
  return config;
  
});