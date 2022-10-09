const {getDomainID} = require("./apiDomain");
const {CF_API_EMAIL, CF_API_KEY} = require("../constants");
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

async function getDnsZoneIdForDomain(domain) {
    const id_domain = await getDomainID(domain);
    configAxios.method = "GET";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${id_domain}/dns_records`;
    try {
        const response = await axios(configAxios);
        console.log("response -> ",response.data.result);
        // возращает список dns record
        return {
            id_domain: id_domain,
            zone_id: response.data.result[0].id
        };
    } catch (e) {
        console.error(e)
    }
}

async function deleteDnsRecord(domain) {
    const {id_domain, zone_id} = await getDnsZoneIdForDomain(domain);
    console.log("array id domain ", id_domain);
    console.log("array id zone", zone_id);
    configAxios.method = "GET";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${id_domain}/dns_records/${zone_id}`;
    try {
        //const response = await axios(configAxios);
        //console.log("response -> ", response.data.result);
    } catch (e) {
        console.error(e)
    }
}

async function addDnsRecord(domain) {
    const id_domain = await getDomainID(domain);

    // data '{"type":"A","name":"example.com","content":"127.0.0.1","ttl":3600,"priority":10,"proxied":false}'
    dataAxios.type = "AAAA";
    dataAxios.name = "projectfinew.xyz";
    dataAxios.content = "162.255.119.243";
    dataAxios.ttl = "1";

    configAxios.method = "POST";
    configAxios.url = `https://api.cloudflare.com/client/v4/zones/${id_domain}/dns_records`;
    configAxios.data = dataAxios;
    try {
        const response = await axios(configAxios);
        console.log(response.data);
    } catch (e) {
        console.error(e.response.data.errors)
    }
}


exports.getDnsZoneIdForDomain = getDnsZoneIdForDomain;
exports.addDnsRecord = addDnsRecord;
exports.deleteDnsRecord = deleteDnsRecord;
