import AppDispatcher from './app_dispatcher'
import * as PushNotifications from './push_notifications'
import * as ActionTypes from './constants/action_types'

export default {


  registerNotifications(){

    PushNotifications.register()
    .then(
      () => {
        AppDispatcher.dispatch({
          type: ActionTypes.MESSAGE,
          payload: {message: 'service worker registered'}
        })
      },
      error => {
        AppDispatcher.dispatch({
          type: ActionTypes.MESSAGE,
          payload: {message: error.toString()}
        })
      },
    )
  },


  subscribe(){
    AppDispatcher.dispatch({
      type: ActionTypes.MESSAGE,
      payload: {message: 'subscribing to push notifications'}
    })

    PushNotifications.subscribe()
    .then(
      data => {
        AppDispatcher.dispatch({
          type: ActionTypes.SUBSCRIBE,
          payload: {
            message: data.message,
            subscribed: true
          }
        })
      },
      error => {
        AppDispatcher.dispatch({
          type: ActionTypes.SUBSCRIBE,
          payload: {
            message: error.toString(),
            subscribed: false,
          }
        })
      }
    )
  },


/*
  selectBoard(e){
    let boardId = e.target.options[e.target.selectedIndex].value
    AppDispatcher.dispatch({
      type: ActionTypes.SELECT_BOARD,
      payload: {boardId}
    })
  },


  selectInterval(e){
    AppDispatcher.dispatch({
      type: ActionTypes.SELECT_INTERVAL,
      payload: {
        interval: e.target.valueAsNumber
      }
    })
  },


  start(boardId){
    AppDispatcher.dispatch({
      type: ActionTypes.START,
    })

    PinterestAPI.getPins(boardId)
    .then(data => {
      AppDispatcher.dispatch({
        type: ActionTypes.GET_PINS,
        payload: data
      })
    })
  },


  nextImage(){
    AppDispatcher.dispatch({
      type: ActionTypes.NEXT_IMAGE
    })
  },
*/

}
