/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {status, json} from './js/fetch-helpers'


import PushNotification from 'react-native-push-notification'
const url = 'http://192.168.0.10:5000' // replace with the url of your own local server


// name of the class must match with the name of the Android / iOS app
class pushtest2 extends Component {

  constructor(props){
    super(props)
    this.state = {messages: ['registering...\n']}
  }

  handleRegister(token) {
    console.log('TOKEN:', token)
    this.state.messages.push(`registered, got token: ${token.token}\n`)
    this.setState(this.state)

    fetch(url + '/token',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token.token, service: 'gcm'})
    })
    .then(status)
    .then(json)
    .then(data => {
      console.log(data)
      this.state.messages.push(`${data.message}\n`)
      this.setState(this.state)
    })
    .catch(error => {
      console.log(error)
      this.state.messages.push(`${error.toString()}\n`)
      this.setState(this.state)
    })
  }

  handleNotification(notification) {
    console.log('NOTIFICATION:', notification)
    this.state.messages.push(`${notification.message}\n`)
    this.setState(this.state)
  }

  componentDidMount() {
    this.state.messages.push('mount\n')
    this.setState(this.state)
    PushNotification.configure({
      onNotification: this.handleNotification.bind(this),
      onRegister: this.handleRegister.bind(this),
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      //senderID not necessary for iOS
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          {this.state.messages}
        </Text>
      </View>
    )
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
    fontSize: 20,
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


// name of the class must match with the name of the Android / iOS app
AppRegistry.registerComponent('pushtest2', () => pushtest2)
