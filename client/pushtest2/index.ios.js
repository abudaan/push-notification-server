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
} from 'react-native';

import PushNotification from 'react-native-push-notification'
const url = 'http://192.168.0.10:5000/token'
/
class pushreact extends Component {

  constructor(props){
    super(props)
    this.state = {notification: 'waiting...'}
  }

  handleRegister(token) {
    //console.log('TOKEN:', token);
    this.setState({notification: `registered, got token: ${token.token}`})

    fetch(url,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token.token, os: 'ios'})
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      this.setState({notification: JSON.stringify(data)})
    })
  }

  handleNotification(notification) {
    console.log('NOTIFICATION:', notification)
    this.setState({notification: notification.message})
  }


  componentDidMount() {
    PushNotification.configure({
      onNotification: this.handleNotification.bind(this),
      onRegister: this.handleRegister.bind(this),
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      senderID: "73986316761"
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.notification}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});



AppRegistry.registerComponent('pushreact', () => pushreact);
