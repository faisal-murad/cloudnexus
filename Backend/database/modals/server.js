import mongoose from "mongoose";
import { Schema } from "mongoose";

const serverSchema = new Schema({
    SID: String,
    UID: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    serverDetails: [{

        agent: String,
        user: String,
        os: String,
        kernel: String,
        hostname: String,
        location: String,
        date: String,
        Vendor: String,
        time: String,
        reqreboot: String,
        uptime: String,
        cpumodel: String,
        cpusockets: String,
        cpucores: String,
        cputhreads: String,
        cpuspeed: String,
        cpu: String,
        wa: String,
        st: String,
        us: String,
        sy: String,
        load1: String,
        load5: String,
        load15: String,
        ramsize: String,
        ram: String,
        ramswapsize: String,
        ramswap: String,
        rambuff: String,
        ramcache: String,
        disks: String,
        inodes: String,
        iops: String,
        nics: String,
        ipv4: String,
        ipv6: String,
        conn: String,
        temp: String,
        serv: String,
        cust: String

    }]
    // rps1: String,
    // rps2: String,    
    // serverUser: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    // downtime: {
    //     startTime: String,
    //     duration: String,
    // },
});
export default mongoose.model('Server', serverSchema);