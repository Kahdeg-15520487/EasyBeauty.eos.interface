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

// const app = express()
// const port = 3000

// const privateKey = process.env.pk;

// const privateKeys = [privateKey];

// const signatureProvider = new JsSignatureProvider(privateKeys);
// const rpc = new JsonRpc(process.env.api, { fetch });
// const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

class EasyBeautyEOS{
    constructor(key,node){
        signatureProvider = new JsSignatureProvider([key]);
        this.rpc = new JsonRpc(node,fetch);
        this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    }


}

module.exports.ezbeauty = EasyBeautyEOS;

//api.getContract("store.data").then(c=>{console.log(typeof c);console.log(c);});
//api.getContract("store.data").then(c=>{console.log(typeof c);console.log(c.actions.get('transact'));});

// api.transact({
//     actions:[{
//         account:'store.data',
//         name:'transact',
//         authorization:[{
//             actor:'store.data',
//             permission:'active'
//         }],
//         data:{
//             user:'store.data',
//             from:'user1',
//             to:'user2',
//             hash:'lala'
//         }
//     }]
// }, {
//     blocksBehind: 3,
//     expireSeconds: 30,
// })
// .then(v=>{
//     console.log(v);
//     console.log(v.processed.receipt);
//     const txid = v.transaction_id;


//     rpc.get_table_rows({
//         json: true,              // Get the response as json
//         code: 'store.data',     // Contract that we target
//         scope: 'store.data',         // Account that owns the data
//         table: 'transactions',        // Table name
//     }).then(resp=>{    
//         console.log("=====================");
//         console.log(resp.rows);
//     })
// },r=>{
//     console.log("failed");
//     console.log(r);
// })
// .catch(e=>console.log(e))
// ;

// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

// app.get('/transaction/:txid', async (req, res) => {
//     await tx.get(req,res,api,rpc);
// });

// app.post('/transaction/validate', async (req, res) => {
//     await tx.validate(req,res,api,rpc);
// });

// app.post('/transaction/create', async (req, res) => {
//     await tx.create(req,res,api,rpc);
// });

// app.get('/table/:tb', async (req, res) => {
//     await table.query(req, res, rpc);
// })

// app.get('/coin/:usid', async (req, res) => {
//     await coin.get(req, res, api, rpc);
// })

// app.post('/coin/update', async (req, res) => {
//     await coin.update(req, res, api, rpc);
// })

// app.post('/review',async(req,res)=>{
//     await rv.create(req,res,api,rpc);
// })

// app.get('/review/:rvid',async (req,res) => {
//     await rv.get(req,res,api,rpc);
// })

// app.post('/review/validate',async (req,res) => {
//     await rv.validate(req,res,api,rpc);
// })

// app.post('/discount',async (req,res) => {
//     await discount.create(req,res,api,rpc);
// })

// app.get('/discount',async (req,res) => {
//     await discount.get(req,res,api,rpc);
// })

// app.get('/mock/transaction', async(req,res)=>{
//     const lala =[];
//     for (let i = 0; i < 5; i++) {
//         const obj = {
//             "txid": util.genId(24),
//             "from": util.genId(24),
//             "to": util.genId(24),
//             "value": util.randomNum(1,30)
//         };
//         const txid = await tx.crtx(obj,api);
//         lala.push({
//             "key": txid,
//             "val": obj
//         });
//     }
//     res.json(lala);
// })

// app.get('/mock/review', async(req,res)=>{
//     const lala =[];
//     for (let i = 0; i < 5; i++) {
//         const obj = {
//             "rvid": util.genId(24),
//             "txid": util.genId(24),
//             "rate": util.randomNum(100,500),
//             "cmt": "good",
//             "time": util.randomNum(20,100)
//         };
//         const txid = await rv.crrv(obj,api);
//         lala.push({
//             "key": txid,
//             "val": obj
//         });
//     }
//     res.json(lala);
// })

// app.get('/mock/discount', async(req,res)=>{
//     const lala =[];
//     for (let i = 0; i < 5; i++) {
//         const obj = {
//             "txid": util.genId(24),
//             "usid": util.genId(24),
//             "percent" : util.randomNum(1,100)
//         };
//         const txid = await discount.crdc(obj,api);
//         lala.push({
//             "key": txid,
//             "val": obj
//         });
//     }
//     res.json(lala);
// })

// app.listen(port, () => console.log(`app listening on port ${port}!`));

