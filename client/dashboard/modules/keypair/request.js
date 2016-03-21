var storage = require('client/dashboard/cores/storage');
var fetch = require('client/dashboard/cores/fetch');
var RSVP = require('rsvp');

module.exports = {
  getList: function(forced) {
    return storage.getList(['keypair'], forced).then(function(data) {
      return data.keypair;
    });
  },
  deleteKeypairs: function(items) {
    var deferredList = [];
    items.forEach((item) => {
      deferredList.push(fetch.delete({
        url: '/proxy/nova/v2.1/' + HALO.user.projectId + '/os-keypairs/' + item.name
      }));
    });
    return RSVP.all(deferredList);
  },
  createKeypair: function(data) {
    return fetch.post({
      url: '/proxy/nova/v2.1/' + HALO.user.projectId + '/os-keypairs',
      data: {
        keypair: data
      }
    }).then(function(res) {
      return res.keypair;
    });
  },
  getKeypairByName: function(name) {
    return fetch.get({
      url: '/proxy/nova/v2.1/' + HALO.user.projectId + '/os-keypairs/' + name
    });
  }
};
