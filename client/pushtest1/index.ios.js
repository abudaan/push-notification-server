import React, {Component} from 'react'
import ReactNative from 'react-native'
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  PushNotificationIOS,
  AlertIOS,
} = ReactNative
import {status, json} from './js/fetch-helpers'


const providerUrl = 'http://192.168.0.10:5000' // or replace with the url of your provider

let Button = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'white'}
        style={styles.button}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    )
  }
})


class pushtest1 extends Component {

  constructor(){
    super()
    this.state = {messages: ['registering...\n']}
  }


  render() {
    return (
      <View style={styles.container}>

        <Button
          label={'send notification'}
          onPress={this._sendNotification}
        />

        <Text style={styles.instructions}>
          {this.state.messages}
        </Text>
      </View>
    )
  }


  componentWillMount() {
    PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this))
    PushNotificationIOS.addEventListener('register', this._onRegistration.bind(this))
    PushNotificationIOS.requestPermissions({badge: 1, sound: 1, alert: 1})
    PushNotificationIOS.checkPermissions((permissions) => {
      this.state.messages.push(`permissions: ${JSON.stringify(permissions)}\n`)
      this.setState(this.state)
    })
  }


  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._onNotification)
    PushNotificationIOS.removeEventListener('register', this._onNotification)
  }


  _sendNotification() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    })
  }


  _onNotification(notification) {
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    )
  }


  _onRegistration(token){
    this.state.messages.push(`token: ${token}\n`)
    this.setState(this.state)
    console.log(token)

    // store token in database of provider
    fetch(providerUrl,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token, service: 'apn'})
    })
    .then(status)
    .then(json)
    .then(data => {
      this.state.messages.push(`token: ${JSON.stringify(data)}\n`)
      this.setState(this.state)
    })
    .catch(error => {
      this.state.messages.push(`${error}\n`)
      this.setState(this.state)
    })
  }


  _showPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      this.state.push(`permissions: ${permissions}\n`)
      this.setState(this.state)
    })
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'left',
    color: '#333333',
    marginBottom: 0,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    padding: 4,
    color: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'blue',
  },
})


AppRegistry.registerComponent('pushtest1', () => pushtest1)
