import ModalPicker from 'react-native-modal-picker'
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default class MinutePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            minuteState: ''
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label:'00'},
            { key: index++, label:'01'},
            { key: index++, label:'02'},
            { key: index++, label:'03'},
            { key: index++, label:'04'},
            { key: index++, label:'05'},
            { key: index++, label:'06'},
            { key: index++, label:'07'},
            { key: index++, label:'08'},
            { key: index++, label:'09'},
            { key: index++, label:'10'},
            { key: index++, label:'11'},
            { key: index++, label:'12'},
            { key: index++, label:'13'},
            { key: index++, label:'14'},
            { key: index++, label:'15'},
            { key: index++, label:'16'},
            { key: index++, label:'17'},
            { key: index++, label:'18'},
            { key: index++, label:'19'},
            { key: index++, label:'20'},
            { key: index++, label:'21'},
            { key: index++, label:'22'},
            { key: index++, label:'23'},
            { key: index++, label:'24'},
            { key: index++, label:'25'},
            { key: index++, label:'26'},
            { key: index++, label:'27'},
            { key: index++, label:'28'},
            { key: index++, label:'29'},
            { key: index++, label:'30'},
            { key: index++, label:'31'},
            { key: index++, label:'32'},
            { key: index++, label:'33'},
            { key: index++, label:'34'},
            { key: index++, label:'35'},
            { key: index++, label:'36'},
            { key: index++, label:'37'},
            { key: index++, label:'38'},
            { key: index++, label:'39'},
            { key: index++, label:'40'},
            { key: index++, label:'41'},
            { key: index++, label:'42'},
            { key: index++, label:'43'},
            { key: index++, label:'44'},
            { key: index++, label:'45'},
            { key: index++, label:'46'},
            { key: index++, label:'47'},
            { key: index++, label:'48'},
            { key: index++, label:'49'},
            { key: index++, label:'50'},
            { key: index++, label:'51'},
            { key: index++, label:'52'},
            { key: index++, label:'53'},
            { key: index++, label:'54'},
            { key: index++, label:'55'},
            { key: index++, label:'56'},
            { key: index++, label:'57'},
            { key: index++, label:'58'},
            { key: index++, label:'59'},
        ];
//alert(`${option.label} (${option.key}) nom nom nom`) }
        return (
                <ModalPicker
                    data={data}
                    initValue='Minute'
                    onChange={(option)=>{ this.setState({minuteState: option.label})}}
                    style = {{flex:1}}
                    selectTextStyle = {{fontSize: 14}}>
                </ModalPicker>
           );
    }
}