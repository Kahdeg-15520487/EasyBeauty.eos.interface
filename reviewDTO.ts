class ReviewDTO {
    rvid: string;
    txid: string;
    rate: string;
    comment: string;
    time: string;
    constructor(rvid: string, txid: string, rate: string, comment: string, time: string) {
        this.rvid = rvid;
        this.txid = txid;
        this.rate = rate;
        this.comment = comment;
        this.time = time;
    }
}