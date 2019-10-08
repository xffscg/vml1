import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

export function quantileDiscretization (params) {
  let url = `${config.visualUrl}${config.quantileDiscretizationUrl}`
  return axios.post(url, qs.stringify(params))
}
export function vectorIndexer (params) {
  let url = `${config.visualUrl}${config.vectorIndexerUrl}`
  return axios.post(url, qs.stringify(params))
}
export function standardScaler (params) {
  let url = `${config.visualUrl}${config.standardScalerUrl}`
  return axios.post(url, qs.stringify(params))
}
export function pca (params) {
  let url = `${config.visualUrl}${config.pcaUrl}`
  return axios.post(url, qs.stringify(params))
}
export function stringIndexer (params) {
  let url = `${config.visualUrl}${config.stringIndexerUrl}`
  return axios.post(url, qs.stringify(params))
}
export function polynomialExpansion (params) {
  let url = `${config.visualUrl}${config.polynomialExpansionUrl}`
  return axios.post(url, qs.stringify(params))
}
export function chiSqSelector (params) {
  let url = `${config.visualUrl}${config.chiSqSelectorUrl}`
  return axios.post(url, qs.stringify(params))
}
export function oneHotEncoder (params) {
  let url = `${config.visualUrl}${config.oneHotEncoderUrl}`
  return axios.post(url, qs.stringify(params))
}
