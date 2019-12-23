const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');

const checkDuplicate = async(txid,usid,rpc)=>{
    const olddc = await table.getDiscount(txid, usid, rpc);
    return olddc ? true :false;
}

const crdc = async (obj,api) => {
    
    const objdata = {
        "user": "store.data",
        "transactionId": obj.txid,
        "userId": obj.usid,
        "percent" : obj.percent
    }
    console.log(objdata);

    return api.transact({
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

const createDiscount = async (req,res,api,rpc) => {
    const txid = req.body.transactionId;
    const usid = req.body.userId;
    const percent = req.body.percent;

    if (await checkDuplicate(txid,usid,rpc)) {
        res.statusCode = 400;
        res.send("Discount already existed");
        return;
    }
    
    const obj = {
        "txid" : txid,
        "usid" : usid,
        "percent" : percent
    };
    console.log(obj);

    if (txid && usid && percent) {

        const result = await crdc(obj, api);
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

const getDiscount = async (req,res,api,rpc) => {
    const txid = req.query.transactionId;
    const usid = req.query.userId;

    const c = await table.getDiscount(txid, usid, rpc);
    if (c) {
        delete c.key;
        res.json(c);
    }
    else {
        res.statusCode = 404;
        res.send("Discount not found");
    }
}

module.exports.create = createDiscount;
module.exports.get = getDiscount;
module.exports.crdc = crdc;