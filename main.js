const express = require('express');
const bodyParser = require('body-parser');

const ezbt = require("./index.js");
const tx = ezbt.EasyBeautyEOS.transaction;
const rv = ezbt.EasyBeautyEOS.review;
const coin = ezbt.EasyBeautyEOS.coin;
const discount = ezbt.EasyBeautyEOS.discount;
const table = ezbt.EasyBeautyEOS.table;
const util = ezbt.EasyBeautyEOS.utility;

const app = express()
const port = 3000

const privateKey = process.env.pk;
const api = process.env.api;

const conn = ezbt.EasyBeautyEOS(privateKey, api);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/transaction/:txid', async (req, res) => {
    const txid = req.params["txid"];
    var result = await tx.get(conn, txid);
    if (!result.status) {
        res.status(500);
    }
    res.json(result);
});

app.post('/transaction/validate', async (req, res) => {
    const txid = req.body.transactionId;
    const from = req.body.transactionInfo.from;
    const to = req.body.transactionInfo.to;
    const value = req.body.transactionInfo.value;

    var result = await tx.validate(conn, txid, from, to, value);
    if (!result.status) {
        res.json(404);
    }
    res.json(result);
});

app.post('/transaction/create', async (req, res) => {
    const txid = req.body.transactionId;
    const from = req.body.transactionInfo.from;
    const to = req.body.transactionInfo.to;
    const value = req.body.transactionInfo.value;

    var result = await tx.create(conn, txid, from, to, value);
    if (!result.status) {
        res.status(500);
    }
    res.json(result);
});

app.get('/table/:tb', async (req, res) => {
    const tb = req.params["tb"];
    res.json(await table.query(conn, tb));
})

app.get('/coin/:usid', async (req, res) => {
    const usid = req.params["usid"];
    const result = await coin.get(conn, usid);
    if (!result.status) {
        res.status(404);
    }
    res.json(result);
})

app.post('/coin/update', async (req, res) => {
    const usid = req.body.userId;
    const coinVal = req.body.coin;
    const result = await coin.update(conn, usid, coinVal);
    if (!result.status) {
        res.status(500);
    }
    res.json(result);
})

app.post('/review', async (req, res) => {
    const rvid = req.body.reviewId;
    const txid = req.body.transactionId;
    const rate = req.body.data.rate;
    const comment = req.body.data.comment;
    const time = req.body.data.time;

    const result = await rv.create(conn, rvid, txid, rate, comment, time);
    if (!result.status) {
        res.status(500);
    }
    res.json(result);
})

app.get('/review/:rvid', async (req, res) => {
    const rvid = req.params["rvid"];
    const result = await rv.get(conn, rvid);
    if (!result.status) {
        res.status(404);
    }
    res.json(result);
})

app.post('/review/validate', async (req, res) => {
    const rvid = req.body.reviewId;
    const txid = req.body.transactionId;
    const rate = req.body.data.rate;
    const comment = req.body.data.comment;
    const time = req.body.data.time;

    const result = await rv.validate(conn, rvid, txid, rate, comment, time);
    if (!result.status) {
        res.status(404);
    }
    res.json(result);
})

app.post('/discount', async (req, res) => {
    const txid = req.body.transactionId;
    const usid = req.body.userId;
    const percent = req.body.percent;
    const result = await discount.create(conn, txid, usid, percent);
    if (!result.status) {
        res.status(500);
    }
    res.json(result);
})

app.get('/discount', async (req, res) => {
    const txid = req.query.transactionId;
    const usid = req.query.userId;

    const result = await discount.get(conn, txid, usid);
    if (!result.status) {
        res.status(404);
    }
    res.json(result);
})

app.get('/mock/transaction', async (req, res) => {
    const lala = [];
    for (let i = 0; i < 5; i++) {
        const txid = util.genId(24);
        const from = util.genId(24);
        const to = util.genId(24);
        const value = util.randomNum(1, 30);
        const transactionId = await tx.create(conn, txid, from, to, value);
        const obj = {
            "txid": txid,
            "from": from,
            "to": to,
            "value": value
        }
        lala.push({
            "key": transactionId,
            "val": obj
        });
    }
    res.json(lala);
})

app.get('/mock/review', async (req, res) => {
    const lala = [];
    for (let i = 0; i < 5; i++) {
        const obj = {
            "rvid": util.genId(24),
            "txid": util.genId(24),
            "rate": util.randomNum(100, 500),
            "cmt": "good",
            "time": util.randomNum(20, 100)
        };
        const txid = await rv.crrv(obj, api);
        lala.push({
            "key": txid,
            "val": obj
        });
    }
    res.json(lala);
})

app.get('/mock/discount', async (req, res) => {
    const lala = [];
    for (let i = 0; i < 5; i++) {
        const obj = {
            "txid": util.genId(24),
            "usid": util.genId(24),
            "percent": util.randomNum(1, 100)
        };
        const txid = await discount.crdc(obj, api);
        lala.push({
            "key": txid,
            "val": obj
        });
    }
    res.json(lala);
})

app.listen(port, () => console.log(`app listening on port ${port}!`));