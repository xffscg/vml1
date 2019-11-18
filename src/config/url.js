const config = {
  visualUrl: 'http://10.108.211.130:8993', // 需要连接校园网无线
  addData : '/dataSource/upload',
  addProjectUrl: '/project/create',
  getProjectUrl: '/getProjectList',
  getDataSourceUrl: '/dataSource/getFiles?userId=1',
  getAlgriListUrl: '/operateType/getAll',
  rawDataPreviewUrl: '/dataSource/dataPreview',
  currentDataPreviewUrl: '/currentDataPreview',
  getColumnNamesUrl: '/dataSource/getColumnNames',
  getColumnNameWithNumberTypeUrl: '/dataSource/getColumnNameWithNumberType',
  fullTableStatisticsUrl: '/fullTableStatistics',
  scatterPlotUrl: '/scatterPlot',
  frequencyStatisticsUrl: '/frequencyStatistics',
  correlationCoefficientUrl: '/correlationCoefficient',
  saveCurrentTableViewUrl: '/saveViewData',
  deleteCurrentTableViewUrl: '/deleteViewData',
  saveCurrentFreViewUrl: '/saveViewData',
  saveCurrentCorreViewUrl: '/saveViewData',
  saveCurrentPlotViewUrl: '/saveViewData',
  getViewByNameUrl: '/getViewData',
  getAllViewsUrl: '/getColumnNamesAndViews',
  filterUrl: '/filter',
  fillNullValueUrl: '/fillNullValue',
  columnMapUrl: '/columnMap',
  columnSplitUrl: '/columnSplit',
  columnsMergeUrl: '/columnsMerge',
  sortUrl: '/sort',
  replaceUrl: '/replace',
  // 以下为特征工程8个功能的URL
  quantileDiscretizationUrl: '/quantileDiscretization',
  vectorIndexerUrl: '/vectorIndexer',
  standardScalerUrl: '/standardScaler',
  pcaUrl: '/pca',
  stringIndexerUrl: '/stringIndexer',
  polynomialExpansionUrl: '/polynomialExpansion',
  chiSqSelectorUrl: '/chiSqSelector',
  oneHotEncoderUrl: '/oneHotEncoder',
  // run
  goRunUrl : '/model/updateFlow',
  queryProjectUrl : '/model/getFlow',
  queryResultUrl :'/model/getRunStatus',
  executeAllUrl :'/model/executeAll',
  executeFromOneUrl :'/model/executeFromOne',
}
export { config }
