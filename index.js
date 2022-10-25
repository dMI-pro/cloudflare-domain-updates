const {
    addNameDomain,
    deleteNameDomain,
    addJsonOrCsvOrXlsxDomain,
    deleteJsonOrCsvOrXlsxDomain
} = require("./src/utils/api/apiDomain");
const {addDnsRecord, updateDnsRecord, deleteDnsRecord} = require("./src/utils/api/apiDns");
const jsonFile = require("./source/list.json");
const csvToJson = require("csvtojson");
const XLSX = require("xlsx");
const {customerLoggerError} = require("./src/utils/controller/logger");

// file used domain/dns
const type = process.argv[2].toLowerCase();
// method used add/delete
const method = process.argv[3].toLowerCase();
// list of domain json/csv/xlsx/Name domain
const source = process.argv[4].toLowerCase();
// validating a domain name
const regExp = /^([a-zA-Z0-9][\-a-zA-Z0-9]*\.)+[\-a-zA-Z0-9]{2,20}$/; // паттерн с cloudFlare API

// add передать число 5; update передать число 6. относительно числа из Argv заберуться значение я в объект данных для добавление\удаление днс записи
function getDataDnsRecordForArgv(id) {
    return {
        type: process.argv[id].toUpperCase(),
        name: process.argv[id+1],
        content: process.argv[id+2],
        ttl: Number(process.argv[id+3]) || 1,
        priority: Number(process.argv[id+5]) || 10,
        proxied: process.argv[id+4] === 'true'
    }
}

function domainCheckMethod(method, domains, funcAdd, funcDelete, source) {
    switch (method) {
        case 'add':
            funcAdd(domains, source).then();
            break;
        case 'delete':
            funcDelete(domains, source).then();
            break;
        default:
            console.log('Not the correct method. You can use add or delete')
            break;
    }
}

function domainSourceCheck() {
    switch (source) {
        case 'json':
            domainCheckMethod(method, jsonFile, addJsonOrCsvOrXlsxDomain, deleteJsonOrCsvOrXlsxDomain, source);
            break;
        case 'csv':
            (async () => {
                const domains = await csvToJson({
                    trim: true
                }).fromFile('./source/list.csv');
                domainCheckMethod(method, domains, addJsonOrCsvOrXlsxDomain, deleteJsonOrCsvOrXlsxDomain, source);
            })()
            break;
        case 'xlsx':
            const workbook = XLSX.readFile('./source/list.xlsx');
            const domains = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            domainCheckMethod(method, domains, addJsonOrCsvOrXlsxDomain, deleteJsonOrCsvOrXlsxDomain, source);
            break;
        case regExp.test(source) && source:
            domainCheckMethod(method, source, addNameDomain, deleteNameDomain);
            break;
        default:
            console.log('Source names are incorrect or domain name (json, csv, xlsx, domain name)');
            break;
    }
}

function dnsCheckMethod(method, source, funcAdd, funcUpdate, funcDelete) {
    switch (method) {
        case 'add':
            if(process.argv.length > 11) {
                customerLoggerError.log('error', `The maximum number of arguments is no more than 9`);
                console.log("The maximum number of arguments is no more than 9");
                return
            }
            console.log(process.argv.length)
            const [typeA, nameA, contentA, ttlA, proxiedA, priorityA] = process.argv.splice(5);
            let dataDnsRecordAdd = {
                type: typeA.toUpperCase(),
                name: nameA,
                content: contentA,
                ttl: Number(ttlA) || 1,
                priority: Number(priorityA) || 10,
                proxied: proxiedA === 'true' || proxiedA === undefined
            }
            funcAdd(source, dataDnsRecordAdd).then();
            break;
        case 'update':
            if(process.argv.length > 11) {
                customerLoggerError.log('error', `The maximum number of arguments is no more than 9`);
                console.log("The maximum number of arguments is no more than 9");
                return
            }
            console.log(process.argv.length)
            const [changeDnsNameU, typeU, nameU, contentU, ttlU, proxiedU] = process.argv.splice(5);
            let dataDnsRecordUpdate = {
                type: typeU.toUpperCase(),
                name: nameU,
                content: contentU,
                ttl: Number(ttlU) || 1,
                proxied: proxiedU === 'true' || proxiedU === undefined
            }
            funcUpdate(source, changeDnsNameU, dataDnsRecordUpdate).then();
            break;
        case 'delete':
            funcDelete(source, process.argv[5]).then();
            break;
        default:
            console.log('Not the correct method. You can use add, update, delete')
            break;
    }
}

switch (type) {
    case "dns":
        dnsCheckMethod(method, source, addDnsRecord, updateDnsRecord, deleteDnsRecord);
        break;
    case "domain":
        domainSourceCheck();
        break;
    default:
        console.log('Record type is incorrect (dns or domain)');
        break;
}



