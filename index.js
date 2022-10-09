const {CF_API_EMAIL, CF_API_KEY} = require("./constants");
const axios = require("axios");

async function getInfoDomain() {
    const configAxios = {
        method: 'GET',
        url: 'https://api.cloudflare.com/client/v4/zones?name=projectfinew.xyz',
        // url: 'https://api.cloudflare.com/client/v4/zones/7f7b9dd98d15d85f54a3333e425687af',
        headers: {
            "X-Auth-Email": CF_API_EMAIL,
            "X-Auth-Key": CF_API_KEY,
            "Content-Type": "application/json"
        },
    };
    try {
        const response = await axios(configAxios);
        console.log(response.data);
    } catch (e) {
        console.error(e)
    }
}

getInfoDomain().then();


// console.log(process.argv);
// api()
// api().then();
// (async () => await api())()


