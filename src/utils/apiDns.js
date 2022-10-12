require('dotenv').config({path: './_env/.env.example'});
const {CF_API_EMAIL, CF_API_KEY} = process.env;
const {getDomainID} = require("./apiDomain");
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

async function getListDnsZoneIdForDomain(domain, nameDnsRecord) {
    const idDomain = await getDomainID(domain);
    configAxios.method = "GET";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${idDomain}/dns_records?name=${nameDnsRecord}.${domain}`;
    try {
        const response = await axios(configAxios);
        return {
            idDomain: idDomain,
            chosenDnsRecord: response.data.result[0]
        };
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

async function addDnsRecord(domain) {
    const idDomain = await getDomainID(domain);

    dataAxios.type = process.argv[5].toUpperCase(); // .toUpperCase
    dataAxios.name = process.argv[6];
    dataAxios.content = process.argv[7];
    dataAxios.ttl = Number(process.argv[8]) || 1;
    dataAxios.priority = Number(process.argv[9]) || 10;
    dataAxios.proxied = Boolean(process.argv[10]) || true;

    configAxios.method = "POST";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${idDomain}/dns_records`;
    configAxios.data = dataAxios;
    try {
        const response = await axios(configAxios);
        if (response.status === 200)
            console.log(`dns record - ${response.data.result.type} ${response.data.result.name} ${response.data.result.content} successfully adding from CloudFlare`);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

async function updateDnsRecord(domain, nameDnsRecord) {
    const {idDomain, chosenDnsRecord} = await getListDnsZoneIdForDomain(domain, nameDnsRecord);
    if (!chosenDnsRecord) {
        console.log(`${nameDnsRecord} - dns record not found in CloudFlare`)
        return
    }
    dataAxios.type = process.argv[6].toUpperCase(); // .toUpperCase
    dataAxios.name = process.argv[7];
    dataAxios.content = process.argv[8];
    dataAxios.ttl = Number(process.argv[9]) || 1;
    dataAxios.proxied = Boolean(process.argv[10]) || true;
    configAxios.data = dataAxios;

    configAxios.method = "PUT";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${idDomain}/dns_records/${chosenDnsRecord.id}`;

    try {
        const response = await axios(configAxios);
        if (response.status === 200)
            console.log(`dns record - ${response.data.result.type} ${response.data.result.name} ${response.data.result.content} successfully updating from CloudFlare`);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

async function deleteDnsRecord(domain, nameDnsRecord) {
    const {idDomain, chosenDnsRecord} = await getListDnsZoneIdForDomain(domain, nameDnsRecord);
    if (!chosenDnsRecord) {
        console.log(`${nameDnsRecord} - dns record not found in CloudFlare`)
        return
    }

    configAxios.method = "DELETE";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${idDomain}/dns_records/${chosenDnsRecord.id}`;
    try {
        const response = await axios(configAxios);
        if (response.status === 200)
            console.log(`${nameDnsRecord} - dns record successfully removed from CloudFlare`);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}

exports.getListDnsZoneIdForDomain = getListDnsZoneIdForDomain;
exports.addDnsRecord = addDnsRecord;
exports.updateDnsRecord = updateDnsRecord;
exports.deleteDnsRecord = deleteDnsRecord;
