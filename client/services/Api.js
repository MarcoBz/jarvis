import axios from 'axios'
const port = process.env.PORT || 4000
const url = "https://bzs-jarvis.herokuapp.com"
export default() => {
  return axios.create({
    baseURL: `http://localhost:` + port + '/api'
    //baseURL: url + '/api'
  })
}
