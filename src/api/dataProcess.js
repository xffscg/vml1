import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function filter (params) {
  let url = `${config.visualUrl}${config.filterUrl}`
  return axios.post(url, qs.stringify(params))
}
export function fillNullValue (params) {
  let url = `${config.visualUrl}${config.fillNullValueUrl}`
  return axios.post(url, qs.stringify(params))
}
export function columnMap (params) {
  let url = `${config.visualUrl}${config.columnMapUrl}`
  return axios.post(url, qs.stringify(params))
}
export function columnSplit (params) {
  let url = `${config.visualUrl}${config.columnSplitUrl}`
  return axios.post(url, qs.stringify(params))
}
export function columnsMerge (params) {
  let url = `${config.visualUrl}${config.columnsMergeUrl}`
  return axios.post(url, qs.stringify(params))
}
export function sort (params) {
  let url = `${config.visualUrl}${config.sortUrl}`
  return axios.post(url, qs.stringify(params))
}
export function replace (params) {
  let url = `${config.visualUrl}${config.replaceUrl}`
  return axios.post(url, qs.stringify(params))
}
