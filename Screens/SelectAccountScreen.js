import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SelectAccountScreen = () => {
  const navigation = useNavigation();

  const handleSelectAccount = (tipoCuenta) => {
    navigation.navigate("LoginScreen", { tipoCuenta });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu tipo de cuenta</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelectAccount("Nequi")}>
        <Image source={require("../assets/nequi.jpg")} style={styles.image} />
        <Text style={styles.buttonText}>Nequi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelectAccount("Ahorro a la Mano")}>
        <Image source={require("../assets/ahorro.png")} style={styles.image} />
        <Text style={styles.buttonText}>Ahorro a la Mano</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelectAccount("Cuenta de Ahorros")}>
        <Image source={require("../assets/cuenta.png")} style={styles.image} />
        <Text style={styles.buttonText}>Cuenta de Ahorros</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SelectAccountScreen;
