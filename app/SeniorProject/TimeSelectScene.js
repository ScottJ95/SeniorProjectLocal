import ModalPicker from 'react-native-modal-picker'
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
  TouchableWithoutFeedback,
  UIExplorerBlock,
  UIExplorerPage
} from 'react-native';

import Button from 'apsl-react-native-button';

const dismissKeyboard = require('dismissKeyboard')


const Item = Picker.Item;


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
			
			<UIExplorerPage title="<Picker>">
        <UIExplorerBlock title="Basic Picker">
			
			<Picker
				selectedValue={this.time.hour}
				mode="dropdown"
				onValueChange={this.onValueChange.bind(this, 'hour')}>
				
				<Picker.Item label="1" value='1' />
				<Picker.Item label="2" value='2' />
				<Picker.Item label="3" value='3' />
				<Picker.Item label="4" value='4' />
				<Picker.Item label="5" value='5' />
				<Picker.Item label="6" value='6' />
				<Picker.Item label="7" value='7' />
				<Picker.Item label="8" value='8' />
				<Picker.Item label="9" value='9' />
				<Picker.Item label="10" value='10' />
				<Picker.Item label="11" value='11' />
				<Picker.Item label="12" value='12' />
			</Picker>
			
			        </UIExplorerBlock>
					      </UIExplorerPage>

		</View>
			
        </View>
    )
  } 
}
/*

export default class TimeSelectScene extends React.Component {
go_back_pressed(name, type='Normal'){
    this.props.navigator.push({
      component: RegisterScene,
      passProps: {
        name: name //I don't get this. Why use PassProps when you can pass in node props?
      },
      type: type //Type is used to define configs. Default defined is 'Normal'.
    })
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
  
    state = {
    selected1: 'key0',
    selected2: 'key1',
    selected3: 'key1',
    color: 'red',
    mode: Picker.MODE_DIALOG,
  };



   render() {
	  return(
     // <View style={ styles.mainContainer }>
	  
	    <UIExplorerPage title="<Picker>">
     
        <UIExplorerBlock title="Dropdown Picker">
          <Picker
            style={styles.picker}
            selectedValue={this.state.selected2}
			onValueChange = {this.setState.selected2}
            //onValueChange={this.onValueChange.bind(this, 'selected2')}
            mode="dropdown">
            <Item label="hello" value="key0" />
            <Item label="world" value="key1" />
          </Picker>
        </UIExplorerBlock>
		</UIExplorerPage>
  		//</View>		
		)
	}

}

*/


export default class TimeSelectionScene extends Component {

    constructor() {
        super();

        this.state = {
            textInputValue: ''
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, section: true, label: 'Fruits' },
            { key: index++, label: 'Red Apples' },
            { key: index++, label: 'Cherries' },
            { key: index++, label: 'Cranberries' },
            { key: index++, label: 'Pink Grapefruit' },
            { key: index++, label: 'Raspberries' },
            { key: index++, section: true, label: 'Vegetables' },
            { key: index++, label: 'Beets' },
            { key: index++, label: 'Red Peppers' },
            { key: index++, label: 'Radishes' },
            { key: index++, label: 'Radicchio' },
            { key: index++, label: 'Red Onions' },
            { key: index++, label: 'Red Potatoes' },
            { key: index++, label: 'Rhubarb' },
            { key: index++, label: 'Tomatoes' }
        ];

        return (
            <View style={{flex:1, justifyContent:'space-around', padding:50}}>

                <ModalPicker
                    data={data}
                    initValue='Select something yummy!'
                    onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} >

                </ModalPicker>
				<ModalPicker
                    data={data}
                    initValue="Select something yummy!"
                    onChange={(option)=>{ this.setState({textInputValue:option.label})}}>

                    <Text
                        style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30}}
						textStyle={{fontSize: 20, color: 'black'}}
                        editable={false}
                        placeholder="Select something yummy!"
                        value={this.state.textInputValue} />

                </ModalPicker>
            </View>
        );
    }
}




 changeMode = () => {
    const newMode = this.state.mode === Picker.MODE_DIALOG
        ? Picker.MODE_DROPDOWN
        : Picker.MODE_DIALOG;
    this.setState({mode: newMode});
  };
/*
  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };
  */
const styles = StyleSheet.create({
   mainContainer: {
  	flex: 4, 
    flexDirection: 'column', 
    marginTop:100
  },
  picker: {
    width: 100,
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

