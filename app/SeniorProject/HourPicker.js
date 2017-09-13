import ModalPicker from 'react-native-modal-picker'
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default class HourPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hourState: ''
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label: '01'},
            { key: index++, label: '02'},
            { key: index++, label: '03'},
            { key: index++, label: '04'},
            { key: index++, label: '05'},
            { key: index++, label: '06'},
            { key: index++, label: '07'},
            { key: index++, label: '08'},
            { key: index++, label: '09'},
            { key: index++, label: '10'},
            { key: index++, label: '11'},
            { key: index++, label: '12'},
        ];
//alert(`${option.label} (${option.key}) nom nom nom`) }
        return (
                <ModalPicker
                    data={data}
                    initValue='Hour'
                    onChange={(option)=>{ this.setState({hourState: option.label})}}
                    style = {{flex:1}}
                    selectTextStyle = {{fontSize: 14}}>
                </ModalPicker>
           );
    }
}