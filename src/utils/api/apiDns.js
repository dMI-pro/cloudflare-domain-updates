require('dotenv').config({path: `./_env/.env.${process.env.NODE_ENV === "production" ? "production" : "development"}`});
const {CF_API_EMAIL, CF_API_KEY} = process.env;
const {getDomainId} = require("./apiDomain");
const {customerLoggerInfo, customerLoggerError} = require('../../../src/utils/controller/logger');

const cf = require('cloudflare')({
    email: CF_API_EMAIL,
    key: CF_API_KEY
});

async function getInfoOfDnsZoneForDomain(domain, nameDnsRecord) {
    const idDomain = await getDomainId(domain);

    try {
        const response = await cf.dnsRecords.browse(idDomain);
        const listDnsRecords = response.result.find(item => item.name.split('.')[0] === nameDnsRecord);
        if (!listDnsRecords)
            throw new Error(`dns record ${nameDnsRecord} not found in CloudFlare for ${domain}`);

        customerLoggerInfo.log('info', `get info by dns record - ${nameDnsRecord} for ${domain}`);
        return {
            idDomain: idDomain,
            chosenDnsRecord: listDnsRecords[0]
        };
    } catch (e) {
        if (e.response) {
            customerLoggerError.log('error', `message:${e.response.data.errors[0].message}; func:get info by dns record - ${nameDnsRecord}; code status:${e.response.status};`);
            console.error(e.response.data.errors);
            proccess.exit(1) // завершить приложение ? Cannot destructure property 'idDomain' it is undefined.
        } else {
            customerLoggerError.log('error', `message:${e.message} func:get info by dns record - ${nameDnsRecord}; code status: throw new Error; `);
            console.error(e.message);
            proccess.exit(1) // завершить приложение ? Cannot destructure property 'idDomain' it is undefined.
        }
    }
}

async function addDnsRecord(domain, dataDnsRecordAdd) {
    const idDomain = await getDomainId(domain);

    try {
        const response = await cf.dnsRecords.add(idDomain, dataDnsRecordAdd);
        customerLoggerInfo.log('info', `Adding dns record ${response.result.type}|${response.result.name}|${response.result.content} successfully`);
        console.log(`Adding dns record ${response.result.type}|${response.result.name}|${response.result.content} successfully`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Adding dns record ${dataDnsRecord.name} for ${domain}; code status:${e.response.statusCode};`);
        console.error(e.response.body.errors)
    }
}

async function updateDnsRecord(domain, nameDnsRecord, dataDnsRecordUpdate) {
    const {idDomain, chosenDnsRecord} = await getInfoOfDnsZoneForDomain(domain, nameDnsRecord);

    try {
        const response = await cf.dnsRecords.edit(idDomain, chosenDnsRecord.id, dataDnsRecordUpdate);
        customerLoggerInfo.log('info', `Updating dns record ${chosenDnsRecord.type}|${chosenDnsRecord.name}|${chosenDnsRecord.content} to ${response.result.type}|${response.result.name}|${response.result.content} successfully`);
        console.log(`Updating dns record ${chosenDnsRecord.type}|${chosenDnsRecord.name}|${chosenDnsRecord.content} to ${response.result.type}|${response.result.name}|${response.result.content} successfully`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Updating dns record ${nameDnsRecord} for ${domain}; code status:${e.response.statusCode}; `);
        console.error(e.response.body.errors)
    }
}

async function deleteDnsRecord(domain, nameDnsRecord) {
    const {idDomain, chosenDnsRecord} = await getInfoOfDnsZoneForDomain(domain, nameDnsRecord);

    try {
        const response = await cf.dnsRecords.del(idDomain, chosenDnsRecord.id);
        customerLoggerInfo.log('info', `Deleting dns record ${nameDnsRecord} successfully for ${domain}`);
        console.log(`${nameDnsRecord} - dns record successfully removed for ${domain}`);
    } catch (e) {
        customerLoggerError.log('error', `message:${e.response.body.errors[0].message}; func:Deleting dns record ${nameDnsRecord} for ${domain}; code status:${e.response.statusCode};`);
        console.error(e.response.body.errors);
    }
}

exports.addDnsRecord = addDnsRecord;
exports.updateDnsRecord = updateDnsRecord;
exports.deleteDnsRecord = deleteDnsRecord;
