const api = require("./views/api");
const jsonFile = require("./list.json");
const csvToJson = require("csvtojson");
const XLSX = require("xlsx");

// method used add/delete
const method = process.argv[2];
// list of domain json/csv/xlsx/Name
const type = process.argv[3];
// validating a domain name
const regExp = /^(?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/;

function checkMethod(method, type, funcAdd, funcDelete) {
    if (method.toLowerCase() === 'add') {
        funcAdd(type).then();
    } else if (method.toLowerCase() === 'delete') {
        funcDelete(type).then();
    } else {
        console.log('Not the correct method. You can use add or delete')
    }
}

switch (type.toLowerCase()) {
    case 'json':
        checkMethod(method, jsonFile, api.addJsonOrCsvOrXlsxDomain, api.deleteJsonOrCsvOrXlsxDomain);
        break;
    case 'csv':
        (async () => {
            const domains = await csvToJson({
                trim: true
            }).fromFile('./list.csv');
            checkMethod(method, domains, api.addJsonOrCsvOrXlsxDomain, api.deleteJsonOrCsvOrXlsxDomain);
        })()
        break;
    case 'xlsx':
        const workbook = XLSX.readFile('list.xlsx');
        const domains = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        checkMethod(method, domains, api.addJsonOrCsvOrXlsxDomain, api.deleteJsonOrCsvOrXlsxDomain);
        break;
    case regExp.test(type) && type:
        checkMethod(method, type, api.addNameDomain, api.deleteNameDomain);
        break;
    default:
        console.log('Domain names are incorrect');
        break;
}




