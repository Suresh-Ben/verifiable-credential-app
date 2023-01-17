const axios = require('axios');

const API_Key = "8d5ce5b1238d166691af";
const API_Secret = "1b88f5c8f5019ec61293e9ef8e516fc30f90c498ab63849fcba79101c397d3e8";

async function pushData(rawData) {

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    var data = JSON.stringify({
        "pinataMetadata": {
          "name": "Credit"
        },
        "pinataContent": {
          "data": rawData
        }
    });

    let hash = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
            'Content-Type': 'application/json', 
            'pinata_api_key': API_Key,
            'pinata_secret_api_key': API_Secret
        },
        data : data
    });

    return hash.data.IpfsHash;
}

function getData(hash) {
    axios.get('https://cloudflare-ipfs.com/ipfs/' + hash)
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = {pushData, getData};