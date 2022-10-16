require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY, URL_ADD_DELETE_DOMAIN} = process.env;
const {getDomainId} = require("./apiDomain");
const axios = require("axios");

const dataAxios = {
    "type": "",
    "name": "",
    "content": "",
    "ttl": "1",
};

const configAxios = {
    method: 'GET',
    url: ``,
    headers: {
        "X-Auth-Email": CF_API_EMAIL,
        "X-Auth-Key": CF_API_KEY,
        "Content-Type": "application/json"
    },
};

async function getInfoOfDnsZoneForDomain(domain, nameDnsRecord) {
    const idDomain = await getDomainId(domain);

    configAxios.method = "GET";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${idDomain}/dns_records?name=${nameDnsRecord}.${domain}`;

    try {
        const response = await axios(configAxios);
        if (!response.data.result[0])
            throw new Error(`dns record ${nameDnsRecord} not found in CloudFlare for ${domain}`);
        return {
            idDomain: idDomain,
            chosenDnsRecord: response.data.result[0]
        };
    } catch (e) {
        if (e.response) {
            console.error(e.response.data.errors);
            proccess.exit;
        } else {
            console.error(e.message);
            proccess.exit;
        }
    }
}

async function addDnsRecord(domain) {
    const idDomain = await getDomainId(domain);

    dataAxios.type = process.argv[5].toUpperCase(); // .toUpperCase
    dataAxios.name = process.argv[6];
    dataAxios.content = process.argv[7];
    dataAxios.ttl = Number(process.argv[8]) || 1;
    dataAxios.priority = Number(process.argv[9]) || 10;
    dataAxios.proxied = Boolean(process.argv[10]) || true;

    configAxios.method = "POST";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${idDomain}/dns_records`;
    configAxios.data = dataAxios;

    try {
        const response = await axios(configAxios);
        console.log(`Adding dns record ${response.data.result.type}|${response.data.result.name}|${response.data.result.content} successfully adding for ${domain}`);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

async function updateDnsRecord(domain, nameDnsRecord) {
    const {idDomain, chosenDnsRecord} = await getInfoOfDnsZoneForDomain(domain, nameDnsRecord);

    dataAxios.type = process.argv[6].toUpperCase(); // .toUpperCase
    dataAxios.name = process.argv[7];
    dataAxios.content = process.argv[8];
    dataAxios.ttl = Number(process.argv[9]) || 1;
    dataAxios.proxied = Boolean(process.argv[10]) || true;
    configAxios.data = dataAxios;

    configAxios.method = "PUT";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${idDomain}/dns_records/${chosenDnsRecord.id}`;

    try {
        const response = await axios(configAxios);
        console.log(`Updating dns record ${nameDnsRecord} to ${response.data.result.name} successfully`);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

async function deleteDnsRecord(domain, nameDnsRecord) {
    const {idDomain, chosenDnsRecord} = await getInfoOfDnsZoneForDomain(domain, nameDnsRecord);

    configAxios.method = "DELETE";
    configAxios.url = `${URL_ADD_DELETE_DOMAIN}/${idDomain}/dns_records/${chosenDnsRecord.id}`;

    try {
        const response = await axios(configAxios);
        console.log(`${nameDnsRecord} - dns record ${nameDnsRecord} successfully removed for ${domain}`);
    } catch (e) {
        console.error(e.response.data.errors);
    }
}

exports.addDnsRecord = addDnsRecord;
exports.updateDnsRecord = updateDnsRecord;
exports.deleteDnsRecord = deleteDnsRecord;
