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
        this.signatureProvider = new JsSignatureProvider([key]);
        this.rpc = new JsonRpc(node, { "fetch": fetch });
        this.api = new Api({ rpc: this.rpc, signatureProvider: this.signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    }
}

module.exports.EasyBeautyEOS = function (key, node) { return new EasyBeautyEOS(key, node); }
module.exports.EasyBeautyEOS.transaction = tx;
module.exports.EasyBeautyEOS.review = rv;
module.exports.EasyBeautyEOS.coin = coin;
module.exports.EasyBeautyEOS.discount = discount;
module.exports.EasyBeautyEOS.table = table;
module.exports.EasyBeautyEOS.utility = util;