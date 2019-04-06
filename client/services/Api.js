import axios from 'axios'
const port = process.env.PORT || 4000
const url = "https://apricot-shortcake-65446.herokuapp.com"
export default() => {
  return axios.create({
    //baseURL: `http://localhost:` + port + '/api'
    baseURL: url + '/api'
  })
}
