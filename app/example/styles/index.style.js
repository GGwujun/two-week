import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#F3F5F7',
    background2: '#F3F5F7'
};




export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
    },
    scrollviewContentContainer: {
    }
})


export const styles1 = StyleSheet.create({
    exampleContainer: {
        marginBottom: 20
    },

    slider: {
        marginTop: 8
    },

    sliderContentContainer: {
    },

    paginationContainer: {
        paddingVertical: 8,
        marginTop: -50
    },

    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4
    }
});

export const styles2 = StyleSheet.create({
    exampleContainer: {
        marginBottom: 30
    },
    slider: {},
    sliderContentContainer: {
        alignItems: 'center',
    },
});
