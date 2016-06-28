/**
 * response to the ui action for save data to local db
 * @2015/07/09
 */
define(["js/db", "js/service.cfg"], function(db, service){
  
  var self = {};
  var $ = Dom7;
  var _f7;
  //save for add check
  //@2015/08/11
  var favorites;
  
  /**
   * public function
   */
  self.init = function(f7){
    _f7 = f7;
    
    db.init();
        
    //receive the click on mark icon in detail page
    $(document).on("pageFavorite", favoriteHandler);
    //clear cache while logout @2015/08/11
    $(document).on("clearCache", clearFavorites);
    //cache first
    self.getFavorites();
    
  };
  
    
  /**
   * 送数据岛服务端保存
   */
  function favoriteHandler(e){
    var obj = e.detail;
    //console.log(obj);
    
    _f7.showIndicator();
    
    $.post(service.apiURL+'kstart/mark', 
           {token: service.userToken(), sid: obj.uuid, type: obj.type}, 
           function(result){
              //console.log(result);
              $(document).trigger("marked");//页面收藏图标切换状态
              _f7.hideIndicator();
              _f7.alert("已收藏");
    });
    
    self.addFavorite(obj);
  }
  
  self.addFavorite = function(obj){
    var exist = false;
    for(var i in favorites){
      if(favorites[i]['uuid']==obj.uuid){
        exist = true;
        break;
      }
    }
    
    if(exist) return;
    
    var currentTime = parseInt(new Date().getTime()/1000);
    var sql =  "INSERT INTO favorites (uuid,type,title,page,time)";
        sql += " VALUES(";
        sql += "'"+obj.uuid+"',";
        sql += "'"+obj.type+"',";
        sql += "'"+obj.title+"',";
        sql += "'"+obj.page+"',";
        sql += currentTime+")";
    //console.log(sql);
    db.query(sql).then(function(result){
      console.info(">>> save success!");
    },function(e){
      console.error(e);
    });
    
  };
  
  /**
   * check the item if saved in local
   */
  self.isMarked = function(uuid){
    return db.query('SELECT * FROM favorites WHERE uuid = ?', [uuid])
      .then(function(result){
          return db.fetch(result);
      });
  };
  
  self.getFavorites = function(){
    return db.query('SELECT * FROM favorites ORDER BY id DESC')
        .then(function(result){
          favorites = db.fetchAll(result);
//      console.log("favorites: ");
//      console.log(favorites);
          return favorites;
        });
  }
  
  self.deleteById = function(uuid){
      var sql = "DELETE FROM favorites WHERE uuid = ?";
      return db.query(sql, [uuid]).then(function(result){
          return result;
      });
  };

  
  function clearFavorites(){
    return db.query("DELETE FROM favorites").then(function(result){
        return result;
    });
  };
  
  
  return self;
  
});