/**
 * report
 * @authors Your Name (you@example.org)
 * @date    2019-11-28 18:52:06
 * @version $Id$
 */

import { config } from '@/config/url'
import axios from 'axios'
import qs from 'qs'

// export function getReport () {
//   let url = `${config.visualUrl}${config.getReportUrl}`
//   return axios.get(url);
// }
export function getReport (params) {
	console.log(params);
  let url = `${config.visualUrl}${config.getReportUrl}`
  return axios.get(url, params);
}
export function deleteReport (params) {
  let url = `${config.visualUrl}${config.deleteReportUrl}`
  return axios.post(url, qs.stringify(params));
}
export function updateReport (params) {
  let url = `${config.visualUrl}${config.updateReportUrl}`
  return axios.post(url, qs.stringify(params));
}
export function saveReport (params) {
	console.log(params);
  let url = `${config.visualUrl}${config.saveReportUrl}`
  return axios.post(url, qs.stringify(params));
}
export function getReportById (params) {
  let url = `${config.visualUrl}${config.getReportByIdUrl}`
  return axios.get(url, params);
}