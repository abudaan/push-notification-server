import {ReduceStore} from 'flux/utils'
import AppDispatcher from './app_dispatcher'
import * as ActionTypes from './constants/action_types'
import * as DisplayStates from './constants/display_states'


class Store extends ReduceStore {

  getInitialState(){
    return {
      message: 'registering service worker',
      subscribed: false
    }
  }

  reduce(state, action) {

    switch(action.type) {

      case ActionTypes.MESSAGE:
        return {...state, message: action.payload.message}

      case ActionTypes.SUBSCRIBE:
        return {...state, ...action.payload}

      default:
        return state

    }
  }
}

export default new Store(AppDispatcher)
