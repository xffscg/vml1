import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function getColumnNames (params) {
  let url = `${config.visualUrl}${config.getColumnNamesUrl}`
  return axios.get(url, params)
}
export function getColumnNameWithNumberType (params) {
  let url = `${config.visualUrl}${config.getColumnNameWithNumberTypeUrl}`
  return axios.get(url, params)
}
