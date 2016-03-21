var storage = require('client/dashboard/cores/storage');
var fetch = require('client/dashboard/cores/fetch');
var RSVP = require('rsvp');

module.exports = {
  getList: function(forced) {
    return storage.getList(['subnet', 'network', 'router', 'instance'], forced).then(function(data) {
      return data.subnet;
    });
  },
  editSubnetName: function(item, newName) {
    var data = {};
    data.subnet = {};
    data.subnet.name = newName;

    return fetch.put({
      url: '/proxy/neutron/v2.0/subnets/' + item.id,
      data: data
    });
  },
  deleteSubnets: function(items) {
    var deferredList = [];
    items.forEach((item) => {
      deferredList.push(fetch.delete({
        url: '/proxy/neutron/v2.0/subnets/' + item.id
      }));
    });
    return RSVP.all(deferredList);
  },
  createSubnet: function(data) {
    return fetch.post({
      url: '/proxy/neutron/v2.0/subnets',
      data: {
        subnet: data
      }
    });
  },
  updateSubnet: function(subnetId, data) {
    return fetch.put({
      url: '/proxy/neutron/v2.0/subnets/' + subnetId,
      data: {
        subnet: data
      }
    });
  },
  connectRouter: function(routerId, data) {
    return fetch.put({
      url: '/proxy/neutron/v2.0/routers/' + routerId + '/add_router_interface',
      data: data
    });
  },
  disconnectRouter: function(routerId, data) {
    return fetch.put({
      url: '/proxy/neutron/v2.0/routers/' + routerId + '/remove_router_interface',
      data: data
    });
  },
  addInstance: function(serverId, subnetId, networkId) {
    return fetch.put({
      url: '/proxy/nova/v2.1/' + HALO.user.projectId + 'servers/' + serverId + '/os-interface',
      data: {
        interfaceAttachment: {
          fixed_ips: [{
            subnet_id: subnetId
          }],
          net_id: networkId
        }
      }
    });
  },
  getNetworks: function() {
    return storage.getList(['network']).then(function(data) {
      return data.network;
    });
  },
  getInstances: function() {
    return storage.getList(['instance']).then(function(data) {
      return data.instance;
    });
  },
  getRouters: function() {
    return storage.getList(['router']).then(function(data) {
      return data.router;
    });
  },
  getSecurityGroups: function(forced) {
    return storage.getList(['securitygroup'], forced).then(function(data) {
      return data.securitygroup;
    });
  }
};
