class TransactionDTO{
    txid: string;
    from: string;
    to: string;
    value: string;
    constructor(txid:string,from:string,to:string,value:string){
        this.txid=txid;
        this.from=from;
        this.to=to;
        this.value=value;
    }
}