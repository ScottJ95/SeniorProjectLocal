import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Navigator,
  Picker,
  ScrollView,
  ToastAndroid
} from 'react-native';

import Button from 'apsl-react-native-button';
let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard');

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
            keyboardType={this.props.keyboardType}
           />
        );
  }

  get_value()
  {
      if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }
}


export default class RegisterScene extends Component {
  go_back_pressed(){
    this.props.navigator.pop()
  }

  register_button_pressed() {
      let url = GLOBAL.BASE_URL + '/users/';
      console.log("register button presed");
      let json_to_send =
      {
          'first_name': this.refs.first_name.get_value(),
          'last_name': this.refs.last_name.get_value(),
          'password': this.refs.password.get_value(),
          'email': this.refs.email.get_value() + this.state.selectedEmail, /* email and username are the same */
          'phone': this.refs.phone.get_value(),
          'saved_address': this.refs.address.get_value(),
          'paypal_id': 'N/A', /* make this empty string for now */
      };
      console.log(json_to_send);
      fetch(url,
          {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(json_to_send)
          }).then((responseData) => {
          console.log(responseData);
          this.props.navigator.pop(); /* go back to login screen */
         ToastAndroid.show("User Created. Please login.", 2000); //CHANGE FOR IOS
      })
          .done();
  }

  constructor(props){
    super(props)
    this.state = {
      selectedEmail: '@students.rowan.edu'
    }
  }

  render() {
    return (
        <ScrollView>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
       <View style = {styles.index}>
          <View style = {styles.usernameview}>
           <Text style={styles.username}>
              Email/Username:
            </Text>
          </View>

          <View style = {styles.passwordview}>
            <InformationInput ref={"email"} secure = {false}/>
            <Picker
                ref={"email_suffix"}
                style = {{flex:1}}
                selectedValue = {this.state.selectedEmail}
                onValueChange = {(email) => this.setState({selectedEmail: email})}>
                <Picker.Item label = "@students.rowan.edu" value = "@students.rowan.edu"/>
                <Picker.Item label = "@rowan.edu" value = "@rowan.edu"/>
            </Picker>
          </View>

          <View style = {styles.passwordview}>
            <Text style={styles.username}>
              Password:
            </Text>
          </View>

          <View style = {styles.passwordview}>
            <InformationInput ref={"password"} secure = {true} />
          </View>

           <View style = {styles.passwordview}>
               <Text style={styles.username}>
                   First Name:
               </Text>
           </View>

           <View style = {styles.passwordview}>
               <InformationInput ref={"first_name"} secure = {false} />
           </View>


           <View style = {styles.passwordview}>
               <Text style={styles.username}>
                   Last Name:
               </Text>
           </View>

           <View style = {styles.passwordview}>
               <InformationInput ref={"last_name"} secure = {false} />
           </View>

           <View style = {styles.passwordview}>
               <Text style={styles.username}>
                  Address:
               </Text>
           </View>

           <View style = {styles.passwordview}>
               <InformationInput ref={"address"} secure = {false} />
           </View>

           <View style = {styles.passwordview}>
               <Text style={styles.username}>
                   Phone:
               </Text>
           </View>

           <View style = {styles.passwordview}>
               <InformationInput ref={"phone"} secure = {false} keyboardType="numeric" />
           </View>


          <View style = {styles.buttonview}>
              <Button
                  style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}}
                  textStyle={{fontSize: 20, color: 'black'}}
                  onPress = {()=> this.register_button_pressed()}>
                 Register
              </Button>
            <Button
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this.go_back_pressed()}>
              Go Back
            </Button>
          </View>
       </View>
     </TouchableWithoutFeedback>
        </ScrollView>
    );
  }
}


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
    margin: 15
    //justifyContent: 'center'

  },
  usernameview:{
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 50
  },

  passwordview:{
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 0
  },

  buttonview:{
    paddingTop: 15
  },

  textinput:{
    paddingBottom : 0, 
    height: 40, 
    width: 150
  }
});