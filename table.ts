const bcQuery = async (req, res, rpc) => {
    const tableName = req.params["tb"];
    switch (tableName) {
        case "transactions":
            {
                const result = await bcTransactionQuery(rpc, true);
                res.json(result);
            }
            break;
        case "coins":
            {
                const result = await bcCoinQuery(rpc, true);
                res.json(result);
            }
            break;
        case "reviews":
            {
                const result = await bcReviewQuery(rpc, true);
                res.json(result);
            }
            break;
        case "discounts":
            {
                const result = await bcDiscountQuery(rpc, true);
                res.json(result);
            }
            break;

        default:
            res.statusCode = 400;
            console.log('unknown table');
            res.send('Unknown table');
    }
}

const bcTransactionQuery = (rpc,remk = false) => {
    return rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'store.data',     // Contract that we target
        scope: 'store.data',         // Account that owns the data
        table: "transactions",        // Table name
        limit: 9999
    }).then(resp => {
        console.log("success");
        if(remk){
            return resp.rows.map(row=>{
                delete row.key;
                return row;
            });
        }
        else return resp.rows;
    })
}

const bcCoinQuery = (rpc,remk = false) => {
    return rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'store.data',     // Contract that we target
        scope: 'store.data',         // Account that owns the data
        table: "coins",        // Table name
        limit: 9999
    }).then(resp => {
        console.log("success");
        if(remk){
            return resp.rows.map(row=>{
                delete row.key;
                return row;
            });
        }
        else return resp.rows;
    })
}

const bcReviewQuery = (rpc,remk = false) => {
    return rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'store.data',     // Contract that we target
        scope: 'store.data',         // Account that owns the data
        table: "reviews",        // Table name
        limit: 9999
    }).then(resp => {
        console.log("success");
        if(remk){
            return resp.rows.map(row=>{
                delete row.key;
                return row;
            });
        }
        else return resp.rows;
    })
}

const bcDiscountQuery = (rpc,remk = false) => {
    return rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'store.data',     // Contract that we target
        scope: 'store.data',         // Account that owns the data
        table: "discounts",        // Table name
        limit: 9999
    }).then(resp => {
        console.log("success");
        if(remk){
            return resp.rows.map(row=>{
                delete row.key;
                return row;
            });
        }
        else return resp.rows;
    })
}

const getTransaction = async (txid, rpc) => {
    const table = Array.from(await bcTransactionQuery(rpc));
    const map = new Map(table.map(obj => [obj.transactionId, obj]));
    return map.get(txid);
}

const getCoin = async (usid, rpc) => {
    const table = Array.from(await bcCoinQuery(rpc));
    const map = new Map(table.map(obj => [obj.userId, obj]));
    return map.get(usid);
}

const getReview = async (rvid, rpc) => {
    const table = Array.from(await bcReviewQuery(rpc));
    const map = new Map(table.map(obj => [obj.reviewId, obj]));
    return map.get(rvid);
}

const getDiscount = async (txid, usid, rpc) => {
    const table = Array.from(await bcDiscountQuery(rpc));
    const map = new Map(table.map(obj => [`${obj.transactionId};${obj.userId}`, obj]));
    return map.get(`${txid};${usid}`);
}

module.exports.query = bcQuery;
module.exports.getTransaction = getTransaction;
module.exports.getCoin = getCoin;
module.exports.getReview = getReview;
module.exports.getDiscount = getDiscount;