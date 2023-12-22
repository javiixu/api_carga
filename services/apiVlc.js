const axios = require('axios');
const apiUrl = "http://localhost:3003/apiVlc";

const getVlcData = async ()=>{
    const response = await axios.get(apiUrl)
    return response.data

}
 
module.exports = {getVlcData}