import React, {Component} from 'react'
import {Container} from 'flux/utils'
import Actions from '../actions'
import Store from '../store'
import ButtonSubscribe from '../components/subscribe'
//import Controls from '../components/controls'
//import ImageSlider from '../components/image_slider'

// only component with state

class App extends Component{

  static displayName = 'App'

  static getStores() {
    return [Store];
  }

  static calculateState(prevState){
    //console.log(prevState)
    let state = Store.getState()
    return {...state}
  }

  componentDidMount() {
    Actions.registerNotifications()
  }

  render(){
    console.log(this.state)
    let label = this.state.subscribed ? 'unsubscribe' : 'subscribe'
    return (
      <div>
        <div>{this.state.message}</div>
        <ButtonSubscribe label={label} onClick={Actions.subscribe} />
      </div>
    )
  }
}

export default Container.create(App)
