import ModalPicker from 'react-native-modal-picker';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default class TimeFilterPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timeState: null
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label: "AllOrders"},
            { key: index++, label: "PastYear"},
            { key: index++, label: "PastMonth"},
            { key: index++, label: "PastWeek"},
        ];
//alert(`${option.label} (${option.key}) nom nom nom`) }
        return (
                <ModalPicker
                    data={data}
                    initValue='AllOrders'
                    onChange={(option)=>{this.setState({timeState: option.label})}}
                    style={{marginTop: 100, marginBottom: 10,}}
                    selectTextStyle = {{fontSize: 14}}>
                </ModalPicker>
           );
    }
}