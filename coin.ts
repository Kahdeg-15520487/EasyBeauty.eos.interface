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
            console.log(v);
            console.log(v.processed.receipt);
            const txid = v.transaction_id;
            return { "status": true, "val": txid };
        }, r => {
            console.log("failed");
            console.log(r);
            return { "status": false, "val": r };
        })
        .catch(e => console.log(e));
}

const updateCoin = async (req, res, api, rpc) => {

    const usid = req.body.userId;
    const coin = req.body.coin;

    const oldCoin = await table.getCoin(usid, rpc).then(v => {
        console.log("found " + JSON.stringify(v));
        return v;
    },r=>{
        console.log(r);
        res.json(r);
        return;
    });
    // console.log(oldcoin);
    const obj = {
        "user": "store.data",
        "key": oldCoin ? oldCoin.key : -1,
        "userId": usid,
        "coin": coin,
    };

    const result = await setCoin(obj, api);
    if (result.status) {
        res.send(result.val);
    }
    else {
        res.statusCode = 500;
        res.json(result.val);
    }
}

const getCoin = async (req, res, api, rpc) => {
    const usid = req.params["usid"];
    console.log(usid);
    const c = await table.getCoin(usid, rpc);
    if (c) {
        delete c.key;
        res.json(c);
    }
    else {
        res.statusCode = 404;
        res.send("User coin not found");
    }
}

module.exports.update = updateCoin;
module.exports.get = getCoin;