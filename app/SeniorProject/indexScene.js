import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Navigator,
  Alert,
  Picker,
  Image
} from 'react-native';


import Button from 'apsl-react-native-button';

import RegisterScene from './registerScene.js';

import BakerViewScene from './BakerViewScene.js';

import BuyerIndex from './BuyerIndex.js';

import ProductPage from './ProductPage.js';

//If you use the dynamic scene implementation, you MUST
//Import the scenes that will be transfereed to!!!!!!

const dismissKeyboard = require('dismissKeyboard');
let GLOBAL = require('./Globals');


class InformationInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: ''};
  }

  render(){
    return (
          <TextInput style = {styles.textinput} 
            onChangeText = { (text) => this.setState({text})}
            onSubmitEditing = {dismissKeyboard}
            secureTextEntry = {this.props.secure}
           />
        );
  }


}



export default class IndexScene extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: 0,
      selectedEmail: '@students.rowan.edu'
    }
  }

_navigate(name, type='Normal', selection){
    this.checkLogin(type, selection);

  }
    /*console.log("Succeded after check: " + this.state.data.succeeded);
    if(this.state.data.succeeded == false || this.state.data.succeeded == undefined){
      console.log(this.state.data.succeeded);
      return;
    }

   if(selection === 1){
    this.props.navigator.push({
      component: BakerViewScene,
      passProps: {
        name: name 
      },
      type: type
    })
  }


  else{
    this.props.navigator.push({
      component: BuyerIndex,
      passProps: {
        name: name 
      },
      type: 'Buyer'
    })
  }
    //Props are stored in for the route that is pushed into the
    //navigation stack!!!
    //You can use these props for different checks if you want.
    //if(route.animal == 'cat') // do something, render a certain scene or something
  }
  */

  _navigateRegistration(name, type){
    this.props.navigator.push({
      component: RegisterScene,
      passProps: {
        name: name //I don't get this. Why use PassProps when you can pass in node props?
      },
      type: type //Type is used to define configs. Default defined is 'Normal'.
    })


  }

  

  render() {
    return ( 
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
       <View style = {styles.index}>
          <View style = {styles.usernameview}>
           <Text style={styles.username}>
              Username:
            </Text>
          </View>
          
          

          <View style = {styles.passwordview}>
            <InformationInput ref = "Username" type = 'username' />
            <Picker
                style = {{flex:1}}
                selectedValue = {this.state.selectedEmail}
                onValueChange = {(email) => this.setState({selectedEmail: email})}>
                <Picker.Item label = "@students.rowan.edu" value = "@students.rowan.edu"/>
                <Picker.Item label = "@rowan.edu" value = "@rowan.edu"/>
            </Picker>
          </View>

          <View style = {styles.passwordview}>
            <Text style={styles.password}>
              Password:
            </Text>
          </View>

          <View style = {styles.passwordview}>
            <InformationInput ref = "Password" secure = {true} />
         </View>

		 	<View style = {styles.buttonview}>
    
          <Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress ={()=> this._navigate('RUBaked', 'Normal', 1)}>
              Login as Baker
          </Button>
        </View>

        <View style = {styles.buttonview}>
          <Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this._navigate('RUBaked', 'Normal', 2)}>
              Login as Buyer
          </Button>
          </View>

        <View style = {styles.buttonview}>
          <Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this._navigateRegistration('RUBaked', 'Normal')}>
              New user? Register now!
          </Button>
        </View>

       </View>
     </TouchableWithoutFeedback>
    );
  }

  checkLogin(type = 'Normal', selection){
    //Validates email and password
    //Data will be now set to a userid and true/false.

    let url = '';

    if(selection === 1){
      url = GLOBAL.BASE_URL + "/merchants/validate/" + this.refs.Username.state.text + this.state.selectedEmail
              + "/" + this.refs.Password.state.text
      //What are refs? Refs are references to a specific component instance
      //It allows you to reference a specific instance of a component.
      //This can be used for both built-in and custom made components.
      //So this.refs.Username references the TextInput with the reference "Username".
    }

    else{
       url = GLOBAL.BASE_URL + "/users/validate/" + this.refs.Username.state.text + this.state.selectedEmail
              + "/" + this.refs.Password.state.text
    }
 
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((responseData) =>{
          console.log("Setting state")
         console.log(responseData)
          if(responseData.succeeded == false || responseData.status == 404){
            Alert.alert('Uh oh!', 'Username and Password incorrect', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
            this.setState({
              data:responseData
            });
          }
          else{
              dismissKeyboard(); /* Close keyboard if it's still open for login */
              this.setState({
              data:responseData
              });
              if(selection === 1){

                this.props.navigator.push({
                  component: BakerViewScene,
                   passProps: {
                     merchantID: responseData.merchant_id,
                     storeID: responseData.store_id
                    },
                  type: type
                  })
                }
              else{
                this.props.navigator.push({
                    component: BuyerIndex,
                    passProps: {
                      userID: responseData.id
                    },
                    type: 'Buyer',
                    userID: responseData.id
                  })
                }
             }
      })
    .done();

    console.log("Done is done");

  }
}
//BUTTONS THAT USE THIS.NAVIGATE FUNCTION NEED TO BE DEFINED IN THE SAME CLASS. 
//THIS IS WHY I DEFINED THE REGISTER BUTTON SEPERATELY.
//WILL NEED TO DO THE SAME FOR LOGIN BUTTON WHEN THAT WORKS.


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 100
  },
  username: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    marginTop: 10,
    marginBottom: 0
  },
   password: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    paddingTop: 20,
    marginBottom: 0
  },
  index:{
    flex: 1,
    backgroundColor: '#F5FCFF',
	marginTop: 16

  },
  usernameview:{
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 50,
    marginLeft: 10
  },

  passwordview:{
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 0,
    marginLeft: 10
  },

  buttonview:{
    paddingTop: 10  
  },

  textinput:{
    paddingBottom : 0, 
    height: 40, 
    width: 150
  }
});