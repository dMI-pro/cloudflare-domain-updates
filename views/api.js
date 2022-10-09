const axios = require("axios");
const constants = require("../constants");
const {CF_API_EMAIL, CF_API_KEY, URL_ADD_DELETE_DOMAIN} = require("../constants");

let dataAxios = {
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
        console.log(e.response.data);
    }
}

const addNameDomain = async (domain) => {
    if (!constants.ID_USER) {
        constants.ID_USER = await getUserID();
    }
    dataAxios.id = constants.ID_USER;
    dataAxios.name = domain;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;
    configAxios.data = dataAxios;

    try {
        const response = await axios(configAxios);
        console.log(`${response.data.result[0].name} - добавлен в CloudFlare`);
    } catch (e) {
        console.error(e.response.data)
    }
}

const addJsonOrCsvOrXlsxDomain = async (domains) => {
    if (!constants.ID_USER) {
        constants.ID_USER = await getUserID();
    }

    dataAxios.id = constants.ID_USER;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;

    for (let domain of domains) {
        // data check if CVS or XLSX -> domain.domain. If JSON domain
        domain.domain === undefined
            ? dataAxios.name = domain
            : dataAxios.name = domain.domain

        configAxios.data = dataAxios;

        try {
            const response = await axios(configAxios);
            console.log(`${response.data.result[0].name} - добавлен в CloudFlare`)
        } catch (e) {
            console.error(e.response.data)
        }
    }
}

// functions for deleting a domain

const getDomainID = async (domain) => {
    configAxios.method = "GET";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}?name=${domain}`;
    try {
        const response = await axios(configAxios);
        // data validation when re-deleting a domain, the request is executed without errors, but the data is empty
        if (!response.data.result[0]) return undefined;
        return response.data.result[0].id;
    } catch (e) {
        console.error(e)
    }
}

const deleteNameDomain = async (domain) => {
    if (!constants.ID_DOMAIN) {
        constants.ID_DOMAIN = await getDomainID(domain);
        if (!constants.ID_DOMAIN) {
            console.log(`${domain} domain not found in CloudFlare`);
            return;
        }
    }
    configAxios.method = "DELETE";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${constants.ID_DOMAIN}`;
    console.log(configAxios.url)

    try {
        const response = await axios(configAxios);
        if (response.data.success) console.log(`${domain} deleted successfully`);
        else console.log("Missing data");
    } catch (e) {
        console.error(e.response.data.errors);
    }
}

const deleteJsonOrCsvOrXlsxDomain = async (domains) => {
    for (let domain of domains) {
        constants.ID_DOMAIN = await getDomainID(domain);
        if (!constants.ID_DOMAIN) {
            console.log(`${domain} domain not found in CloudFlare`);
            return;
        }

        dataAxios.id = constants.ID_DOMAIN;
        // dataAxios.name = domain?.domain
        // data check if CVS or XLSX -> domain.domain. If JSON domain
        domain.domain === undefined
            ? dataAxios.name = domain
            : dataAxios.name = domain.domain

        configAxios.method = "DELETE";
        configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${constants.ID_DOMAIN}`;

        try {
            const response = await axios(configAxios);
            if (response.data.success) console.log(`${dataAxios.name} deleted successfully`);
            else console.log("Missing data");
        } catch (e) {
            console.error(e.response.data)
        }
    }
}


// module.exports = addDomainToCloudFlare;
exports.addNameDomain = addNameDomain;
exports.deleteNameDomain = deleteNameDomain;
exports.addJsonOrCsvOrXlsxDomain = addJsonOrCsvOrXlsxDomain;
exports.deleteJsonOrCsvOrXlsxDomain = deleteJsonOrCsvOrXlsxDomain;

