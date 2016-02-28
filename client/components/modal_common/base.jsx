var React = require('react');
var {Modal, Button} = require('client/uskin/index');
var __ = require('i18n/client/lang.json');

var Input = require('./subs/input/index');
var Text = require('./subs/text/index');
var PopLink = require('./subs/pop_link/index');


class ModalBase extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: false
    };

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAction = this.onAction.bind(this);
    // this.onPop = this.onPop.bind(this);
  }

  onAction(field, state) {
    this.props.onAction(field, state, this.refs);
  }

  initialize() {
    var props = this.props;
    return props.fields.map((m) => {
      m.label = __[m.field];
      switch(m.type) {
        case 'text':
          return <Text key={m.field} ref={m.field} {...m} onAction={this.onAction} />;
        case 'input':
          return <Input key={m.field} ref={m.field} {...m} onAction={this.onAction} />;
        case 'pop_link':
          return <PopLink key={m.field} ref={m.field} {...m} onAction={this.onAction} />;
        default:
          return null;
      }
    });
  }

  componentDidMount() {
    this.props.onInitialize && this.props.onInitialize(this.refs);
  }

  onConfirm() {
    this.setState({
      disabled: true
    });
    this.props.onConfirm && this.props.onConfirm(this.refs, (success) => {
      if (success) {
        this.setState({
          visible: false
        });
      } else {
        this.setState({
          disabled: false
        });
      }

    });
  }

  // onPop() {
  //   deleteModal({
  //     title: '删除通用弹窗测试',
  //     content: '测试，这是内容区域',
  //     deleteText: '删除',
  //     cancelText: '取消',
  //     onDelete: function(data, cb) {
  //       console.log('触发删除事件:', data);
  //       setTimeout(function() {
  //         cb(true);
  //       }, 1000);
  //     },
  //     parent: this.refs.modal
  //   });
  // }

  onCancel() {
    this.setState({
      visible: false
    });
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    var props = this.props,
      state = this.state;

    return (
      <Modal ref="modal" {...props} visible={state.visible}>
        <div className="modal-bd halo-com-modal-common">
          {this.initialize()}
        </div>
        <div className="modal-ft">
          <Button value={props.confirmText} disabled={state.disabled} onClick={this.onConfirm}/>
          <Button value={props.cancelText} btnKey="cancel" type="cancel" onClick={this.onCancel}/>
        </div>
      </Modal>
    );
  }
}

module.exports = ModalBase;
