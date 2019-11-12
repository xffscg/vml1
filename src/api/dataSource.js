import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

// export function rawDataPreview (params) {
//   let url = `${config.visualUrl}${config.rawDataPreviewUrl}`
//   return axios.post(url, qs.stringify(params))
// }
export function rawDataPreview (params) {
  let url = `${config.visualUrl}${config.rawDataPreviewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function currentDataPreview (params) {
  let url = `${config.visualUrl}${config.currentDataPreviewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function getAlgriList () {
  let url = `${config.visualUrl}${config.getAlgriListUrl}`
  return axios.get(url)
}
