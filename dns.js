const {getDnsZoneIdForDomain, addDnsRecord, deleteDnsRecord} = require("./views/apiDns");

// method used add/delete
const method = process.argv[2];
// list of domain
const domain = process.argv[3];

function checkMethod(method, domain, funcAdd, funcGetInfo, funcDelete) {
    if (method.toLowerCase() === 'add') {
        funcAdd(domain).then();
    } else if (method.toLowerCase() === 'get') {
        funcGetInfo(domain).then();
    } else if (method.toLowerCase() === 'delete') {
        funcDelete(domain).then();
    } else {
        console.log('Not the correct method. You can use add or get')
    }
}

checkMethod(method, domain, addDnsRecord, getDnsZoneIdForDomain, deleteDnsRecord);

// switch (domain.toLowerCase()) {
    // case 'add':
    //     // checkMethod(method, domain, addDnsRecord, addDnsRecord);
    //     break;
    // case 'get':
    //     console.log('get Info Dns zone');
    //     // checkMethod(method, domain, getInfoDns, getInfoDns);
    //     break;
    // case regExp.test(type) && type:
    //     checkMethod(method, type, api.addNameDomain, api.deleteNameDomain);
    //     break;
//     default:
//         checkMethod(method, domain, addDnsRecord, getDnsZoneIdForDomain, deleteDnsRecord);
//         console.log('Domain names are incorrect');
//         break;
// }



// console.log(process.argv);
// api()
// api().then();
// (async () => await api())()


