/**
 * Created by maxwelldu on 17/4/12.
 */
(function(){
    window.WebSQL = WebSQL;
    /**
     * WebSQL操作
     * @constructor
     */
    function WebSQL(){
        this.db = null;
    }

    /**
     * 新建/打开数据库
     * @param name 数据库名称,默认test
     * @param version 数据库版本, 默认1.0
     * @param displayName 数据库备注, 默认test
     * @param estimatedSize 数据库预置大小, 默认5M
     * @param creationCallback 创建完成后回调
     */
    WebSQL.prototype.openDB = function(name, version, displayName, estimatedSize, creationCallback) {
        name = name || "test";
        version = version || "1.0";
        displayName = displayName || name;
        estimatedSize = estimatedSize || 5*1024*1024;
        creationCallback = creationCallback || function(){};
        this.db = openDatabase(name, version, displayName, estimatedSize, creationCallback);
    };
    /**
     * 执行SQL语句
     * 示例：
     *  建表：CREATE TABLE 表名('字段1','字段2');
     *  添加数据：INSERT INTO 表名('字段1','字段2') VALUES('值1','值2')
     *      或者 INSERT INTO 表名('字段1'，'字段2') VALUES(?,?); 在第二个参数传['值1','值2']
     *  修改数据：UPDATE 表名 SET 字段1='新值1' AND 字段2='新值2' WHERE id=1
     *  删除数据：DELETE FROM 表名 WHERE id=1
     * @param sql SQL语句字符串,必须传
     * @param values SQL语句的问号参数,默认空数组
     * @param succCallback 成功的回调
     * @param failCallback 失败的回调
     */
    WebSQL.prototype.execute = function(sql, values, succCallback, failCallback) {
        if (!sql) {
            throw new Error('必须传入SQL语句');
        }
        values = values || [];
        succCallback = succCallback || function(){};
        failCallback = failCallback || function(){};

      this.db.transaction(function(tx){
         tx.executeSql(sql,values,succCallback, failCallback);
      });
    };
    /**
     * 查询数据
     * @param sql 查询的SQL语句
     * @param values SQL语句的参数
     * @param succCallback 成功的回调
     * @param failCallback 失败的回调
     */
    WebSQL.prototype.select = function(sql,values,succCallback,failCallback) {
        if (!sql) {
            throw new Error('必须传入SQL语句');
        }
        values = values || [];
        succCallback = succCallback || function(){};
        failCallback = failCallback || function(){};
        this.db.readTransaction(function(tx){
           tx.executeSql(sql, values, function(tx,rs){
               succCallback(rs.rows);
           }, failCallback);
        }, function(){
            console.log('读取失败');
        }, function(){
            console.log('读取成功');
        });
    };

})();
