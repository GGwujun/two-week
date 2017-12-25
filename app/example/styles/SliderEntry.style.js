import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles/index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.2;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const itemWidthTwo = slideWidth + itemHorizontalMargin * 1;

const entryBorderRadius = 8;

export const styles1 = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },

    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
        borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    }
});


export const styles2 = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth / 2.5,
        height: slideHeight / 1.5,
        paddingHorizontal: itemHorizontalMargin,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: -15
    },

    imageContainer: {
        flex: 3,
        width: itemWidth / 7
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
        borderRadius: 150
    },


    textContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 12,
    },

    title: {
        color: '#64696D',
        fontSize: 15,
        fontWeight: '400',
        letterSpacing: 0.5,
        textAlign: 'center'
    }
});
