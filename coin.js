const table = require('./table.js');

const setCoin = async (obj, api) => {
    return api.transact({
        actions: [{
            account: 'store.data',
            name: 'updatecoin',
            authorization: [{
                actor: 'store.data',
                permission: 'active'
            }],
            data: obj
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
}

const updateCoin = async (conn, usid, coin) => {
    const oldCoin = await table.getCoin(usid, conn.rpc).then(v => {
        return v;
    }, r => {
        return null;
    });

    const obj = {
        "user": "store.data",
        "key": oldCoin ? oldCoin.key : -1,
        "userId": usid,
        "coin": coin,
    };
    if (usid && coin) {
        return await setCoin(obj, conn.api);
    }
    else{
        return { "status": false, "val": "malformed data" };
    }
}

const getCoin = async (conn, usid) => {
    const coin = await table.getCoin(usid, conn.rpc);
    if (coin) {
        delete coin.key;
        return { "status": true, "val": JSON.stringify(coin) };
    }
    else {
        return { "status": false, "val": "user's coin does not exist" };
    }
}

module.exports.update = updateCoin;
module.exports.get = getCoin;