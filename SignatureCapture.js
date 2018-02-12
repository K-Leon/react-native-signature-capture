import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
  requireNativeComponent,
  View,
  ViewPropTypes,
  UIManager,
  DeviceEventEmitter
} from 'react-native';

class SignatureCapture extends Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.subscriptions = [];
  }

  onChange(event) {
    if(event.nativeEvent.pathName){
      if (!this.props.onSaveEvent) {
        return;
      }
      this.props.onSaveEvent({
        pathName: event.nativeEvent.pathName,
        encoded: event.nativeEvent.encoded,
      });
    }

    if(event.nativeEvent.dragged){
      if (!this.props.onDragEvent) {
        return;
      }
      this.props.onDragEvent({
        dragged: event.nativeEvent.dragged
      });
    }
  }

  componentDidMount() {
    if (this.props.onSaveEvent) {
      let sub = DeviceEventEmitter.addListener(
        'onSaveEvent',
        this.props.onSaveEvent
      );
      this.subscriptions.push(sub);
    }

    if (this.props.onDragEvent) {
      let sub = DeviceEventEmitter.addListener(
        'onDragEvent',
        this.props.onDragEvent
      );
      this.subscriptions.push(sub);
    }
  }

  componentWillUnmount() {
      this.subscriptions.forEach(sub => sub.remove());
      this.subscriptions = [];
  }

  render() {
    return (
      <RSSignatureView {...this.props} onChange={this.onChange} />
    );
  }

  saveImage() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RSSignatureView.Commands.saveImage,
      [],
    );
  }

  resetImage() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RSSignatureView.Commands.resetImage,
      [],
    );
  }
}


SignatureCapture.propTypes = {
  ...ViewPropTypes,
  rotateClockwise: PropTypes.bool,
  square: PropTypes.bool,
  saveImageFileInExtStorage: PropTypes.bool,
  viewMode: PropTypes.string,
  showNativeButtons: PropTypes.bool,
  maxSize: PropTypes.number
};

var RSSignatureView = requireNativeComponent('RSSignatureView', SignatureCapture, {
  nativeOnly: { onChange: true }
});

export default SignatureCapture;
