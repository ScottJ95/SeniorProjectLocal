import React, { Component } from 'react';
import {
    AppRegistry,
    ActivityIndicator,
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
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard');



export default class WriteReview extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {charsLeft: 200, reviewText: "", color: "green"};
        this.render = this.render.bind(this);

    }

    render() {
        return <ScrollView style={styles.container}>
                    <Text style = {{fontSize: 18}}>Write a review:</Text>
                    <TextInput style={{height: 60, borderColor: 'gray', borderWidth: 0.6}} multiline={true} ref={"reviewInput"} numberOfLines={3} maxLength={200} onChangeText={(text) => this.updateChars(text)}></TextInput>
                    <Text style={{color: this.state.color}}>Characters Left: {this.state.charsLeft}</Text>
                    <Button onPress={() => this.submitReview()}>Send It!</Button>
            <Modal swipeToClose={false} swipeArea={0} animationDuration={600} position={"center"} backdropPressToClose={false} ref={"reviewModal"}>
                <View style={styles.modalCard}>
                    <Text style={{textAlign: 'center'}}>{this.state.modal_text}</Text>
                    <ActivityIndicator
                        animating={this.state.show_spinner}
                        color="green"
                        size="large"
                    />
                </View>
            </Modal>
        </ScrollView>
        ;
    }

    /* Called whenever a user types inside the review textbox */
    updateChars(text)
    {

        this.setState({charsLeft: 200 - text.length,
                       reviewText: text,
                       color: (200 - text.length <= 0) ? "red" : "green"});
    }

    /* Called when the send it button is pressed */
    submitReview()
    {
        dismissKeyboard();
        this.state.modal_text = "Submitting review, please wait...";
        this.refs.reviewModal.open();
        let me = this;
        setTimeout(() =>
        {
            me.doSubmitReview();
        }, 2000);

    }

    doSubmitReview() {
        let url = GLOBAL.BASE_URL + "/storefeedback/" + this.props.storeID.toString();
        let json_to_send = {
            'user_id': parseInt(this.props.userID),
            'store_id': parseInt(this.props.storeID),
            'feedback_text': this.state.reviewText
        };
        console.log(json_to_send);
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json_to_send)
            }).then((responseData) => {
            this.responseAfterReviewSubmitted(responseData);
        })
            .done();
    }

    responseAfterReviewSubmitted(responseData) {
        console.log(responseData);
        if (responseData.status == 201)
        {
            this.state.modal_text = 'Success! Thank you for your valued feedback.';
        }
        else
        {
            this.state.modal_text = 'Sorry, you have already reviewed this place.';
        }
        this.state.show_spinner = false;
        this.forceUpdate();
        let me = this;
        /* hack to get reference inside nested scope */
        setTimeout(() => {
            me.refs.reviewModal.close();
            me.forceUpdate();

            /* Re-load the ratings. Setting the state calls componentDidUpdate on the ReviewListing (parent) component */
            this.props.parentRef.setState({loaded: false, ratings_to_show: []}); /* re-load the ratings */
            this.props.navigator.pop(); /* go back to the ratings page and show the user their work */
        }, 3000);
    }
}


const styles = StyleSheet.create({
        container:{
            flex: 2,
            marginTop: 60,
            backgroundColor: '#F5FCFF',
        },

    modalCard: {
        borderWidth: 3,
        backgroundColor: '#F5FCFF',
        borderColor: 'rgba(0,0,0,0.1)',
        marginTop: 60,
        margin: 5,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,


    },
});
