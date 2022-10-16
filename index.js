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

// file used domain/dns
const type = process.argv[2].toLowerCase();
// method used add/delete
const method = process.argv[3].toLowerCase();
// list of domain json/csv/xlsx/Name domain
const source = process.argv[4].toLowerCase();
// validating a domain name
const regExp = /^([a-zA-Z0-9][\-a-zA-Z0-9]*\.)+[\-a-zA-Z0-9]{2,20}$/; // паттерн с cloudFlare API

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
            funcAdd(source).then();
            break;
        case 'update':
            funcUpdate(source, process.argv[5]).then();
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



