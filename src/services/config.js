import axios  from "axios"
const baseUrl = '';


const GetAll = () =>  {
    return axios.get(baseUrl)
}

const Create = (newObject) => {    
    return axios.post(baseUrl,newObject)
}
const Update = (id,newObject)=> {
    return axios.put(`${baseUrl}/${id}`,newObject)
}
const Delete = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getall: GetAll,
    create: Create,
    delete: Delete,
    update: Update}   