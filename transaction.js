"use strict";

const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');

const crtx = async (obj, api) => {

    const hasheddata = hash.hashTransaction(obj);
    const hashedobj = {
        "user": "store.data",
        "transactionId": obj.txid,
        "from": obj.from,
        "to": obj.to,
        "hash": hasheddata
    }
    console.log("lala");
    const rs = await api.transact({
        actions: [{
            account: 'store.data',
            name: 'transact',
            authorization: [{
                actor: 'store.data',
                permission: 'active'
            }],
            data: hashedobj
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    })
        .then(v => {
            const txid = v.transaction_id;
            return { "status": true, "val": txid };
        }, r => {
            return { "status": false, "val": r };
        })
        .catch(e => console.log(e));
    return { "status": rs.status === true, "val": rs.val + '' };
}

const checkDuplicate = async (txid, rpc) => {
    const oldtx = await table.getTransaction(txid, rpc);
    return oldtx ? true : false;
}

const createTransaction = async (conn, txid, from, to, value) => {
    if (await checkDuplicate(txid, conn.rpc)) {
        return { "status": false, "val": "duplicated transaction" };
    }
    const obj = {
        "txid": txid,
        "from": from,
        "to": to,
        "value": value
    };

    if (txid && from && to && value) {
        return await crtx(obj, conn.api);
    }
    else {
        return { "status": false, "val": "malformed data" };
    }
}

const validate = async (conn, txid, from, to, value) => {
    const oldtx = await table.getTransaction(txid, conn.rpc);

    if (!oldtx) {
        return { "status": false, "val": "transaction does not exist" };
    }

    const obj = {
        "txid": txid,
        "from": from,
        "to": to,
        "value": value
    };

    const h = hash.hashTransaction(obj);
    const result = oldtx.hash === h;
    return { "status": true, "val": result };
}

const getTransaction = async (conn, txid) => {
    const transaction = await table.getTransaction(txid, conn.rpc);
    if (transaction) {
        delete transaction.key;
        return { "status": true, "val": JSON.stringify(transaction) };
    }
    else {
        return { "status": false, "val": "transaction does not exist" };
    }
}

module.exports.get = getTransaction;
module.exports.create = createTransaction;
module.exports.validate = validate;