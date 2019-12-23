import crypto from 'crypto';

const secret = 'abcdefg';

const hash = (data: string) => {
    const h = crypto.createHmac('sha256', secret);
    h.update(data);
    return h.digest('hex');
}

const hashTransaction = (obj: TransactionDTO) => {
    const objdata = `${obj.txid};${obj.from};${obj.to};${obj.value}`;
    return hash(objdata);
}

const hashReview = (obj:ReviewDTO) => {
    const objdata = `${obj.rvid};${obj.txid};${obj.rate};${obj.comment};${obj.time}`;
    return hash(objdata);
}

module.exports.hash = hash;
module.exports.hashTransaction = hashTransaction;
module.exports.hashReview = hashReview;