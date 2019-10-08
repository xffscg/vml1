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
export function fullTableStatistics (params) {
  let url = `${config.visualUrl}${config.fullTableStatisticsUrl}`
  return axios.post(url, qs.stringify(params))
}
export function saveCurrentTableView (params) {
  let url = `${config.visualUrl}${config.saveCurrentTableViewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function deleteCurrentTableView (params) {
  let url = `${config.visualUrl}${config.deleteCurrentTableViewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function saveCurrentFreView (params) {
  let url = `${config.visualUrl}${config.saveCurrentFreViewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function saveCurrentCorreView (params) {
  let url = `${config.visualUrl}${config.saveCurrentCorreViewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function saveCurrentPlotView (params) {
  let url = `${config.visualUrl}${config.saveCurrentPlotViewUrl}`
  return axios.post(url, qs.stringify(params))
}
export function getViewByName (params) {
  let url = `${config.visualUrl}${config.getViewByNameUrl}`
  return axios.post(url, qs.stringify(params))
}
export function getAllViews (params) {
  let url = `${config.visualUrl}${config.getAllViewsUrl}`
  return axios.post(url, qs.stringify(params))
}
export function frequencyStatistics (params) {
  let url = `${config.visualUrl}${config.frequencyStatisticsUrl}`
  return axios.post(url, qs.stringify(params))
}
export function correlationCoefficient (params) {
  let url = `${config.visualUrl}${config.correlationCoefficientUrl}`
  return axios.post(url, qs.stringify(params))
}
export function scatterPlot (params) {
  let url = `${config.visualUrl}${config.scatterPlotUrl}`
  return axios.post(url, qs.stringify(params))
}
