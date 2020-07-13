import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS } from "../style/colors";
import { CustomText } from "../components/CustomText";
import { Filter } from "../Icons/Filter";
import { PriceArrows } from "../Icons/PriceArrows";
import { ListViewChanger } from "../Icons/ListViewChanger";
import { ProductCard } from "../components/ProductCard";
import { CardView } from "../Icons/CardView";
import { BottomModal } from "../components/bottomModal";
import {
  getAllData,
  selectAllProductData,
  selectFilteredProducts,
  getFilteredProducts,
} from "../store/products";
import { connect } from "react-redux";
import { GLOBAL_STYLES } from "../style/globalStyles";

const mapStateToProps = (state) => ({
  allProducts: selectAllProductData(state),
  sortedProducts: selectFilteredProducts(state),
});
export const Catalog = connect(mapStateToProps, { getFilteredProducts })(
  ({ allProducts, route, navigation, sortedProducts, getFilteredProducts }) => {
    const {
      name,
      isWomanClicked,
      categoryName,
      isOnSale = false,
      isFiltered = false,
      filteredProducts,
    } = route.params;

    const products = allProducts.allProducts;
    const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
    const [sortOption, setSortOption] = useState({
      lowestToHigh: false,
      highestToLow: false,
    });

    const [isSortingType, setIsSortingType] = useState("Price");
    const [isSorted, setIsSorted] = useState(false);

    const sortType =
      isSortingType === "Price: highest to low"
        ? "desc"
        : isSortingType === "Price: lowest to high"
        ? "asc"
        : null;

    const sortedFields = {
      category: categoryName,
      gender: isWomanClicked ? "women" : "men",
      isSortClicked: true,
      sortType,
    };

    const sortOptions = [
      {
        sortingName: "Price: lowest to high",
        sortOptionBool: "lowestToHigh",
      },
      {
        sortingName: "Price: highest to low",
        sortOptionBool: "highestToLow",
      },
    ];

    const sortingHandler = async () => await getFilteredProducts(sortedFields);

    const handleSorting = (name, sortOptionBool) => {
      setIsSortingType(name);
      setSortOption({
        ...false,
        [sortOptionBool]: !sortOption[`${sortOptionBool}`],
      });
      setIsSorted(true);
      setIsBottomModalOpen(false);
    };

    useEffect(() => {
      sortingHandler();
    }, [sortedFields.sortType]);

    const newProducts = products.filter(
      (product) =>
        product.tags.includes("new") || product.tags.includes("isNew")
    );

    const saleProducts = products.filter((product) =>
      product.tags.includes("sale")
    );

    const finalProducts =
      categoryName === "New" ? newProducts : isOnSale ? saleProducts : products;
    console.log("finalProducts", finalProducts);
    // console.log('filteredProductsData',filteredProductsData)
    const [isListView, setIsListView] = useState(true);

    const numberOfColums = isListView ? 1 : 2;

    const handleProductCard = (item) => {
      navigation.navigate("SingleProductScreen", {
        product: item,
        products: products,
      });
    };
    const result = isFiltered
      ? filteredProducts
      : isSorted
      ? sortedProducts
      : finalProducts;

    return (
      <View style={styles.container}>
        <StatusBar />
        <CustomText weight={"bold"} style={styles.title}>
          {isOnSale ? "Sale" : name}
        </CustomText>
        <View style={styles.filters}>
          <TouchableOpacity
            style={styles.filter}
            onPress={() =>
              navigation.navigate("Filters", {
                finalProducts: finalProducts,
              })
            }
          >
            <Filter width={20} height={20} />
            <CustomText>Filters</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => {
              isFiltered
                ? Alert.alert(
                    "Sorry",
                    "You can not sort products after filtering"
                  )
                : setIsBottomModalOpen(!isBottomModalOpen);
            }}
          >
            <PriceArrows width={20} height={20} />
            <CustomText>{isSortingType}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => setIsListView(!isListView)}
          >
            {isListView ? (
              <ListViewChanger width={20} height={20} />
            ) : (
              <CardView width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
        {finalProducts.length === 0 ? (
          <CustomText style={{ fontSize: 16.6, color: COLORS.SALE }}>
            Sorry, We don't have any products in {`${categoryName}`} yet!
          </CustomText>
        ) : (
          <FlatList
            data={result}
            numColumns={numberOfColums}
            key={numberOfColums}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                isInCatalog={true}
                isRowView={isListView}
                isOnSale={isOnSale}
                onPress={() => handleProductCard(item)}
              />
            )}
            keyExtractor={(item) => item.name}
          />
        )}
        {isBottomModalOpen ? (
          <BottomModal name={"SortBy"} height={250}>
            <View style={styles.sortBy}>
              <FlatList
                data={sortOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.sortingContainer,
                      {
                        backgroundColor: sortOption[`${item.sortOptionBool}`]
                          ? COLORS.PRIMARY
                          : null,
                      },
                    ]}
                    onPress={() => {
                      handleSorting(item.sortingName, item.sortOptionBool);
                    }}
                  >
                    <CustomText weight={"medium"} style={styles.sortingName}>
                      {item.sortingName}
                    </CustomText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.sortingName}
              />
            </View>
          </BottomModal>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: GLOBAL_STYLES.PADDING,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 34,
    lineHeight: 34,
    margin: 20,
  },
  btn: {
    margin: 10,
  },
  filters: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btns: {
    height: 70,
    width: "100%",
  },
  sortBy: {
    width: "100%",
    marginTop: 70,
  },
  sortingName: {
    fontSize: 18,
    lineHeight: 18,
  },
  sortingContainer: {
    width: "100%",
    padding: 16,
    alignItems: "flex-start",
  },
});
