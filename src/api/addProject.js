import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function getProject () {
  let url = `${config.visualUrl}${config.getProjectUrl}`
  return axios.get(url)
}
export function getDataSource (params) {
  let url = `${config.visualUrl}${config.getDataSourceUrl}`
  return axios.post(url, qs.stringify(params))
}
export function addProject (params) {
  let url = `${config.visualUrl}${config.addProjectUrl}`
  return axios.post(url, qs.stringify(params))
}
export function goRun (params) {
  let url = `${config.visualUrl}${config.goRunUrl}`
  return axios.post(url, qs.stringify(params))
}
export function queryProject (params) {
  let url = `${config.visualUrl}${config.queryProjectUrl}`
  return axios.post(url, qs.stringify(params))
}
export function queryResult (params) {
  let url = `${config.visualUrl}${config.queryResultUrl}`
  return axios.post(url, qs.stringify(params))
}
export function executeAll (params) {
  let url = `${config.visualUrl}${config.executeAllUrl}`
  return axios.post(url, qs.stringify(params))
}
export function executeFromOne (params) {
  let url = `${config.visualUrl}${config.executeFromOneUrl}`
  return axios.post(url, qs.stringify(params))
}
export function getDataResult (params) {
  let url = `${config.visualUrl}${config.getDataResultUrl}`
  return axios.post(url, qs.stringify(params))
}
