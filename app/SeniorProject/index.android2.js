'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  TouchableHighlight, 
  TouchableOpacity,
  Picker,
  UIExplorerBlock,
  UIExplorerPage
} from 'react-native';



class Two extends React.Component {
    render(){
      return(
        <View style={{marginTop:100}}>
          <Text style={{fontSize:20}}>This is the Second Screen</Text>
          <Text>id: {this.props.id}</Text>
        </View>
    )
  } 
}

class BusinessStats extends React.Component {
    render(){
      return(
        <View style={{marginTop:100}}>
          <Text style={{fontSize:20}}>Business is great!</Text>
          <Text>id: {this.props.id}</Text>
        </View>
    )
  } 
}

class PickerScreen extends React.Component {
	
	time = {
		hour: '0',
		minute: '00',
		half: 'AM',
		mode: Picker.MODE_DIALOG,
	}
	
	  changeMode = () => {
    const newMode = this.state.mode === Picker.MODE_DIALOG
        ? Picker.MODE_DROPDOWN
        : Picker.MODE_DIALOG;
    this.setState({mode: newMode});
  };

  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };
	
    render(){
      return(
	  
        <View style={{flex: 1, flexDirection: 'row'}}>
		
		<View style={{marginTop:100}}>
			<Text style={{fontSize:20}}>Select Time:</Text>
		

		</View>
			
        </View>
    )
  } 
}



class Main extends React.Component {
   
  onPress() {
  alert("Logging Out")
  }
  
  gotoNext() {
   this.props.navigator.push({
      component: Two,
      passProps: {
        id: 'Email@students.rowan.edu',
      },
      onPress: this.onPress,
      rightText: 'Log Out'
    })
  }
  
  gotoTimePick() {
   this.props.navigator.push({
      component: PickerScreen,
      passProps: {
        id: 'Email@students.rowan.edu',
      },
      onPress: this.onPress,
      rightText: 'Log Out'
    })
  }
  
  gotoBusiness() {
   this.props.navigator.push({
      component: BusinessStats,
      passProps: {
        id: 'Email@students.rowan.edu',
      },
      onPress: this.onPress,
      rightText: 'Log Out'
    })
  }
  
  render() {
	  return(
      <View style={ styles.mainContainer }>
	  
	    <Text style={{fontSize:20}}>Open time:</Text>
      	<TouchableHighlight style={ styles.button } onPress={ () => this.gotoTimePick() }>
    	    <Text style={ styles.buttonText }>Set Open</Text>
    		</TouchableHighlight>
			
		<Text style={{fontSize:20}}>Close time:</Text>	      	
		<TouchableHighlight style={ styles.button } onPress={ () => this.gotoTimePick() }>
    	    <Text style={ styles.buttonText }>Set Close</Text>
    		</TouchableHighlight>
			
		<TouchableHighlight style={ styles.button } onPress={ () => this.gotoNext() }>
    	    <Text style={ styles.buttonText }>Manage Products</Text>
    		</TouchableHighlight>
			
		<TouchableHighlight style={ styles.button } onPress={ () => this.gotoBusiness() }>
    	    <Text style={ styles.buttonText }>Business Statistics</Text>
    		</TouchableHighlight>
			
		<TouchableHighlight style={ styles.button } onPress={ () => this.gotoNext() }>
    	    <Text style={ styles.buttonText }>Reviews</Text>
    		</TouchableHighlight>
  		</View>		
		)
	}
}

class App extends React.Component {
  
  renderScene(route, navigator) {
  	return <route.component {...route.passProps} navigator={navigator} />
  }
  
  render() {    
    return (
      <Navigator
      		style={{flex:1}}
          initialRoute={{name: 'Main', component: Main}}
          renderScene={ this.renderScene }
          navigationBar={
             <Navigator.NavigationBar 
               style={ styles.nav } 
               routeMapper={NavigationBarRouteMapper} />} 
      />
		)
  }
}


var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
        	 underlayColor="transparent"
           onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Text style={ styles.leftNavButtonText }>Back</Text>
        </TouchableHighlight>
  	)} 
  	else { return null }
  },
  RightButton(route, navigator, index, navState) {
    if (route.onPress) return ( <TouchableHighlight
    														onPress={ () => route.onPress() }>
                                <Text style={ styles.rightNavButtonText }>
                                  	{ route.rightText || 'Right Button' }
                                </Text>
                              </TouchableHighlight> )
  },
  Title(route, navigator, index, navState) {
    return <Text style={ styles.title }>Baker's Portal</Text>
  }
};


var styles = StyleSheet.create({
  mainContainer: {
  	flex: 4, 
    flexDirection: 'column', 
    marginTop:100
  },
  leftNavButtonText: {
  	fontSize: 18,
    marginLeft:13,
    marginTop:2
  },
  rightNavButtonText: {
  	fontSize: 18,
    marginRight:13,
    marginTop:2
  },
  nav: {
  	height: 60,
    backgroundColor: '#efefef'
  },
  title: {
  	marginTop:8,
    fontSize:24,
	alignItems: 'center'
  },
  button: {
  	height:60, 
    marginBottom:10, 
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
  	fontSize:18
  }
});

AppRegistry.registerComponent('AwesomeProject', () => App);
