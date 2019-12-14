const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');

const crrv = async (obj,api) => {

    const hasheddata = hash.hashReview(obj);
    const hashedobj = {
        "user": "store.data",
        "reviewId": obj.rvid,
        "transactionId": obj.txid,
        "hash" : hasheddata
    }
    console.log(hashedobj);

    return api.transact({
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

const checkDuplicate = async (rvid,rpc) => {
    const oldtx = await table.getReview(rvid, rpc);
    return oldtx ? true :false;
}

const createReview = async (req,res,api,rpc) => {
    const rvid = req.body.reviewId;
    const txid = req.body.transactionId;
    const rate = req.body.data.rate;
    const comment = req.body.data.comment;
    const time = req.body.data.time;

    if (await checkDuplicate(rvid,rpc)) {
        res.statusCode = 400;
        res.send("Review already existed");
        return;
    }
    const obj = {
        "rvid": rvid,
        "txid": txid,
        "rate" : rate,
        "comment" : comment,
        "time" : time
    };
    console.log(obj);

    if (rvid && txid && rate && comment && time) {

        const result = await crrv(obj, api);
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

const getReview = async (req,res,api,rpc) => {
    const rvid = req.params["rvid"];
    console.log(rvid);
    const review = await table.getReview(rvid, rpc);
    if (review) {
        delete review.key;
        res.json(review);
    }
    else {
        res.statusCode = 404;
        res.send("Review not found");
    }
}

const validateReview = async (req,res,api,rpc) => {
    const rvid = req.body.reviewId;
    const oldrv = await table.getReview(rvid, rpc);

    if (!oldrv) {
        res.statusCode = 404;
        res.send("Review not found");
        return;
    }

    const txid = req.body.transactionId;
    const rate = req.body.data.rate;
    const comment = req.body.data.comment;
    const time = req.body.data.time;

    const obj = {
        "rvid": rvid,
        "txid": txid,
        "rate" : rate,
        "comment" : comment,
        "time" : time
    };
    console.log(obj);

    const h = hash.hashReview(obj);
    console.log(h);
    const result = oldrv.hash === h;
    res.send(result);
}

module.exports.create = createReview
module.exports.get = getReview
module.exports.validate = validateReview

module.exports.crrv = crrv
