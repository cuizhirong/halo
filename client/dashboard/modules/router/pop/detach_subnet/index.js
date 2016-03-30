var commonModal = require('client/components/modal_common/index');
var config = require('./config.json');
var request = require('../../request');

function pop(obj, parent, callback) {
  config.fields[1].text = obj.rawItem.name;
  config.fields[2].text = obj.childItem.name + '(' + obj.childItem.cidr + ')';

  var props = {
    parent: parent,
    config: config,
    onInitialize: function(refs) {},
    onConfirm: function(refs, cb) {
      request.detachSubnet(obj).then(() => {
        callback && callback();
        cb(true);
      });
    },
    onAction: function(field, state, refs) {},
    onLinkClick: function() {}
  };

  commonModal(props);
}

module.exports = pop;