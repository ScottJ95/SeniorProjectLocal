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
  BackAndroid,
  ListView,
  Image
} from 'react-native';

import data from './dummyData1.js';

const dismissKeyboard = require('dismissKeyboard')

const SectionHeader = (props) => (
  <View style={styles.containerSection}>
    <Text style={styles.textSection}></Text>
  </View>
);


const Row = (props) => (
  <View style={styles.containerRow}>
    <Text style={styles.textRow}>
      Item Name:
    </Text>
    <Text style = {styles.quantity}>
      Qty: 
    </Text>
  </View>
);

export default class BuyerCart extends Component{
  constructor(props) {
    super(props)

    //I don't understand most of this. Was taken online. 
    //const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    //const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      //getSectionData,
      //getRowData,
    });

    //const { dataBlob, sectionIds, rowIds } = this.formatData(data);

    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2'])
    }
  }






  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row {...data} />}
        //renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        //renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
      />
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 60,
    backgroundColor: '#F5FCFF',
  },

  containerRow: {
    flex: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textRow: {
    marginLeft: 5,
    fontSize: 16,
  },

  quantity:{
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    paddingRight: 50
  },

});