var React = require('react');
var __ = require('i18n/client/lang.json');

var copyObj = function(obj) {
  var newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return newobj;
  } else {
    newobj = JSON.parse(JSON.stringify(obj));
  }
  return newobj;
};

class GroupSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : '',
      disabled: !!props.disabled,
      hide: !!props.hide,
      data: props.data ? copyObj(props.data) : [],
      checkedField: props.checkedField ? props.checkedField : false
    };

    this.onChange = this.onChange.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  onChange(e) {
    if (e.target.value === 'on') {
      this.setState({
        checkedField: this.props.field
      });
    } else {
      this.setState({
        checkedField: this.props.field,
        value: e.target.value
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    for (var index in this.state) {
      if (typeof this.state[index] !== 'object') {
        if (this.state[index] !== nextState[index]) {
          return true;
        }
      } else {
        if (JSON.stringify(this.state[index]) !== JSON.stringify(nextState[index])) {
          return true;
        }
      }
    }
    return false;
  }

  componentDidUpdate() {
    this.props.onAction(this.props.field, this.state);
  }

  renderData() {
    var props = this.props,
      state = this.state;
    if (state.data && state.data.length > 0) {
      return (
        <select value={state.value} disabled={state.checkedField && state.checkedField !== props.field} onChange={this.onChange}>
            {
              state.data.map(function(group) {
                return (
                  <optgroup key={group.name} label={group.name}>
                  {
                    group.data.map(function(item) {
                      return <option key={item.id} disabled={item.disabled} value={item.id}>{item.name}</option>;
                    })
                  }
                  </optgroup>
                );
              })
            }
          </select>
      );
    } else if (props.empty_text) {
      if (props.empty_text.link_info) {
        return (
          <span className={'empty-text-label'}>
            {__[props.empty_text.info]}
            <a href="#" onClick={props.onLinkClick}>
              {
                props.empty_text.link_info.map(function(m) {
                  return __[m];
                }).join('')
              }
            </a>
          </span>
        );
      } else {
        return (
          <span className="empty-text-label">{__[props.empty_text]}</span>
        );
      }
    }
  }

  render() {
    var props = this.props,
      state = this.state;
    var className = 'modal-row radio-row';
    if (props.is_long_label) {
      className += ' label-row long-label-row';
    } else {
      className += ' label-row';
    }
    if (state.hide) {
      className += ' hide';
    }

    return (
      <div className={className}>
        <div>
          {props.label + ':'}
        </div>
        <div>
          {props.checkedField && <input type="radio" checked={state.checkedField === props.field} onChange={this.onChange} />}
          {this.renderData()}
        </div>
      </div>
    );
  }
}

module.exports = GroupSelect;