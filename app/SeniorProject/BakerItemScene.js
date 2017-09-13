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
    ActivityIndicator,
    Picker,
    Item
} from 'react-native';

const dismissKeyboard = require('dismissKeyboard');
let GLOBAL = require('./Globals');

class ProductRowCell extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {selected: null};
    }


    render() {
        console.log("RENDERING PRODUCT ROW CELL");
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.productInfo.product_name}</Text>
                <Text style={styles.description}>{this.props.productInfo.product_description}</Text>
                <Text style={styles.description}>Cost: {this.props.productInfo.product_price}</Text>

                <Picker selectedValue={this.state.selected} onValueChange={this.onValueChange.bind(this)}>
                    <Picker.Item label="0" value="0" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    </Picker>
            </View>
        );
    }

    onValueChange(key, value)
    {
        console.log("key " + key + " vlaue " + value);
        this.setState({selected: key});
        this.props.reference_to_parent.update_cost(this.props.productInfo.product_id, key, this.props.productInfo.product_price);


    }
}

export default class BakerItemScene extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            loaded: false,
            cost: 0.0,
        };
        this.renderProductRow = this.renderProductRow.bind(this); /* If you are using this and getting null, make this binding */
        this.renderFooter = this.renderFooter.bind(this);
        this.product_map = new Map();
    }

    render() {

        if (!this.state.loaded)
        {
            // If we're not loaded, shown the loading spinner
            this.state.dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
            return this.renderLoadingView();
        }

        else if (this.state.loaded == 'noitems')
        {
            return this.renderNoProducts();
        }

        // Otherwise, we are loade, and should show the list view
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.storetitle}>{this.props.storeInfo.name}</Text>
                    <Text style={styles.center}>Hours: {this.props.storeInfo.open}
                        to {this.props.storeInfo.close}</Text>
                    <Text style={styles.center}>Items for purchase:</Text>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderProductRow}
                        renderFooter={this.renderFooter}
                        style={styles.listView}
                        />
                </View>
            </View>
        );
    }


    renderFooter()
    {
        return (<Text>Total: ${this.state.cost}</Text>);
    }
    renderProductRow(productInfo) {
        let product_info_element =  <ProductRowCell productInfo={productInfo} reference_to_parent={this}/>;
        // Create a mapping of product_id and the React ProductRowCell
        this.product_map.set(productInfo.product_id, product_info_element);
        return (
            <View style={styles.listView}>
                {product_info_element}
                </View>
        );

    }

    renderNoProducts()
    {
        // The baker should be forced to sell at least one product
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.storetitle}>{this.props.storeInfo.name}</Text>
                    <Text style={styles.center}>Hours: {this.props.storeInfo.open}
                        to {this.props.storeInfo.close}</Text>
                    <Text style={styles.center}>No items available for purchase.</Text>
                </View>
            </View>
        );
    }

    update_cost(product_id, quantity, price)
    {
        // This method is called every time the cost is updated

        quantity = parseInt(quantity);
        price = parseFloat(price);
        let new_cost = parseFloat(quantity * price);
        this.product_map.set(product_id, new_cost); // hash map of product_id and the new_cost
        let total_cost = 0.0;
        for (var [key_product_id, val_cost] of this.product_map.entries())
        {
            total_cost = total_cost + val_cost;
        }

        this.setState({cost: parseFloat(total_cost)});

    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.storetitle}>{this.props.storeInfo.name}</Text>
                    <Text style={styles.center}>Hours: {this.props.storeInfo.open}
                        to {this.props.storeInfo.close}</Text>
                    <Text style={styles.center}>Items for purchase:</Text>
                    <ActivityIndicator
                        animating={!this.state.loaded}
                        color="green"
                        size="large"
                        />
                </View>
            </View>
        );
    }

    componentDidMount()
    {
        // Called when screen is first shown
        // Get the menu for this particular store id
        this.fetchData(GLOBAL.BASE_URL + "/store_menu/" + this.props.storeInfo.id.toString());
    }

    fetchData(url)
    {
        // Fetch data for a given URL
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status == 400)
                {
                    // If we don't have a description returned, the baker isn't selling anything
                    this.setState({loaded: 'noitems', cost: 0});
                }
                else {
                    this.setState({
                        loaded: true,
                        dataSource: this.state.dataSource.cloneWithRows(responseData),
                        cost: 0
                    });
                }
                console.log(responseData);
            })
            .done();
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        backgroundColor: '#F5FCFF',
    },

    storetitle: {
        fontSize: 16,
        textAlign: 'center'
    },

    title: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
    fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
        alignItems: 'center'
},
    center: {
        textAlign: 'center',
        flex: 0,
    }
});