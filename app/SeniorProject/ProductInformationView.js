/*
* Product Information Scene that displays specific 
* information for a specific product.
* This page can be used in 3 ways:
* 1. View the contents of a current product
* 2. Edit an existing product.
* 3. Create a new product.
*/

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Navigator,
  ScrollView,
  Image,
} from 'react-native';

import ModalPicker from 'react-native-modal-picker'

import Button from 'apsl-react-native-button';

let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard');

/*
*Information Input 
*/
class InformationInput extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
         <Text 
            style = {styles.textinput}>
          {this.props.init}
         </Text>

        );
  }

  get_value(){
    if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }
}
//MultiLineInput used for Product Description.
class MultiLineInput extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
       <View
          style = {{flex: 1}}>
          <Text
          style = {styles.multiLineInput}>
          {this.props.init}
          </Text>
        </View>

      )
  }

  get_value(){
    if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }


}

class AllergyList extends Component{
    constructor(props){
      super(props);
    }
    render(){
      //console.log("Allergy init: " + this.props.init);
      if(this.props.init != null){
      return(
          <Text style = {{fontSize: 14,
          textAlign: 'left',
          color: '#333333',}}>
          {this.props.init}
          </Text>
        )
    }
    else{
      return(
        <Text style = {{fontSize: 20,
          textAlign: 'left',
          color: '#333333',}}>
          None
          </Text>
        )    }
    }
}

//Dynamic product image component
class ProductImage extends Component{
  constructor(props){
    super(props);
    if(this.props.init != null){
      this.state = {source: this.props.init}
    }
    else{
      this.state = {source: 'https://facebook.github.io/react/img/logo_og.png'}
    }
  }

  render(){
    return(
      <Image
        style={{width: 193, height: 110, margin: 10}}
        source={{uri: this.state.source}}
       />
      )
  }

  get_value(){
    if (this.state.source)
      {
          return this.state.source;
      }
      else return "";
  }


}

class PriceInput extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Text
       style = {styles.priceInput}>
       {this.props.init}
      </Text>
      )
  }

  get_value(){
    return(this.state.text);
  }

}



export default class ProductInformationView extends Component{
  constructor(props){
    super(props) 
    /*Props for this scene:
      typeScene: has 3 possible values:
          'NEW' = new product entry
          'EDIT' = edit a current product
          'VIEW' = view a current product.
      productID: the specific productID (unless it's new)
      merchantID: the current baker viewing the page (if there is one)
      storeID: the current store viewing the page (if there is one)
    */
    //typeScene: 'Submit',
    this.state =  {
      productdata: '', //Data for a specific product. 
      loaded: false,
      //typeScene: "VIEW", //Hard coded for debugging. Change if you want to see the other views.
      dollarPrice: '',
      centPrice: '',
      allergyList: null,
    }
  }

  render(){
    console.log("RENDERING PRODUCT INFO")
    console.log (this.props.typeScene);
    console.log(this.props.storeID);
    console.log(this.props.merchantID);
    console.log(this.state.productdata);
    console.log(this.state.productdata.name);
    if (!this.state.loaded)
        {
            // Have we loaded this page yet?
            // If not, let's load it and show a loading screen
            return this.renderLoadingView();
        }

/*USER VIEW*/ //CHANGE THINGS TO PROPS
              //NEW PAGE FOR THIS.
              //CHANGE TEXT INPUTS TO TEXT.
  return(
      <TouchableWithoutFeedback onPress = {dismissKeyboard}
                                style = {{backgroundColor: '#F5FCFF'}}>
      <ScrollView style = {{flex:1, backgroundColor: '#F5FCFF'}}>
      <View style = {styles.index}>

        <View style = {styles.pictureframe}>
            <ProductImage init = {this.state.productdata.picture} />
          </View>

          <View style = {styles.infoContainer}>
          <Text style= {styles.textHeader2}> 
             Name:
            </Text>
           <InformationInput init = {this.state.productdata.name} />
          </View>

          <View style = {styles.infoContainer}>
           <Text style = {styles.textHeader2}>
              Description:
            </Text>
            <MultiLineInput init = {this.state.productdata.description}/>
            </View>

          <View style = {styles.infoContainer}>
          <Text style = {styles.textHeader2}>
            Type of good:
          </Text>
          <InformationInput init = {this.state.productdata.type}/>
          </View>

          <View style = {styles.infoContainer}>
              <Text style = {styles.textHeader}>
              Allergy List: 
              </Text>
          <AllergyList ref = "AllergyList" init = {this.state.allergyList}/>
          </View>
        
          <View style = {styles.infoContainer}>
            <Text style= {styles.priceHeader}> 
             Price:
            </Text>
            <Text style = {styles.textHeader}>
             $
            </Text>
            <PriceInput  init = {this.state.dollarPrice}/>
            <Text style = {styles.textHeader}>
             .
            </Text>
            <PriceInput  init = {this.state.centPrice} />
        </View>

        <View style = {styles.infoContainerBottom}>
          <Text style = {styles.textHeader3}>
            Unit Amount:
          </Text>
          <PriceInput ref = "UnitInput" init = {this.state.productdata.unit_amount.toString()}/>
          </View>

      </View>
      </ScrollView>
    </TouchableWithoutFeedback>

    )
}

renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

  componentDidMount() {
          this.fetchAllergens(GLOBAL.BASE_URL + "/products/" + this.props.productID + "/allergens");
          this.fetchData(GLOBAL.BASE_URL + "/products/" + this.props.productID);
  }

  fetchData(url){
    return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.parseResponse(responseJSON);
            })
            .catch((error) => {
                console.error(error);
            })
            .done();
  }

  fetchAllergens(url){
    return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                if(!Array.isArray(responseJSON)){
                  responseJSON = [responseJSON];
                }
                this.parseAllergenResponse(responseJSON);
            })
            .catch((error) => {
                console.error(error);
            })
            .done();
  }

  /* Parses the respones */
    parseResponse(responseJSON) {
        console.log("parse response");
        console.log(responseJSON);
        this.parsePrice(responseJSON.price);
        this.setState({'loaded': true, productdata: responseJSON});
    }

    parseAllergenResponse(responseJSON){
      console.log("Parsing allergies");
      //console.log(responseJSON);
      var finalList = [];
      var resultString = "";
      var check= true;
      for(i = 0; i < responseJSON.length; i++){
        if(responseJSON[i].status == 400){
          //console.log("Nothing in Json");
          this.setState({allergyList: null})
          check = false;
          i = responseJSON.length; //Bail out of loop.
        }
        else{
          finalList.push(responseJSON[i].allergen);
        }
      }

      if(check){
        for(i = 0; i < finalList.length; i++){
            resultString = resultString + finalList[i] + ", ";
        }
        this.setState({allergyList: resultString});
      }
    }


  parsePrice(price){
    let str = price.toString();
    let res = str.split(".");
    console.log(res);

    if(res[0].length == 1){
      res[0] = "0" + res[0];
    }

    if(res.length == 1){
      res[1] = "0";
    }

    console.log(res);

    if(res[1].length == 1){
      res[1] = res[1] + "0";
    }

    let test1 = res[0];
    let test2 = res[1];

    //console.log(res);
    this.setState({dollarPrice: test1, centPrice: test2});

    //console.log(this.state.dollarPrice);
    //console.log(this.state.centPrice);
  }



}


const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  infoContainerBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
    paddingBottom: 20
  },
  priceInput: {
    height: 40,
    alignItems: 'center',
    color: '#333333',
    fontSize: 18,
    paddingTop: 10
  },
  textHeader: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
  },
  textHeader2: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 10
  },
  textHeader3:{
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    marginRight: 5
  },
  index:{
    flex:1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    margin: 0
  },
  pictureframe:{
    alignSelf: 'center',
    marginTop: 55,
  },

  buttonview:{
    paddingTop: 10  
  },

  textinput:{
    height: 40,  
    width: 250,
    color: '#333333',
    fontSize: 18,
    paddingTop: 8,
    marginLeft: 5,
    flex:1
  },
  multiLineInput:{
    width: 250,
    color: '#333333',
    paddingTop: 5,
    marginLeft: 5,
    flex:1,
    fontSize: 18,
  },
  priceHeader:{
    paddingRight: 30,
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
  }

});