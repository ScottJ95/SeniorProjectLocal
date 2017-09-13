/*
* Baker Product List Scene
* This scene displays the list of the current items the baker has for sale
* From this page, the baker can add, remove, or change a current item.
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
  Image
} from 'react-native';

import ProductInformationEdit from './ProductInformationEdit.js';
import Button from 'apsl-react-native-button';
let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard')

// This is the component for each row/cell
class BakeryRowCell extends React.Component {



    render() {
        console.log(this.props.productInfo.status);
        if(this.props.productInfo == "store_id has no menu" || this.props.productInfo == 400){
            console.log("Nothing here");
            return(null);
        }
        console.log(this.props.productInfo.product_picture);
        console.log("Price: " + this.props.productInfo.product_price)
        let price = this.parsePrice(this.props.productInfo.product_price);
        return (
        <View style={styles.container}>
            <TouchableNativeFeedback onPress={this.props.onSelect}>
                <View>
                    <View style = {{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                        <Image 
                            style = {{height: 50, width: 50, alignSelf: 'center'}}
                            source = {{uri: this.props.productInfo.product_picture}}
                        />
                    </View>
                    <Text style={styles.title}>{this.props.productInfo.product_name}</Text>
                    <Text style={styles.hours}> $ {price[0]}.{price[1]} </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
    }

    parsePrice(price){
    let str = price.toString();
    let res = str.split(".");
    //console.log(res);

    if(res.length == 1){
        res[1] = "0";
    }

    if(res[1].length == 1){
      res[1] = res[1] + "0";
    }

    //console.log(res);
    return(res);
  }
}

//Row and Section Header are used elsewhere. You can change these to anything you want.

export default class BuyerProductList extends Component{

    constructor(props) {
        super(props); //storeID, merchantID
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}), /* The data source we will populate with fetch */
            loaded: false /* Is the data loaded yet? */
        };

        // Bind our functions implicitly, http://stackoverflow.com/questions/29532926/this-value-is-null-in-function-react-native
        // If you see an error about a null object, try binding the function
        this.selectProduct = this.selectProduct.bind(this);
        this.renderProductItemRow = this.renderProductItemRow.bind(this);

    }

    render()
    {
        console.log("Current ID: " + this.props.merchantID);
        console.log("RENDERING");
        if (!this.state.loaded)
        {
            // Have we loaded this page yet?
            // If not, let's load it and show a loading screen
            return this.renderLoadingView();
        }
        // Otherwise return the listview
        return (

            <View 
                style = {{flex: 1, backgroundColor: '#F5FCFF' }}
            >
            <ListView
               dataSource={this.state.dataSource}
                renderRow={this.renderProductItemRow}
                style={styles.listView}/>
            <View syle = {{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
                onPress = {() => this.newProduct()}
                textStyle={{fontSize: 20, color: 'black'}}>
                Add a new product
            </Button>
            </View>
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
    renderProductItemRow(productInfo)
    {
        console.log("RENDER ROW " + productInfo.product_name);
        console.log(productInfo);
        return (
            <View style={styles.listView}>
          <BakeryRowCell productInfo={productInfo} onSelect={() => this.selectProduct(productInfo)} />
                </View>
        );
    }

    // Called when a user taps on a baker
    selectProduct(productInfo)
    {
        console.log("SELECTED " + productInfo.product_name);
        this.props.navigator.push({
            title: productInfo.product_name,
            component:  ProductInformationEdit,
            passProps: {productInfo, merchantID: this.props.merchantID, storeID: this.props.storeID, productID: productInfo.product_id, typeScene: "EDIT"},
            });

    }

    //Push the new product page
    newProduct()
    {
        console.log("NEW PRODUCT");
        this.props.navigator.push({
            title: "New Product",
            component: ProductInformationEdit,
            passProps: {merchantID: this.props.merchantID, storeID: this.props.storeID, typeScene: "NEW"},
        });
    }

    componentDidMount()
    {
        // This method is called when the screen is first shown
        // Your web server should be running locally
        // To connect from Android VM to local web server, 10.0.2.2 is the IP that must be used.
        // I have no idea why Android defaults to this IP10.0.2.2
        this.fetchData(GLOBAL.BASE_URL + "/store_menu/" + this.props.storeID);
    }

    fetchData(url) {
        // Fetch data for a given URL
        // And update the dataSource, which will call render again
        console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                if(!Array.isArray(responseData)){
                    responseData = [responseData];
                }
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData), //Product Info
                });
                
                
                console.log("Check: " + responseData);
            })
            .done();
    }



}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 30,
    backgroundColor: '#F5FCFF',
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
  button:{

  }
});