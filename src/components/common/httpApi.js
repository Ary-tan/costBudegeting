import _service from './service';

export default {
  listCompany: (callback) => {
    _service({
      method: 'get',
      url: '/baseProject/listCompany'
    }).then((res) => {
      callback(res);
    })
  },
  listProject: (params, callback) => {
    _service({
      method: 'get',
      url: '/baseProject/listProject',
      params: params
    }).then((res) => {
      callback(res);
    })
  },
  addFloorApi: (params, callback) => {
    _service({
      method: 'post',
      url: '/baseProject/addProject',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  changeFloorApi: (params, callback) => {
    _service({
      method: 'post',
      url: '/baseProject/updateProject',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  deleteFloorApi: (params, callback) => {
    _service({
      method: 'post',
      url: '/baseProject/delete',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  createCostTaskItem: (params, callback) => {
    _service({
      method: 'post',
      url: '/costTaskItem/createCostTaskItem',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  listByQuery: (params, callback) => {
    _service({
      method: 'post',
      url: '/costTaskItem/listByQuery',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  costVersion: (params, callback) => {
    _service({
      method: 'post',
      url: '/costTaskItem/listVersion',
      params: params
    }).then((res) => {
      callback(res);
    })
  },
  incomeUpdate: (params, callback) => {
    _service({
      method: 'post',
      url: '/costTaskItem/update',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  costCommit: (params, callback) => {
    _service({
      method: 'post',
      url: '/costTaskItem/commit',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  createCostBudget: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/createCostBudget',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  postListByQuery: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/listByQuery',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }]
    }).then((res) => {
      callback(res);
    })
  },
  postCostVersion: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/listVersion',
      params: params
    }).then((res) => {
      callback(res);
    })
  },
  postIncomeUpdate: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/update',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  postCostCommit: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/commit',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  getComputationResult: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/getComputationResult',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  getBudgetAmount: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/getBudgetAmount',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  getYearBudgetAmount: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/getYearBudgetAmount',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  },
  listByQueryCmpy: (params, callback) => {
    _service({
      method: 'post',
      url: '/costBudget/listByQueryCmpy',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data
      }],
      data: params
    }).then((res) => {
      callback(res);
    })
  }
}
