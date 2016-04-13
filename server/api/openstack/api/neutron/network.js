'use strict';

var async = require('async');
var Base = require('../base.js');

function Network (app) {
  this.app = app;
  this.arrService = ['neutron'];
  this.arrServiceObject = ['subnets', 'ports', 'routers'];
  Base.call(this, this.arrService, this.arrServiceObject);
}

Network.prototype = {
  makeNetwork: function (network, obj) {
    network.subnets.forEach(function (subnet, index) {
      obj.subnets.some(function (sub) {
        if (sub.id === subnet) {
          network.subnets[index] = sub;
          obj.ports.forEach(function(port){
            if (port.network_id === network.id && port.device_owner === 'network:router_interface') {
              port.fixed_ips.some(function(s){
                if (s.subnet_id === subnet) {
                  obj.routers.some(function(router){
                    if (router.id === port.device_id) {
                      sub.router = router;
                      return true;
                    } else {
                      return false;
                    }
                  });
                  return true;
                } else {
                  return false;
                }
              });
            }
          });
          return true;
        } else {
          return false;
        }
      });
    });
  },
  getNetworkList: function (req, res, next) {
    this.token = req.session.user.token;
    this.region = req.headers.region;
    async.parallel(
      [this.__networks.bind(this)].concat(this.arrAsync),
      (err, results) => {
        if (err) {
          this.handleError(err, req, res, next);
        } else {
          var obj = {};
          ['networks'].concat(this.arrServiceObject).forEach( (e, index) => {
            obj[e] = results[index][e];
          });
          this.orderByCreatedTime(obj.networks);
          obj.networks.forEach( network => {
            this.makeNetwork(network, obj);
          });
          res.json({networks: obj.networks});
        }
      }
    );
  },
  getNetworkDetails: function (req, res, next) {
    this.networkId = req.params.networkId;
    this.region = req.headers.region;
    this.token = req.session.user.token;
    async.parallel(
      [this.__networkDetail.bind(this)].concat(this.arrAsync),
      (err, results) => {
        if (err) {
          this.handleError(err, req, res, next);
        } else {
          var obj = {};
          ['network'].concat(this.arrServiceObject).forEach( (e, index) => {
            obj[e] = results[index][e];
          });
          this.makeNetwork(obj.network, obj);
          res.json({network: obj.network});
        }
      }
    );
  },
  initRoutes: function () {
    return this.__initRoutes( () => {
      this.app.get('/api/v1/networks', this.getNetworkList.bind(this));
      this.app.get('/api/v1/networks/:networkId', this.getNetworkDetails.bind(this));
    });
  }
};
module.exports = function (app, extension) {
  Object.assign(Network.prototype, Base.prototype);
  if (extension) {
    Object.assign(Network.prototype, extension);
  }
  var network = new Network(app);
  network.initRoutes();
};