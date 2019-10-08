import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function getProject () {
  let url = `${config.visualUrl}${config.getProjectUrl}`
  return axios.get(url)
}
export function addProject (params) {
  let url = `${config.visualUrl}${config.addProjectUrl}`
  return axios.post(url, qs.stringify(params))
}
export function getDataSource () {
  let url = `${config.visualUrl}${config.getDataSourceUrl}`
  return axios.post(url)
}
