/*
Buyer Index Page which lists the available companies for the user to search.
 */
'use strict';

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
TouchableNativeFeedback,
  BackAndroid,
  ListView,
  ScrollView,
  Image,
  Alert
} from 'react-native';

import ProductPage from './ProductPage';
import Button from 'apsl-react-native-button';
let GLOBAL = require('./Globals.js');

const dismissKeyboard = require('dismissKeyboard')

// This is the component for each row/cell
class BakeryRowCell extends React.Component {

    render() {
        return (
        <View style={styles.container}>
            <TouchableHighlight onPress={this.props.onSelect}>
                <View>
                     <Text style={styles.title}>{this.props.storeInfo.name}</Text>
                     <Text style={styles.hours}>Hours: {this.props.storeInfo.open} to {this.props.storeInfo.close}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
    }
}

// This is the component for each row/cell For Searching results.
class BakeryRowCellSearch extends React.Component {

    render() {
        return (
        <View style={styles.container}>
            <TouchableHighlight onPress={this.props.onSelect}>
                <View>
                     <Text style={styles.title}>{this.props.storeInfo.store_name}</Text>
                     <Text style={styles.hours}>Hours: {this.props.storeInfo.store_open_time} to {this.props.storeInfo.store_close_time}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
    }
}

/*Information Input used in this class as a search bar*/
class InformationInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: ''};
  }

  render(){
    return (
          <TextInput
            style = {{flex: 1}}
            onChangeText = { (text) => this.setState({text})}
            onSubmitEditing = {dismissKeyboard}
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

//Row and Section Header are used elsewhere. You can change these to anything you want.

export default class BuyerIndex extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}), /* The data source we will populate with fetch */
            loaded: false, /* Is the data loaded yet? */
            didSearch: false //Used for search results.
        };

        // Bind our functions implicitly, http://stackoverflow.com/questions/29532926/this-value-is-null-in-function-react-native
        // If you see an error about a null object, try binding the function
        this.selectBaker = this.selectBaker.bind(this);
        this.renderBakeryItemRow = this.renderBakeryItemRow.bind(this);

    }

    render()
    {
        console.log("Current ID: " + this.props.userID);
        console.log("RENDERING");
        if (!this.state.loaded)
        {
            // Have we loaded this page yet?
            // If not, let's load it and show a loading screen
            return this.renderLoadingView();
        }
        // Otherwise return the listview
        return (
        <View style = {{flex: 1, backgroundColor: '#F5FCFF' }}>
         <View style = {{marginTop: 60, backgroundColor: '#F5FCFF', flexDirection: 'row'}}>
            <InformationInput ref = "SearchBar"/>
            <Button
                  style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}}
                  textStyle={{fontSize: 20, color: 'black'}}
                  onPress = {() => this.searchBakery()}>
                 Search
              </Button>
        </View>
            <ListView
               dataSource={this.state.dataSource}
                renderRow={this.renderBakeryItemRow}
                style={styles.listView}
            />
        </View>



        );
    }

    // show Loading while we are waiting
    renderLoadingView()
    {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

   

    // render a JSON row
    renderBakeryItemRow(storeInfo)
    {
        console.log("RENDER ROW " + storeInfo.name);
        console.log("Did Search " + this.state.didSearch);
        if(this.state.didSearch){
            return (
            <View style={styles.listView}>
          <BakeryRowCellSearch storeInfo={storeInfo} onSelect={() => this.selectBaker(storeInfo)} />
                </View>
        );
            
        }
        return (
            <View style={styles.listView}>
          <BakeryRowCell storeInfo={storeInfo} onSelect={() => this.selectBaker(storeInfo)} />
                </View>
        );
    }

    // Called when a user taps on a baker
    selectBaker(storeInfo)
    {
        var storeName;
        if(!storeInfo.name){
            console.log("SELECTED " + storeInfo.store_name);
            storeName = storeInfo.store_name;
        }
        else{
            console.log("SELECTED " + storeInfo.name);
            storeName = storeInfo.name;
            }

        console.log(storeName);
        this.props.navigator.push({
            title: storeName + ' Items',
            component:  ProductPage,
            userID: this.props.userID,
            type: "Buyer",
            passProps: {storeInfo, userID: this.props.userID},
            });

    }

    /* Listener that waits for the search to be pressed.
       Applies the search to the list
       If nothing entered or if invalid, user is notified*/
    searchBakery(){
        console.log("Searching: " + this.refs.SearchBar.get_value());

        if(!this.refs.SearchBar.get_value()){ //If not an invalid or null value.... notify
            this.fetchData(GLOBAL.BASE_URL + "/stores");
        }

        else{
            this.fetchSearch(GLOBAL.BASE_URL + "/stores/search/" + this.refs.SearchBar.get_value());
        }

    }

    componentDidMount()
    {
        // This method is called when the screen is first shown
        // Your web server should be running locally
        this.fetchData(GLOBAL.BASE_URL + "/stores");
    }

    /*Fetch the API Using the searching.
      Applies some additional checking for search purposes */
    fetchSearch(url){
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status == 400){
                     Alert.alert('Uh...', 'No Results Found', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
                }
                else if(responseData.status == 404){

                }
                else{ 
                    if(!Array.isArray(responseData)){
                        console.log("Search response not an array.");
                        console.log(responseData);
                        responseData = {responseData};
                    }
                    this.setState({
                    loaded: true,
                    didSearch: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    });
                }
                console.log(responseData);
            })
            .done();
    }


    fetchData(url) {
        // Fetch data for a given URL
        // And update the dataSource, which will call render again
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    search: false,
                    didSearch: false,
                });
                console.log(responseData);
            })
            .done();
    }

}


const styles = StyleSheet.create({
  container:{
  	flex: 1,
    marginTop: 20,
    backgroundColor: '#F5FCFF',
    marginBottom: 22,
  },

    rightContainer: {
        flex: 1
    },

    contentContainer: {
        flex: 0,
        padding:10
    },

    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'black',
  },

  containerSection: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
  },
  textSection: {
    fontSize: 13,
  },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    hours:
    {
        textAlign: 'center',
        flex: 0,
    },

  containerRow: {
    flex: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRow: {
    marginLeft: 12,
    fontSize: 16,
  },
  photoRow: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});
