import axios from 'axios'

import * as env from 'env'

export default function callApi(endpoint, method = 'GET', data) {
    return axios({
        method: method,
        url: `${env.API_URL}/${endpoint}`,
        data: data
    }).catch(err => console.log(err))
}