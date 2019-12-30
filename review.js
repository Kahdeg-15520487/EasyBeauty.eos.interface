"use strict";

const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');

const crrv = async (obj, api) => {

    const hasheddata = hash.hashReview(obj);
    const hashedobj = {
        "user": "store.data",
        "reviewId": obj.rvid,
        "transactionId": obj.txid,
        "hash": hasheddata
    }

    const result = await api.transact({
        actions: [{
            account: 'store.data',
            name: 'addreview',
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

    return { "status": result.status === true, "val": result.val + '' };
}

const checkDuplicate = async (rvid, rpc) => {
    const oldtx = await table.getReview(rvid, rpc);
    return oldtx ? true : false;
}

const createReview = async (conn, rvid, txid, rate, comment, time) => {

    if (await checkDuplicate(rvid, conn.rpc)) {
        return { "status": false, "val": "duplicated review" };
    }
    const obj = {
        "rvid": rvid,
        "txid": txid,
        "rate": rate,
        "comment": comment,
        "time": time
    };

    if (rvid && txid && rate && comment && time) {
        return await crrv(obj, conn.api);
    }
    else {
        return { "status": false, "val": "malformed data" };
    }
}

const getReview = async (conn, rvid) => {
    const review = await table.getReview(rvid, conn.rpc);
    if (review) {
        delete review.key;
        return { "status": true, "val": JSON.stringify(review) };
    }
    else {
        return { "status": false, "val": "transaction does not exist" };
    }
}

const validateReview = async (conn, rvid, txid, rate, comment, time) => {
    const oldrv = await table.getReview(rvid, conn.rpc);

    if (!oldrv) {
        return { "status": false, "val": "review not found" };
    }

    const obj = {
        "rvid": rvid,
        "txid": txid,
        "rate": rate,
        "comment": comment,
        "time": time
    };

    const h = hash.hashReview(obj);
    const result = oldrv.hash === h;
    return { "status": true, "val": result };
}

module.exports.create = createReview;
module.exports.get = getReview;
module.exports.validate = validateReview;
