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
    console.log(hashedobj);

    return api.transact({
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

const checkDuplicate = async(txid,rpc)=>{
    const oldtx = await table.getTransaction(txid, rpc);
    return oldtx ? true :false;
}

const createTransaction = async (req, res, api, rpc) => {
    console.log(req.body);

    const txid = req.body.transactionId;
    const from = req.body.transactionInfo.from;
    const to = req.body.transactionInfo.to;
    const value = req.body.transactionInfo.value;

    if (await checkDuplicate(txid,rpc)) {
        res.statusCode = 400;
        res.send("Transaction already existed");
        return;
    }
    const obj = {
        "txid": txid,
        "from": from,
        "to": to,
        "value": value
    };
    console.log(obj);

    if (txid && from && to && value) {

        const result = await crtx(obj, api);
        if(result.status){
            res.send(result.val);
        }
        else{
            res.statusCode = 500;
            res.json(result.val);
        }
    }
    else {
        res.statusCode = 400;
        res.send("Malformed data");
    }
}

const validate = async (req, res, api, rpc) => {
    const txid = req.body.transactionId;
    const oldtx = await table.getTransaction(txid, rpc);
    console.log(txid);

    if (!oldtx) {
        res.statusCode = 404;
        res.send("Transaction not found");
        return;
    }

    const obj = {
        "txid": req.body.transactionId,
        "from": req.body.transactionInfo.from,
        "to": req.body.transactionInfo.to,
        "value": req.body.transactionInfo.value
    };
    console.log(obj);

    const h = hash.hashTransaction(obj);
    console.log(h);
    const result = oldtx.hash === h;
    res.send(result);
}

const getTransaction = async (req, res, api, rpc) => {
    const txid = req.params["txid"];
    console.log(txid);
    const transaction = await table.getTransaction(txid, rpc);
    if (transaction) {
        delete transaction.key;
        res.json(transaction);
    }
    else {
        res.statusCode = 404;
        res.send("Transaction not found");
    }
}

module.exports.get = getTransaction;
module.exports.create = createTransaction;
module.exports.validate = validate;

module.exports.crtx = crtx;