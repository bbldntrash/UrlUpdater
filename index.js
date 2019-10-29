const config = require('./config.json');
const MySQL = require('mysql');
const stream = require('stream');
const str2url = require('./str2url');

const dbPrefix = config['db_prefix'];
const dbName = config['db_name'];

function handleError(err) {
    if (err) {
        throw err;
    }
}

function handle(connection, result) {
    let c = 0;
    for (let key in result) {
        const item = result[key];
        const linkRewrite = str2url(item.name);
        const idProduct = item.id_product;
        const sql = `UPDATE ${dbName}.${dbPrefix}product_lang SET link_rewrite = '${linkRewrite}' WHERE id_product = ${idProduct};`;
        connection.query(sql, handleError);
        c++;
        console.log(c);
    }
}

const connection = MySQL.createConnection({
    host: config['db_host'],
    user: config['db_user'],
    password: config['db_password']
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }

    console.log('Connected!');

    connection.query(`SELECT id_product, name FROM ${dbName}.${dbPrefix}product_lang;`, function(err, result) {
        if (err) {
            throw err;
        }
        handle(connection, result);
    });
});