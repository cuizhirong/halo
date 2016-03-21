var storage = require('client/dashboard/cores/storage');
var fetch = require('client/dashboard/cores/fetch');
var RSVP = require('rsvp');

module.exports = {
  getList: function(forced) {
    return storage.getList(['port', 'instance', 'subnet', 'securitygroup'], forced).then((data) => {
      return data.port;
    });
  },
  getSecuritygroupList: function(forced) {
    return storage.getList(['securitygroup'], forced);
  },
  getInstanceList: function(forced) {
    return storage.getList(['instance'], forced);
  },
  getSubnetList: function(forced) {
    return storage.getList(['subnet'], forced);
  },
  editPortName: function(item, newName) {
    var data = {};
    data.port = {};
    data.port.name = newName;

    return fetch.put({
      url: '/proxy/neutron/v2.0/ports/' + item.id,
      data: data
    });
  },
  deletePorts: function(items) {
    var deferredList = [];
    items.forEach((item) => {
      deferredList.push(fetch.delete({
        url: '/proxy/neutron/v2.0/ports/' + item.id
      }));
    });
    return RSVP.all(deferredList);
  },
  createPort: function(port) {
    var data = {
      port: port
    };
    return fetch.post({
      url: '/proxy/neutron/v2.0/ports',
      data: data
    });
  },
  editSecurityGroup: function(data, id) {
    return fetch.put({
      url: '/proxy/neutron/v2.0/ports/' + id,
      data: data
    });
  },
  attachInstance: function(serverId, portId) {
    return fetch.post({
      url: '/proxy/nova/v2.1/' + HALO.user.projectId + '/servers/' + serverId + '/os-interface',
      data: {
        interfaceAttachment: {
          port_id: portId
        }
      }
    });
  },
  detchInstance: function(serverId, portId) {
    return fetch.delete({
      url: '/proxy/nova/v2.1/' + HALO.user.projectId + '/servers/' + serverId + '/os-interface/' + portId
    });
  }
};
