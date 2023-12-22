const axios = require('axios');
const apiUrl = "http://localhost:3001/apiMur";

const getMurData = async ()=>{
    const response = await axios.get(apiUrl)
    return response.data

}
 
module.exports = {getMurData}