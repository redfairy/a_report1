/**
 * sqlite operation
 * @2015/07/08
 */
define(["q"], function(Q){
  
  var $ = Dom7;
  
  var self = {};
  
  self.db = null;
  self.available = false;

  self.prepare = function(){
      if (window.sqlitePlugin) {// Use below in production
          self.db = window.sqlitePlugin.openDatabase(
              {name: 'kstart'}, 
              function(){//ok callback
                  self.available = true;
                  $(document).trigger('dbReady');
              });
      }else{// Use below in development
          var maxSize = 655360; // in bytes, 650k
          self.available = true;
          self.db = window.openDatabase('kstart', '1.0', 'database', maxSize);
          $(document).trigger('dbReady');
      }
  };
  
  self.init = function() {
    self.prepare();
    
    var favorites = {
            name: 'favorites',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'uuid', type: 'text'},
                {name: 'type', type: 'text'},
                {name: 'title', type: 'text'},
                {name: 'page', type: 'text'},
                {name: 'time', type: 'integer'}
            ]
        };
    
    var columns = [];
    var column;
    for(var i in favorites.columns){
      column = favorites.columns[i];
      columns.push(column.name + ' ' + column.type);
    }
    
    var query = 'CREATE TABLE IF NOT EXISTS ' + favorites.name + ' (' + columns.join(',') + ')';
    self.query(query);
    
  };
  
  self.query = function(query, bindings) {
      if (!self.db) {self.prepare();};

      bindings = typeof bindings !== 'undefined' ? bindings : [];
      var deferred = Q.defer();

      self.db.transaction(function(transaction) {
          transaction.executeSql(
              query, 
              bindings, 
              function(transaction, result) {//onSuccess
                  deferred.resolve(result);
              }, 
              function(transaction, error) {//onFailure
                  deferred.reject(error);
              });//end of executeSql
      });//end of transaction
      return deferred.promise;
  };  
  
  self.fetchAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
    }

    return output;
  };
  
  self.fetch = function(result) {
    //fixed @2015/07/09
    if(result.rows.length == 0) return null;
    
    return result.rows.item(0);
  };
  
  self.clear = function(tablename){
    return self.query("DELETE FROM "+tablename).then(function(result){
        return result;
    });
  };
  
  self.dump = function() {
    var websql = "SELECT tbl_name, sql FROM sqlite_master WHERE type='table'";
    var sql = websql;
    self.query(sql).then(function(result){
        console.log(self.fetchAll(result));
    });
    console.log("dump...");
  }
  
  self.dropOneTable = function(tbl_name) {
      self.query('DROP TABLE '+tbl_name).then(function(result){
          console.log(tbl_name+" dropped!");
      });
  };
  
  
  return self;
  
});