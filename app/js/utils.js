define([], function() {
  var $ = Dom7;

  /**
   * save add eventlister, no repeat add
   * @2015/08/06
   */
  function safeBind(selector, event, handler){
    $(selector).off(event, handler);
    $(selector).on(event, handler);
  }
  
  
  function generateGUID(){
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
  }

  function getRandomInt(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  
  function formatTime(timestamp, short){
    var date = new Date(timestamp*1000);
    
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    if(short) return year+'-'+month+'-'+day;
    
    var hour = date.getHours();
    if(hour<10) hour = '0'+hour;
    
    var minute = date.getMinutes();
    if(minute<10) minute = '0'+minute;
    
    return year+'-'+month+'-'+day+' '+hour+':'+minute;
  } 
  
  /**
   * 1.字符串转化为整形:parseInt(str);如parseInt("7.6")**返回7
     2.向上取整,有小数就整数部分加1:Math.ceil(number) ;如Math.ceil(7.6) **返回8
     3.向下取整,舍去小数部分 : Math.floor(number) ;如Math.floor(7.6) **返回7
     4.四舍五入 :Math.round(number) ;如Math.round(3.4) **返回3, 但是Math.round(3.5)**返回4
   */
  function getRelativeTime(timestampInSecond){
    var date = new Date(Number(timestampInSecond)*1000);
    var now = new Date();
    var diffMilisecond = now - date;
    var diffMinute = diffMilisecond/60000;
    var diffHour = diffMilisecond/3600000;
    
    if(diffHour>24) return Math.floor(diffHour/24)+i18n.global.day_ago;
    
    if(diffHour>1) return Math.floor(diffHour)+i18n.global.hour_ago;
    
    return Math.floor(diffMinute)+i18n.global.minute_ago;
  }
  
  function clearCache(){
    window.localStorage.clear();
    //notify service.dao to clear database
    //2015/08/11
    $(document).trigger('clearCache');
  }
  
  function savedAppVersion(){
    var version = Number(window.localStorage.getItem("version"));
    return version?version:0;
  }
  
  function save(key, value){
    window.localStorage.setItem(key, value);
  }
  
  /**
   * selector: like, '.panel'
   * 
   */
  function translate(selector){
    $(selector).find('.i18n').each(function(){
      var i18nKey = $(this).data('i18n');
      var keys = i18nKey.split('.');
      var value;
      for (var idx = 0, size = keys.length; idx < size; idx++){
        if (value != null){
            value = value[keys[idx]];
        } else {
            value = i18n[keys[idx]];//find the local value
        }
      }
      $(this).html(value);
    });
    $(selector).find('.placeholder').each(function(){
      var value;
      var placeholderKey = $(this).data('placeholder');
      var keys = placeholderKey.split('.');
      var value;
      for (var idx = 0, size = keys.length; idx < size; idx++){
        if (value != null){
            value = value[keys[idx]];
        } else {
            value = i18n[keys[idx]];//find the local value
        }
      }
      $(this).attr('placeholder', value);
    });
  }
  
  function getBoolean(key){
    var v = window.localStorage.getItem(key);
    return v?true:false;
  }
  
  function remove(key){
    window.localStorage.removeItem(key);
  }
  
  function getItem(key){
    var result = window.localStorage.getItem(key);
    if(typeof(result) == 'undefined') return null;
    if(result == 'undefined') return '';
    
    return result;
  }
  
  
  function Rad(d){
     return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  }
  
  //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  function GetDistance(lat1,lng1,lat2,lng2){

      var radLat1 = Rad(lat1);
      var radLat2 = Rad(lat2);
      var a = radLat1 - radLat2;
      var  b = Rad(lng1) - Rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
      Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
      s = s *6378.137 ;// EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000; //输出为公里
      //s=s.toFixed(4);
      return s;
  }  

  return {
    generateGUID: generateGUID,
    getRandomInt: getRandomInt,
    formatTime: formatTime,
    getRelativeTime: getRelativeTime,
    clearCache: clearCache,
    savedAppVersion: savedAppVersion,
    save: save,//cache key/value
    translate: translate, //localization translate by each .i18n class,
    getBoolean: getBoolean,
    remove: remove,
    getItem: getItem,
    safeBind: safeBind,
    getDistance: GetDistance,
  };
  
});