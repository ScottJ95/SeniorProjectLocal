/**
 * The Index File that handles scene navigation.
 *
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Navigator,
  TouchableHighlight,
  BackAndroid
} from 'react-native';

import IndexScene from './indexScene.js';

import RegisterScene from './registerScene.js';

import BakerViewScene from './BakerViewScene.js';

import ProductInformationEdit from './ProductInformationEdit.js'

import Button from 'apsl-react-native-button';

import UserOrderList from './UserOrderList.js'

import BakerOrderListScene from './BakerOrderListScene.js';



const dismissKeyboard = require('dismissKeyboard')

var index = 0;

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState){
    if(index > 0){
      return (
        <TouchableHighlight
          underlayColor="transparent"
          style = {styles.leftButtonStyle}
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Text style={{fontSize: 20, }}>Back</Text>
        </TouchableHighlight>)
    }
    else{
      return null
    }
  },

  RightButton(route, navigator, index, navState){
    if(route.type === 'Buyer'){ 
        return(
          <TouchableHighlight
          underlayColor="transparent"
          style = {styles.rightButtonStyle}
          onPress={() => { 
                     navigator.push({
                    component: UserOrderList,
                      passProps:{
                        userID: route.userID
                      },
                    type: 'Normal' //Type is used to define configs. Default defined is 'Normal'.
                    })}}>
          <Text style={{fontSize: 20, }}>View Orders</Text> 
        </TouchableHighlight>)
    }

    else if(route.type === "OrderList"){
       return(
          <TouchableHighlight
          underlayColor="transparent"
          style = {styles.rightButtonStyle}
          onPress={() => { 
                     navigator.push({
                    component: BakerOrderListScene,
                      passProps:{
                        storeID: route.storeID
                      },
                    type: 'Normal'
                    })}}>
          <Text style={{fontSize: 20, }}>View Orders</Text> 
        </TouchableHighlight>)
    }

    /*if(route.onPress)
      return( <Button style = {styles.rightButtonStyle} 
              onPress = {() => route.onPress()}>
              Test {route.rightText || 'Right Button'}
              Test
            </Button>
            )
      },
      */
    },

    Title(route, navigator, index, navState){
      if(route.type === 'PropsTest'){
        return(
          <Text style = {{fontSize: 30}}>{route.name}</Text>
        )
      }
      else{
        return(
          <Text style = {{fontSize: 30}}>RUBaked</Text>
        )
      }
    }
  };

  var navigator; 

  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});
 


export default class SeniorProject extends Component {
  renderScene(route, navigator){
    /*if(route.name == 'IndexScene') {
      return <IndexScene navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'RegisterScene') {
      return <RegisterScene navigator = {navigator} {...route.passProps}/>
    }
    */

    //Dynamic scene rendering implementation.
    let RouteComponent = route.component
    return <RouteComponent navigator = {navigator} {...route.passProps}/>
  }


/* List of scene config options:
  PushFromRight
  FloatFromRight
  FloatFromLeft
  FloatFromBottom
  FloatFromBottomAndroid
  FadeAndroid
  HorizontalSwipeJump
  HorizontalSwipeJumpFromRight
  VerticalUpSwipeJump
  VerticalDownSwipeJump
*/
  configureScene(route,routeStack){
    if(route.type === 'Modal'){
      return Navigator.SceneConfigs.FloatFromBottom
    }

    return Navigator.SceneConfigs.PushFromRight
  }

  render() {
    return ( 
      <Navigator
        navigationBar = {
          <Navigator.NavigationBar
            style = {styles.navigationStyle}
            routeMapper = {NavigationBarRouteMapper}/>}
            //Default setup for a navigation bar.
        configureScene = {this.configureScene}
        style = {{flex: 1}}
        initialRoute = {{component: IndexScene}} 
        //initialRoute = {{component: ProductInformationScene}}
        //Component is the scene that we are passing. route.component.prop
        //Name is a ROUTE prop. route.name. It is NOT the same as a component's prop.
        //Component props allow us to make dynamic scene rendering.
        renderScene={this.renderScene} 
        ref = {(nav) => { navigator = nav; }}
      /> //Navigator
    )//Return
  }//Render
}

const styles = StyleSheet.create({
    navigationStyle: {
      backgroundColor: 'lightgray'
    },

    leftButtonStyle:{
      flex:1, 
      justifyContent: 'center'
    },

    rightButtonStyle:{
      flex:1,
      justifyContent: 'center',
      backgroundColor : 'transparent',
    },

});
console.disableYellowBox = true; /* remove warnings */
AppRegistry.registerComponent('SeniorProject', () => SeniorProject);
