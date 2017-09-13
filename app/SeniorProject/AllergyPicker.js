import ModalPicker from 'react-native-modal-picker'
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default class AllergyPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allergyState: null
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label: "dairy"},
            { key: index++, label: "eggs"},
            { key: index++, label: "peanuts"},
            { key: index++, label: "soy"},
            { key: index++, label: "gluten"},
            { key: index++, label: "misc.nuts"},
        ];
//alert(`${option.label} (${option.key}) nom nom nom`) }
        return (
                <ModalPicker
                    data={data}
                    initValue="Pick Allergy To Add"
                    onChange={(option)=>{this.setState({allergyState: option.label})}}
                    selectTextStyle = {{fontSize: 14}}>
                </ModalPicker>
           );
    }
}