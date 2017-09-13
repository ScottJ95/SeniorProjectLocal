/*
* User Order List Scene
* This scene displays the list of a user's order history
* The user can filter the list by year, month, or week.
* TODO: Allow the user to tap on an individual order for more information.
* 
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

//http://127.0.0.1:5000/users/1/transactions/a/w/m/y
import Button from 'apsl-react-native-button';
import TimeFilterPicker from './TimeFilterPicker.js';
import ModalPicker from 'react-native-modal-picker';
let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard');

class OrderRowCell extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    console.log("Order Info To Render:");
    if(this.props.orderInfo.status == 400){
      Alert.alert("There are no previous orders to view.");
            return(null);
    }
    //console.log(this.props.orderInfo);
    var price = this.parsePrice(this.props.orderInfo.price);

    return(
          <View style = {styles.container}>
            <TouchableNativeFeedback onPress = {this.props.onSelect}>
              <View>
               <Text style = {styles.title}> Date of Order:   {this.props.orderInfo.date}</Text>
               <Text style = {styles.hours}> Price of Order: ${price[0]}.{price[1]}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
      )
  }

  parsePrice(price){
    //console.log("Price: " + price);
    let str = price.toString();
    let res = str.split(".");
    //console.log("Res Array: " + res);

    if(res.length == 1){
      res[1] = "0";
    }

    if(res[1].length == 1){
      res[1] = res[1] + "0";
    }

   // console.log("Parsed Res: " + res);
    return(res);
  }
}

export default class UserOrderList extends Component{
  constructor(props){
    /*Props: userID: ID of current user*/
    super(props);
    this.state = {
       dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}), /* The data source we will populate with fetch */
       loaded: false, /* Is the data loaded yet? */ 
       timeFilter: 'a' //Current value of time filter. m,y,w,a
    };
  this.selectOrder = this.selectOrder.bind(this);
  this.renderOrderItemRow = this.renderOrderItemRow.bind(this);
  }

  render(){
    console.log("Current UserID: " + this.props.userID);
    console.log("RENDERING");
    if(!this.state.loaded){
      return this.renderLoadingView();

    }

    return(
        <View style = {{backgroundColor: '#F5FCFF', flex:1}}>
        <View>
        <TimeFilterPicker ref = "TimeFilter"/>
        </View>
          <Button
              style={{backgroundColor: '#dcdcdc', flex:1, alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this.filterOrder()}>
            Set Filter
          </Button>
            <ListView
               dataSource={this.state.dataSource}
                renderRow={this.renderOrderItemRow}
                style={styles.listView}/>
            
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
    renderOrderItemRow(orderInfo)
    {
      if(orderInfo == null){
        return(null);
      }
        console.log("RENDER ROW " + orderInfo.order_id);
        //console.log(orderInfo);
        return (
            <View style={styles.listView}>
          <OrderRowCell orderInfo={orderInfo} onSelect={() => this.selectOrder(orderInfo)} />
                </View>
        );
    }

    // Called when a user taps on an order for now does nothing.
    selectOrder(orderInfo)
    {
        console.log("SELECTED " + orderInfo.order_id);
        /*this.props.navigator.push({
            title: productInfo.product_name,
            component:  ProductInformationEdit,
            passProps: {productInfo, merchantID: this.props.merchantID, storeID: this.props.storeID, productID: productInfo.product_id, typeScene: "EDIT"},
            });
            */

    }

    //Called when a user submits their filter change.
    filterOrder(){
      let filterState = this.refs.TimeFilter.state.timeState;
      var filterValue;

      switch(filterState){
        case 'PastYear':
            filterValue = 'y';
            break;
        case 'PastMonth':
            filterValue = 'm';
            break;
        case 'PastWeek':
            filterValue = 'w';
            break;
        case 'AllOrders':
            filterValue = 'a';
            break;
      }

      //this.setState({timeFilter: filterValue});
      this.fetchData(GLOBAL.BASE_URL + "/users/" + this.props.userID + "/transactions/", filterValue);
    }

    componentDidMount()
    {
        // This method is called when the screen is first shown
        // Your web server should be running locally
        // To connect from Android VM to local web server, 10.0.2.2 is the IP that must be used.
        // I have no idea why Android defaults to this IP10.0.2.2
        this.fetchData(GLOBAL.BASE_URL + "/users/" + this.props.userID + "/transactions/",  this.state.timeFilter);
    }

    fetchData(url, filterValue) {
        // Fetch data for a given URL
        // And update the dataSource, which will call render again
        url = url + filterValue;
        console.log("Fetching: " + url);
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if(!Array.isArray(responseData)){
                  responseData = [responseData];
                }
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    timeFilter: filterValue//Product Info
                });
                
                
                //console.log("Check: " + responseData);
            })
            .done();
    }
}



const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 30,
    backgroundColor: '#F5FCFF',
    marginBottom: 15,
  },

  infoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },

    rightContainer: {
        flex: 1
    },

    contentContainer: {
        flex: 0,
        padding:10
    },

    listView: {
        //paddingTop: 5,
        backgroundColor: '#F5FCFF',
        marginBottom: 15,
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
  button:{

  }
});