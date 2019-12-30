[![npm version](https://badge.fury.io/js/%40kahdeg%2Feasybeauty.eos.interface.svg)](https://badge.fury.io/js/%40kahdeg%2Feasybeauty.eos.interface)

# EasyBeauty.eos.interface

## Requirements

Nodejs + npm  
Postman

## Install

    $ git clone https://github.com/Kahdeg-15520487/EasyBeauty.eos.interface.git
    $ cd EasyBeauty.eos.interface
    $ npm install

## Use as standalone api service

Set environment variable

    api=<eos server's ip and port>
    pk=<eos server's private key>

then

    npm start

### Configure postman

Import postman.json  
Add Postman Environment

    server_ip=<eos server's ip>
    server_port=<eos server's port>

## Use as library

    const ezbt = require("./index.js");
    const conn = ezbt.EasyBeautyEOS(privateKey, api);
    const tx = ezbt.EasyBeautyEOS.transaction;
    await tx.create(conn, txid, from, to, value);