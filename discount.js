const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');

const checkDuplicate = async (txid, usid, rpc) => {
    const olddc = await table.getDiscount(txid, usid, rpc);
    return olddc ? true : false;
}

const crdc = async (obj, api) => {

    const objdata = {
        "user": "store.data",
        "transactionId": obj.txid,
        "userId": obj.usid,
        "percent": obj.percent
    }

    const result = await api.transact({
        actions: [{
            account: 'store.data',
            name: 'adddiscount',
            authorization: [{
                actor: 'store.data',
                permission: 'active'
            }],
            data: objdata
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

    return { "status": result.status === true, "val": result.val + '' };
}

const createDiscount = async (conn, txid, usid, percent) => {
    if (await checkDuplicate(txid, usid, conn.rpc)) {
        return { "status": false, "val": "duplicated discount" };
    }

    const obj = {
        "txid": txid,
        "usid": usid,
        "percent": percent
    };

    if (txid && usid && percent) {
        return await crdc(obj, conn.api);
    }
    else {
        return { "status": false, "val": "malformed data" };
    }
}

const getDiscount = async (conn, txid, usid) => {
    const discount = await table.getDiscount(txid, usid, conn.rpc);
    if (discount) {
        delete discount.key;
        return { "status": true, "val": JSON.stringify(discount) };
    }
    else {
        return { "status": false, "val": "discount does not exist" };
    }
}

module.exports.create = createDiscount;
module.exports.get = getDiscount;
