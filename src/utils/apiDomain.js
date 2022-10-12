require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY, URL_ADD_DELETE_DOMAIN} = process.env;
let {ID_USER, ID_DOMAIN} = process.env;
const axios = require("axios");

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
    }
}

const addNameDomain = async (domain) => {
    ID_USER = await getUserID();
    if (!ID_USER) {
        console.log(`Incorrect username or password for the user`)
        return
    }
    dataAxios.id = ID_USER;
    dataAxios.name = domain;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;
    configAxios.data = dataAxios;

    try {
        const response = await axios(configAxios);
        console.log(`${response.data.result[0].name} - successfully adding from CloudFlare`);
    } catch (e) {
        console.error(e.response.data.errors);
    }
}

const addJsonOrCsvOrXlsxDomain = async (domains) => {
    ID_USER = await getUserID();
    if (!ID_USER) {
        console.log(`Incorrect username or password for the user`)
        return
    }

    dataAxios.id = ID_USER;

    configAxios.method = "POST";
    configAxios.url = URL_ADD_DELETE_DOMAIN;

    domains.map(async domain =>  {
        domain.domain === undefined
            ? dataAxios.name = domain
            : dataAxios.name = domain.domain

        configAxios.data = dataAxios;

        try {
            const response = await axios(configAxios);
            console.log(`${response.data.result[0].name} - successfully adding from CloudFlare`)
        } catch (e) {
            console.error(e.response.data.errors);
        }

    })
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
        console.error(e.response.data.errors);
    }
}

const deleteNameDomain = async (domain) => {
    if (!ID_DOMAIN) {
        ID_DOMAIN = await getDomainID(domain);
        if (!ID_DOMAIN) {
            console.log(`${domain} domain not found in CloudFlare`);
            return;
        }
    } else {
        console.log('Domain cannot be empty');
        return;
    }
    configAxios.method = "DELETE";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

    try {
        const response = await axios(configAxios);
        // data validation when re-deleting a domain, the request is executed without errors, but the data is empty
        if (response.data.success) console.log(`${domain} successfully removed from CloudFlare`);
        else console.log("Missing data");
    } catch (e) {
        console.error(e.response.data.errors);
    }
}

const deleteJsonOrCsvOrXlsxDomain = async (domains) => {
    domains.map(async domain => {
        if (!ID_DOMAIN) {
            ID_DOMAIN = await getDomainID(domain);
            if (!ID_DOMAIN) {
                console.log(`${domain} domain not found in CloudFlare`);
                return;
            }
        } else {
            console.log('Domain cannot be empty');
            return;
        }

        dataAxios.id = ID_DOMAIN;
        // dataAxios.name = domain?.domain
        // data check if CVS or XLSX -> domain.domain. If JSON domain
        domain.domain === undefined
            ? dataAxios.name = domain
            : dataAxios.name = domain.domain

        configAxios.method = "DELETE";
        configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${ID_DOMAIN}`;

        try {
            const response = await axios(configAxios);
            if (response.status === 200) console.log(`${dataAxios.name} deleted successfully`);
            else console.log("Missing data");
        } catch (e) {
            console.error(e.response.data.errors);
        }
    })
}


// module.exports = addDomainToCloudFlare;
exports.getUserID = getUserID;
exports.getDomainID = getDomainID;
exports.addNameDomain = addNameDomain;
exports.deleteNameDomain = deleteNameDomain;
exports.addJsonOrCsvOrXlsxDomain = addJsonOrCsvOrXlsxDomain;
exports.deleteJsonOrCsvOrXlsxDomain = deleteJsonOrCsvOrXlsxDomain;

