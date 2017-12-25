import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import { styles1, styles2 } from '../styles/SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image() {
        const { data: { uri }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
                source={{ uri: uri }}
                containerStyle={[styles1.imageContainer, even ? styles1.imageContainerEven : {}]}
                style={styles1.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
            />
        ) : (
                <Image
                    source={{ uri: uri }}
                    style={styles1.image}
                />
            );
    }



    get image2() {
        const { data: { uri }, parallax, parallaxProps, even } = this.props;
        return parallax ? (
            <ParallaxImage
                source={{ uri: uri }}
                containerStyle={[styles2.imageContainer]}
                style={styles2.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
            />
        ) : (
                <Image
                    source={{ uri: uri }}
                    style={styles2.image}
                />
            );
    }

    render() {
        const { data: { title }, even, itemWith } = this.props;

        const uppercaseTitle = title ? (
            <Text
                style={[styles2.title]}
                numberOfLines={2}
            >
                {title}
            </Text>
        ) : false;

        if (itemWith == 'slideInnerContainer1') {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles1.slideInnerContainer}
                    onPress={() => { alert(`You've clicked '${title}'`); }}
                >
                    <View style={[styles1.imageContainer, styles1.imageContainerEven]}>
                        {this.image}
                    </View>
                </TouchableOpacity>
            );
        } else if (itemWith == 'slideInnerContainer2') {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles2.slideInnerContainer}
                    onPress={() => { alert(`You've clicked '${title}'`); }}
                >
                    <View style={styles2.imageContainer}>
                        {this.image2}
                    </View>
                    <View style={styles2.textContainer}>
                        {uppercaseTitle}
                    </View>
                </TouchableOpacity>
            );
        }
    }
}
