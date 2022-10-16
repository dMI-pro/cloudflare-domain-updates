require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY, URL_ADD_DELETE_DOMAIN} = process.env;
let {ID_USER, ID_DOMAIN} = process.env;
const axios = require("axios");

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
        return response.data.result.id;
    } catch (e) {
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
        return response.data.result[0].id;
    } catch (e) {
        if (e.response) {
            console.error(e.response.data.errors);
        } else {
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
        console.log(`${response.data.result.name} - successfully adding`);
    } catch (e) {
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
            console.log(`${response.data.result.name} - successfully adding`);
        } catch (e) {
            if (!e.response.data) {
                console.log(e.response)
            } else {
                console.error(e.response.data.errors);
            }
        }
    })
}

// functions for deleting a domain

const deleteNameDomain = async (domain) => {
    ID_DOMAIN = await getDomainId(domain);
    if (!ID_DOMAIN) return;

    configAxios.method = "DELETE";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

    try {
        const response = await axios(configAxios);
        console.log(`${domain} successfully removed`);
    } catch (e) {
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
        if (!ID_DOMAIN) return;

        configAxios.method = "DELETE";
        configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

        try {
            const response = await axios(configAxios);
            console.log(`${response.data.result.id} successfully removed`);
        } catch (e) {
            if (e.response) {
                console.error(e.response.data.errors);
            } else {
                console.error(e.message);
            }
        }
    })
}

// module.exports = addDomainToCloudFlare;
exports.getDomainId = getDomainId;
exports.addNameDomain = addNameDomain;
exports.deleteNameDomain = deleteNameDomain;
exports.addJsonOrCsvOrXlsxDomain = addJsonOrCsvOrXlsxDomain;
exports.deleteJsonOrCsvOrXlsxDomain = deleteJsonOrCsvOrXlsxDomain;

