import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `https://api.themoviedb.org/3/`
  })
}
