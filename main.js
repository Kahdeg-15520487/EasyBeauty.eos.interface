const express = require('express');
const bodyParser = require('body-parser');

const ezbt = require("./index.js");
const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');
const coin = require('./coin.js');
const rv = require('./review.js');
const discount = require('./discount.js');

const app = express()
const port = 3000

const privateKey = process.env.pk;
const api = process.env.api;

const conn = ezbt.EasyBeautyEOS(privateKey,api);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/transaction/:txid', async (req, res) => {
    await tx.get(req, res, api, rpc);
});

app.post('/transaction/validate', async (req, res) => {
    await tx.validate(req, res, api, rpc);
});

app.post('/transaction/create', async (req, res) => {
    await tx.create(req, res, api, rpc);
});

app.get('/table/:tb', async (req, res) => {
    await table.query(req, res, rpc);
})

app.get('/coin/:usid', async (req, res) => {
    await coin.get(req, res, api, rpc);
})

app.post('/coin/update', async (req, res) => {
    await coin.update(req, res, api, rpc);
})

app.post('/review', async (req, res) => {
    await rv.create(req, res, api, rpc);
})

app.get('/review/:rvid', async (req, res) => {
    await rv.get(req, res, api, rpc);
})

app.post('/review/validate', async (req, res) => {
    await rv.validate(req, res, api, rpc);
})

app.post('/discount', async (req, res) => {
    await discount.create(req, res, api, rpc);
})

app.get('/discount', async (req, res) => {
    await discount.get(req, res, api, rpc);
})

app.get('/mock/transaction', async (req, res) => {
    const lala = [];
    for (let i = 0; i < 5; i++) {
        const obj = {
            "txid": util.genId(24),
            "from": util.genId(24),
            "to": util.genId(24),
            "value": util.randomNum(1, 30)
        };
        const txid = await tx.crtx(obj, api);
        lala.push({
            "key": txid,
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