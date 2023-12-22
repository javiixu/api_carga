const axios = require('axios');
const apiUrl = "http://localhost:3002/apiCat";

const getCatData = async ()=>{
    const response = await axios.get(apiUrl)
    console.log(response.data)
    return response.data

}
 
module.exports = {getCatData}