/**
 * Dom7 wrapper for ajax request, use cache first then send remote request...
 * @2015/08/28
 */
define(function(){
  
  var $ = Dom7;
  var cache = {};
  
  var counter = 0;
  
  function getJSON(url, callback){
    if(cache[url]){
      //use cache data
      //add true to identify the call immediately @2015/09/03
      callback(cache[url], true);
      return;
    }
    
    $.getJSON(url, function(result){
      
      callback(result);
      
      cache[url] = result;//cache data
      
    });
  }
  
  function add(){
    counter ++;
  }
  
  function trace(){
    console.log(">>> "+counter);
  }
  
  return {
    getJSON: getJSON,
    add: add,
    trace: trace,
  }
  
});