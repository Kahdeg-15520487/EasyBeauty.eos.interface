const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only

const express = require('express');
const bodyParser = require('body-parser');

const hash = require('./hash.js');
const table = require('./table.js');
const util = require('./utility.js');
const tx = require('./transaction.js');
const coin = require('./coin.js');
const rv = require('./review.js');
const discount = require('./discount.js');


class EasyBeautyEOS {
    constructor(key, node) {
        signatureProvider = new JsSignatureProvider([key]);
        this.rpc = new JsonRpc(node, fetch);
        this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    }

    async createTransaction(txid, from, to, value) {
        if (await tx.checkDuplicate(txid, this.rpc)) {
            return { "status": false, "val": "duplicate transaction" };
        }
        return await tx.crtx({
            "txid": txid,
            "from": from,
            "to": to,
            "value": value
        }, this.api);
    }

    async validateTransaction(txid, from, to, value) {
        const oldtx = await table.getTransaction(txid, this.rpc);
        console.log(txid);

        if (!oldtx) {
            return { "status": false, "val": "transaction does not exist" };
        }

        const obj = {
            "txid": req.body.transactionId,
            "from": req.body.transactionInfo.from,
            "to": req.body.transactionInfo.to,
            "value": req.body.transactionInfo.value
        };

        const h = hash.hashTransaction(obj);
        const result = oldtx.hash === h;
        return { "status": true, "val": result };
    }

    async getTransaction(txid) {
        console.log(txid);
        const transaction = await table.getTransaction(txid, this.rpc);
        if (transaction) {
            delete transaction.key;
            return {"status": true, "val": JSON.stringify(transaction)};
        }
        else {
            return { "status": false, "val": "transaction does not exist" };
        }
    }

    

    async createReview(rvid, txid, rate, comment, time) {
        if (await tx.checkDuplicate(rvid, this.rpc)) {
            return { "status": false, "val": "duplicate review" };
        }
        return await tx.crtx({
            "txid": txid,
            "from": from,
            "to": to,
            "value": value
        }, this.api);
    }

    async validateTransaction(txid, from, to, value) {
        const oldtx = await table.getTransaction(txid, this.rpc);
        console.log(txid);

        if (!oldtx) {
            return { "status": false, "val": "transaction does not exist" };
        }

        const obj = {
            "txid": req.body.transactionId,
            "from": req.body.transactionInfo.from,
            "to": req.body.transactionInfo.to,
            "value": req.body.transactionInfo.value
        };

        const h = hash.hashTransaction(obj);
        const result = oldtx.hash === h;
        return { "status": true, "val": result };
    }

    async getTransaction(txid) {
        console.log(txid);
        const transaction = await table.getTransaction(txid, this.rpc);
        if (transaction) {
            delete transaction.key;
            return {"status": true, "val": JSON.stringify(transaction)};
        }
        else {
            return { "status": false, "val": "transaction does not exist" };
        }
    }

}

module.exports = EasyBeautyEOS;