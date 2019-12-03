import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function getModel (params) {
  let url = `${config.visualUrl}${config.getModelUrl}`
  return axios.get(url, params)
}
export function saveModel (params) {
  let url = `${config.visualUrl}${config.saveModelUrl}`
  return axios.post(url, qs.stringify(params))
}
export function deleteModel (params) {
  let url = `${config.visualUrl}${config.deleteModelUrl}`
  return axios.get(url, params)
}
