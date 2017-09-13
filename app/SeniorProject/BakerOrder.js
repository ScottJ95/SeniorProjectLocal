import React, { Component } from 'react';
import { AppRegistry, Text, Image, View, StyleSheet, ScrollView } from 'react-native';
import Button from 'react-native-button';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';



export default class BakerOrder extends Component {
	
	_handlePress() {
    console.log('Pressed!');
  }
  
  render() {
  let pic = {
      uri: 'https://www.getupandgobaked.com/wp-content/uploads/2015/03/smart-cookie-pic-copy.jpg'
    };
	
	let up = {
      uri: 'http://www.clipartkid.com/images/849/31-up-arrow-png-free-cliparts-that-you-can-download-to-you-computer-yK0IG9-clipart.png'
    };
	
	let down = {
      uri: 'https://openclipart.org/image/2400px/svg_to_png/154963/1313159889.png'
    };
	
    return (
	
	
	//<View>
	
	 <ScrollableTabView
	tabBarTextStyle={{fontSize: 20}}
      style={{marginTop: 60, }}
      renderTabBar={() => <DefaultTabBar />}>
      
	  <ScrollView tabLabel="Orders" style={styles.tabView}>
        <View style={styles.card}>
		<Text style={styles.elementTitle} >Cookie 343</Text>
		<Image source={pic} style={{width: 193, height: 110, margin: 10}}/>
        <Button containerStyle={{padding:10, height:45, width:150, overflow:'hidden', borderRadius:4, backgroundColor: 'gray'}}
		style={{fontSize: 20, color: 'white'}} onPress={() => this._handlePress()}>
		Buy Now
	</Button> 
        </View>
		
		<View style={styles.card}>
		<Text style={styles.elementTitle} >Cookie 2</Text>
		<Image source={pic} style={{width: 193, height: 110, margin: 10}}/>
        <Button containerStyle={{padding:10, height:45, width:150, overflow:'hidden', borderRadius:4, backgroundColor: 'gray'}}
		style={{fontSize: 20, color: 'white'}} onPress={() => this._handlePress()}>
		Buy Now
	</Button> 

        </View>
        
      </ScrollView>
    </ScrollableTabView>
    );
  }
}

class ImageThingy extends Component {
	render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <Image source={pic} style={{width: 193, height: 110}}/>
    );
  }
	
}

const styles = StyleSheet.create({
	titleText: {
		fontFamily: 'Arial',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	
	elementTitle: {
		fontFamily: 'Arial',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	
	reviewText: {
		fontFamily: 'Arial',
		fontSize: 10,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	
	tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  
  }
	
});