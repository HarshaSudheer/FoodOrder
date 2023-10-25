import {View, Image, StyleSheet} from "react-native"

const Splash = () => {
    return(
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../assets/images/little-lemon-logo.png")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logo:{
        width: 200,
        height: 200,
        resizeMode: "contain"
    }
});

export default Splash;