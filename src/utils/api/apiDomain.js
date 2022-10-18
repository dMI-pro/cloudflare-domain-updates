require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY} = process.env;
let {ID_DOMAIN} = process.env;
const {customerLoggerInfo, customerLoggerError} = require('../../../src/utils/controller/logger');

const cf = require('cloudflare')({
    email: CF_API_EMAIL,
    key: CF_API_KEY
});


const getDomainId = async (domain) => {
    try {
        const response = await cf.zones.browse();
        const domainInfo = response.result.filter(item => item.name === domain);

        if (!domainInfo[0])
            throw new Error(`${domain} not found in CloudFlare`);

        customerLoggerInfo.log('info', `Get domain ID for ${domainInfo[0].name} successfully`);
        return domainInfo[0].id;
    } catch (e) {
        if (e.response) {
            customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:Get domain ID for ${domain}; code status:${e.response.status};`);
            console.error(e.response.data.errors);
        } else {
            customerLoggerError.log('error', `message:${e.message} func:get domain ID for ${domain}; code status: throw new Error; `);
            console.error(e.message);
        }
    }
}

const addNameDomain = async (domain) => {
    try {
        const response = await cf.zones.add({name: domain});
        customerLoggerInfo.log('info', `Adding domain ${response.result.name} successfully`);
        console.log(`${response.result.name} - successfully adding`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Adding domain ${domain}; code status:${e.statusCode};`);
        console.error(e.response.body.errors);
    }
}

const addJsonOrCsvOrXlsxDomain = async (domains, source) => {
    domains.map(async domain => {
        // data check if CVS or XLSX -> domain.domain, if JSON domain
        let curDomain = '';
        domain.domain === undefined
            ? curDomain = domain
            : curDomain = domain.domain

        try {
            const response = await cf.zones.add({name: curDomain});
            customerLoggerInfo.log('info', `Adding domain ${response.result.name} from ${source} successfully`);
            console.log(`${response.result.name} - successfully adding`);
        } catch (e) {
            customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Adding domain from ${source}; code status:${e.statusCode};`);
            console.error(e.response.body.errors);
        }
    })
}

// functions for deleting a domain

const deleteNameDomain = async (domain) => {
    ID_DOMAIN = await getDomainId(domain);
    if (!ID_DOMAIN) return;

    try {
        const response = await cf.zones.del(ID_DOMAIN);
        customerLoggerInfo.log('info', `Deleting domain ${domain} successfully`);
        console.log(`Deleting domain ${domain} successfully`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Deleting domain ${domain}; code status:${e.statusCode};`);
        console.error(e.response.body.errors);
    }
}

const deleteJsonOrCsvOrXlsxDomain = async (domains, source) => {
    domains.map(async domain => {
        // data check if CVS or XLSX -> domain.domain, if JSON domain
        let curDomain = '';
        domain.domain === undefined
            ? curDomain = domain
            : curDomain = domain.domain

        ID_DOMAIN = await getDomainId(curDomain);
        if (!ID_DOMAIN) return;

        try {
            const response = await cf.zones.del(ID_DOMAIN);
            customerLoggerInfo.log('info', `Deleting domain ${curDomain} successfully`);
            console.log(`Deleting domain ${curDomain} successfully`);
        } catch (e) {
            if (e.response) {
                customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Deleting ${curDomain} from ${source}; code status:${e.statusCode};`);
                console.error(e.response.body.errors);
            } else {
                customerLoggerError.log('error', `message:${e.message} func:Deleting ${curDomain} from ${source}; code status: throw new Error; `);
                console.error(e.message);
            }
        }
    })
}


exports.getDomainId = getDomainId;
exports.addNameDomain = addNameDomain;
exports.deleteNameDomain = deleteNameDomain;
exports.addJsonOrCsvOrXlsxDomain = addJsonOrCsvOrXlsxDomain;
exports.deleteJsonOrCsvOrXlsxDomain = deleteJsonOrCsvOrXlsxDomain;

