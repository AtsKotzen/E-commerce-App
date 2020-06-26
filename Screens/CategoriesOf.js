import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image} from "react-native";
import {CustomText} from "../components/CustomText";
import {Back} from "../Icons/Back";
import {COLORS} from "../style/colors";
import {Btn} from "../components/Btn";
import {data} from "../DummyData/data";
import {getAllData, getAllProductData} from "../store/products";
import {connect} from "react-redux";
import store from "../store";

const mapStateToProps = (state) => ({
    allProducts: getAllProductData(state),
});
export const CategoriesOf = connect(mapStateToProps, {getAllData})(
    ({getAllData, allProducts, route, navigation}) => {
        const {isWomanClicked} = route.params;

        const categoriesMan = [];
        // const allCategories = Object.keys(data.categories);

        const everything = store.getState();
        const allCategories = everything.products.categories;
        const allCategoryNames = Object.keys(allCategories);

        console.log("everything", everything.products.categories)

        const checkMen = () => {
            for (let category of allCategoryNames) {
                if (allCategories[`${category}`].men !== undefined) {
                    categoriesMan.push(category);
                }
            }

        };
        useEffect(() => {
            checkMen();
        });

        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <Back/>
                    </TouchableOpacity>
                    <CustomText weight={'bold'} style={styles.title}>
                        Categories
                    </CustomText>
                </View>
                <Btn
                    height={50}
                    width={335}
                    bgColor={COLORS.PRIMARY}
                    btnName={"VIEW ALL ITEMS"}
                    titleStyle={{fontSize: 18}}
                />
                <CustomText weight={'bold'} style={styles.choose}>
                    Choose Category
                </CustomText>
                <View style={{marginTop: 60}}>
                    <FlatList
                        data={isWomanClicked ? allCategoryNames : categoriesMan}
                        // data={allCategories}
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.category}
                                              onPress={()=>navigation.navigate("")}>
                                <CustomText style={styles.categoryText}>
                                    {item}
                                </CustomText>
                            </TouchableOpacity>

                        )}
                        keyExtractor={item => item}
                    />
                </View>


            </View>
        );
    });

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: 360,
        backgroundColor: COLORS.BACKGROUND,
        paddingTop: 10,
        alignItems: 'center',


    },
    header: {
        flexDirection: "row",
        // justifyContent: "space-between",
        marginBottom: 20,

    },
    title: {
        color: COLORS.TEXT,
        fontSize: 30,
        lineHeight: 28,
        margin: 10,
        marginLeft: 55,
        marginRight: 75,

    },
    choose: {
        color: COLORS.GRAY,
        fontSize: 20,
        position: "absolute",
        left: 16,
        top: 150,

    },
    backIcon: {
        marginTop: 10,
    },
    category: {
        width: 355,
        padding: 20,
        marginBottom: 10,
        borderBottomWidth: 0.3,
        borderColor: COLORS.GRAY
    },
    categoryText: {
        fontSize: 16,
        lineHeight: 16,

    },

});