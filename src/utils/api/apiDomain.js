require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY, URL_ADD_DELETE_DOMAIN} = process.env;
let {ID_USER, ID_DOMAIN} = process.env;
const axios = require("axios");
const {customerLoggerInfo, customerLoggerError} = require('../../../src/utils/controller/logger');

let currentDomain = '';
const dataAxios = {
    "id": "",
    "name": ""
};
const configAxios = {
    method: "post",
    url: "",
    headers: {
        "X-Auth-Email": CF_API_EMAIL,
        "X-Auth-Key": CF_API_KEY,
        "Content-Type": "application/json"
    },
};

const getUserID = async () => {
    configAxios.method = "GET";
    configAxios.url = "https://api.cloudflare.com/client/v4/user";

    try {
        const response = await axios(configAxios);
        customerLoggerInfo.log('info', `get user id`);
        return response.data.result.id;
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:get user id; code status:${e.response.status}; `);
        console.error(e.response.data.errors);
        proccess.exit;
    }
}

const getDomainId = async (domain) => {
    configAxios.method = "GET";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}?name=${domain}`;
    try {
        const response = await axios(configAxios);
        if (!response.data.result[0])
            throw new Error(`${domain} not found in CloudFlare`);

        customerLoggerInfo.log('info', `Get domain ID for ${response.data.result[0].name} successfully`);
        return response.data.result[0].id;
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
    ID_USER = await getUserID();
    dataAxios.id = ID_USER;
    dataAxios.name = domain;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;
    configAxios.data = dataAxios;

    try {
        const response = await axios(configAxios);
        customerLoggerInfo.log('info', `Adding domain ${response.data.result.name} successfully`);
        console.log(`${response.data.result.name} - successfully adding`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:Adding domain ${domain}; code status:${e.response.status};`);
        console.error(e.response.data.errors);

    }
}

const addJsonOrCsvOrXlsxDomain = async (domains, source) => {
    ID_USER = await getUserID();

    dataAxios.id = ID_USER;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;

    domains.map(async domain => {
        // data check if CVS or XLSX -> domain.domain, if JSON domain
        domain.domain === undefined
            ? dataAxios.name = domain
            : dataAxios.name = domain.domain

        configAxios.data = dataAxios;

        try {
            const response = await axios(configAxios);
            customerLoggerInfo.log('info', `Adding domain ${response.data.result.name} from ${source} successfully`);
            console.log(`${response.data.result.name} - successfully adding`);
        } catch (e) {
            if(!e.response.data) {
                customerLoggerInfo.log('error', `Adding domain ${e.response} from ${source} error`);
                console.log(e.response)
            } else {
                customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:Adding domain from ${source}; code status:${e.response.status};`);
                console.error(e.response.data.errors);
            }
        }
    })
}

// functions for deleting a domain

const deleteNameDomain = async (domain) => {
    ID_DOMAIN = await getDomainId(domain);
    if(!ID_DOMAIN) return;

    configAxios.method = "DELETE";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

    try {
        const response = await axios(configAxios);
        customerLoggerInfo.log('info', `Deleting domain ${domain} successfully`);
        console.log(`${domain} successfully removed`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:Deleting domain ${domain}; code status:${e.response.status};`);
        console.error(e.response.data.errors);
    }
}

const deleteJsonOrCsvOrXlsxDomain = async (domains, source) => {

    domains.map(async domain => {
        // data check if CVS or XLSX -> domain.domain, if JSON domain
        domain.domain === undefined
            ? currentDomain = domain
            : currentDomain = domain.domain

        ID_DOMAIN = await getDomainId(currentDomain);
        if(!ID_DOMAIN) return;

        configAxios.method = "DELETE";
        configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

        try {
            const response = await axios(configAxios);
            customerLoggerInfo.log('info', `Deleting domain ${response.data.result.id} from ${source} successfully`);
            console.log(`${response.data.result.id} successfully removed`);
        } catch (e) {
            if (e.response) {
                customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:Deleting ${currentDomain} from ${source}; code status:${e.response.status};`);
                console.error(e.response.data.errors);
            } else {
                customerLoggerError.log('error', `message:${e.message} func:Deleting ${currentDomain} from ${source}; code status: throw new Error; `);
                console.error(e.message);
            }
        }
    })
}


// module.exports = addDomainToCloudFlare;
module.exports.getDomainId = getDomainId;
module.exports.addNameDomain = addNameDomain;
module.exports.deleteNameDomain = deleteNameDomain;
module.exports.addJsonOrCsvOrXlsxDomain = addJsonOrCsvOrXlsxDomain;
module.exports.deleteJsonOrCsvOrXlsxDomain = deleteJsonOrCsvOrXlsxDomain;

