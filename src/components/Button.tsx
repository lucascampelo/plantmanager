import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import colors from '../styles/colors'

interface ButtonProps extends TouchableOpacityProps {
    title?: string;
}

export function Button({title = 'Avançar', ...rest}: ButtonProps) {
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            {...rest}
        >
        <Text style={styles.buttonText}>
            {title}
        </Text>
    </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        paddingHorizontal: 24
    },
    buttonText: {
        color: colors.white,
        fontSize: 24,
    }
})
