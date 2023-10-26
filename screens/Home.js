import { useLayoutEffect, useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, Pressable, FlatList, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';

import { createTable, getMenuItems, saveMenuItems, deleteDish, filterByCategories } from "../database";

const menu = [
    {
        "name": "Greek Salad",
        "price": 12.99,
        "description": "Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients.",
        "image": "greekSalad.jpg",
        "category": "starters"
    },
    {
        "name": "Bruschetta",
        "price": 7.99,
        "description": "Delicious grilled bread rubbed with garlic and topped with olive oil and salt. Our Bruschetta includes tomato and cheese.",
        "image": "bruschetta.jpg",
        "category": "starters"
    },
    {
        "name": "Grilled Fish",
        "price": 20.00,
        "description": "Fantastic grilled fish seasoned with salt.",
        "image": "grilledFish.jpg",
        "category": "mains"
    },
    {
        "name": "Pasta",
        "price": 6.99,
        "description": "Delicious pasta for your delight.",
        "image": "pasta.jpg",
        "category": "mains"
    },
    {
        "name": "Lemon Dessert",
        "price": 4.99,
        "description": "You can't go wrong with this delicious lemon dessert!",
        "image": "lemonDessert.jpg",
        "category": "desserts"
    }
]


const Home = ({ navigation }) => {
    const [initials, setInitials] = useState("HS");
    const [data, setData] = useState();
    const [categories, setCategories] = useState();
    const [activeCategories, setActiveCategories] = useState([]);
    const [search, setSearch] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Pressable onPress={() => navigation.navigate("Profile")}><View style={styles.profileHeaderContainer}><Text style={{ color: "white" }}>{initials}</Text></View></Pressable>
        });
    });

    const fetchInitials = async () => {
        try {
            const nameArr = await AsyncStorage.multiGet(["firstName", "lastName"]);
            const nameObj = nameArr.reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
            let userIntitals = "";
            if (nameObj.firstName !== null) {
                userIntitals = nameObj.firstName[0];
                setInitials(userIntitals);
            }
            if (nameObj.lastName !== null) {
                userIntitals += nameObj.lastName[0]
                setInitials(userIntitals);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchDataApi = async () => {
        try {
            const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json");
            const json = await response.json();
            const menu = json.menu;
            return menu;
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchData = async () => {
        try {
            await createTable();
            // await deleteDish();
            let menuItems = await getMenuItems();
            if (!menuItems.length) {
                menuItems = await fetchDataApi();
                await saveMenuItems(menuItems);
            }
            setData(menuItems);
            const categories = menuItems.reduce((arr, cur) => {
                if (!arr.includes(cur["category"])) {
                    arr.push(cur["category"]);
                }
                // arr.push(cur["category"]);
                return arr;
            }, []);
            setCategories(categories);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleCategories = (category) => {
        let newActiveCategories = activeCategories;
        if (!newActiveCategories.includes(category)) {
            newActiveCategories.push(category);
        }
        else {
            newActiveCategories = newActiveCategories.filter(item => item !== category);
        }
        setActiveCategories([...newActiveCategories]);
    }

    const getMenuItemsByCategories = async (activeCategoriesArg, searchArg) => {
        try {
            let menuItems = await filterByCategories(activeCategoriesArg, searchArg);
            setData(menuItems);
        }
        catch (err) {
            console.log(err);
        }
    }

    const Item = ({ name, price, description, image }) => {
        return (
            <View style={styles.menuItemContainer}>
                <View style={styles.menuItemInnerContainer}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>{name}</Text>
                        <Text style={{ width: 250, fontSize: 16, marginVertical: 10 }}>{description}</Text>
                        <Text style={{ fontSize: 18, fontWeight: "500" }}>{price}</Text>
                    </View>
                    <Image style={{ width: 100, height: 120, alignSelf: "center" }} source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}raw=true`}}/>
                    {/* <Image style={{ width: 100, height: 120, alignSelf: "center" }} source={require("../assets/images/food.png")} /> */}
                </View>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        return (
            <Item name={item.name} price={item.price} description={item.description} />
        );
    }

    const Category = ({ item }) => {
        return (
            <Pressable style={[styles.categoryContainer, activeCategories.includes(item) ? { backgroundColor: "#495E57" } : { backgroundColor: "#BEC2C0" }]} onPress={() => handleCategories(item)}>
                <Text style={[{ color: "#495E57", fontSize: 18, fontWeight: "700" }, activeCategories.includes(item) ? { color: "white" } : { color: "#495E57" }]}>{item}</Text>
            </Pressable>
        );
    }

    const renderCategory = ({ item }) => {
        return (
            <Category item={item} />
        );
    }

    useEffect(() => {
        fetchInitials();
        fetchData();
    }, []);

    useEffect(() => {
        if(data){
            let activeCategoriesArg = activeCategories
            if (!activeCategoriesArg.length) {
                activeCategoriesArg = categories;
            }
            getMenuItemsByCategories(activeCategoriesArg, search);
        }
    }, [activeCategories, search]);

    return (
        <View style={styles.container}>
            <View style={styles.bannerContainer}>
                <View style={styles.bannerInnerContainer}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.headingText}>Little Lemon</Text>
                        <Text style={styles.subText}>Chicago</Text>
                        <Text style={{ color: "white", fontSize: 16, width: 250, marginTop: 10 }}>We are a family owned Mediterranian restaurant, focussed on traditional recipes with a modern twist.</Text>
                    </View>
                    <Image style={{ height: 130, width: 100, alignSelf: "center", borderRadius: 8 }} source={require("../assets/images/hero.png")} />
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.iconContainer}><FontAwesome name="search" size={24} color="#495E57" /></View>
                    <TextInput
                        style={styles.input}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: "500", fontSize: 24, marginLeft: 10, marginBottom: 10 }}>ORDER FOR DELIVERY!</Text>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={item => item}
                    renderItem={renderCategory}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList
                style={styles.menuContainer}
                data={data}
                keyExtractor={item => item.name}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profileHeaderContainer: {
        backgroundColor: "#495E57",
        height: 40,
        width: 40,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    bannerContainer: {
        paddingHorizontal: 10,
        backgroundColor: "#495E57",
        paddingBottom: 20
    },
    bannerInnerContainer: {
        height: 220,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headingText: {
        fontWeight: '500',
        fontSize: 35,
        color: "#F4CE14"
    },
    subText: {
        fontWeight: '500',
        fontSize: 25,
        color: "white"
    },
    iconContainer: {
        height: 40,
        width: 50,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    categoryContainer: {
        backgroundColor: "#BEC2C0",
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 20
    },
    menuContainer: {
        marginTop: 30
    },
    menuItemContainer: {
        borderTopWidth: 1,
        borderColor: "#BEC2C0",
    },
    menuItemInnerContainer: {
        margin: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    input: {
        height: 40,
        width: 300,
        padding: 10,
        fontSize: 16,
        backgroundColor: "white",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 30
    },
    searchContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    }
});

export default Home;