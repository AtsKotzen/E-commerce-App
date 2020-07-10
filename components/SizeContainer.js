import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { COLORS } from "../style/colors";
import { CustomText } from "./CustomText";



export const SizeContainer = ({width, name,onPress,bgColor,borderWidth,marginHorizontal}) => {

    return (
        <TouchableOpacity style={[styles.container, {width: width,
            backgroundColor: bgColor,
            borderWidth:borderWidth,
            marginHorizontal:marginHorizontal
        }
        ]}
                          onPress={onPress}
        >
            <CustomText
                style={styles.containerText}>{name}</CustomText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        borderColor: '#ABB4BD',
        // marginHorizontal:10,

    },
    containerText: {
        fontSize: 16,
        lineHeight: 20,
        color:"white"
    }


});
