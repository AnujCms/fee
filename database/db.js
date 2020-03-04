var mysql = require('mysql'),
     envVariable = require("../config/envValues.js"),
    Promise = require('bluebird'),
    using = Promise.using; 
     
    Promise.promisifyAll(mysql);
    Promise.promisifyAll(require("mysql/lib/Connection").prototype);
    Promise.promisifyAll(require("mysql/lib/Pool").prototype);


var state = {
    pool: null,
    mode: null,
}

/**
 *  For Promises Support MySQL
 */
function getConnection() {
    return state.pool.getConnectionAsync().disposer(function (connection) {
        return connection.release();
    });
}

function getTransaction() {
    return state.pool.getConnectionAsync().then(function (connection) {
        return connection.beginTransactionAsync().then(function () {
            return connection;
        });
    }).disposer(function (connection, promise) {
        var result = promise.isFulfilled() ? connection.commitAsync() : connection.rollbackAsync();
        return result.finally(function () {
            connection.release();
        });
    });
}


exports.connect = function (mode, done) {
    state.pool = mysql.createPool(envVariable.mysqlConnection);
    state.pool.getConnection(function (err, connection) {
        // connected! (unless `err` is set)

        if (err) {
            done(err);
            return;
        }
        connection.release();
        console.log('MySQL Database connected Successfully.')
        done();
        return;
    });

};

exports.get = function () {
    return state.pool;
}


exports.query = function (sql, values) {
    return using(getConnection(), function (connection) {
        return connection.queryAsync({
            sql: sql,
            values: values,
            // nestTables: true,
            // typeCast: false,
            timeout: 60*60*10000
        });
    });
}
exports.query1 = function (callback) {
    return using(getConnection(), function (connection) {
        return callback(connection);
    });

},
    exports.transaction = function (callback) {
        return using(getTransaction(), function (connection) {
            return callback(connection);
        });
    }

exports.getQuery = function (conn, sql) {
    // return conn.query(sql);
    // return conn.queryAsync(sql, function (err, result) {
    //     console.log('Error: '+ err);
    //     if (err) throw err;
    //     console.log('Helllll: '+result);
    //   });
    return conn.queryAsync({
        sql: sql
    });
}

exports.setQuery = function (conn, sql, values) {
    return conn.queryAsync({
            sql: sql,
            values: values
        });
  }
