import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tipoCuenta } = route.params || {};

  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (text) => {
    if (!tipoCuenta) return setNumero(text);

    if (tipoCuenta === "Nequi") {
      if (text === "" || /^3\d{0,10}$/.test(text)) setNumero(text);
    } else if (tipoCuenta === "Ahorro a la Mano") {
      if (text === "" || /^(0|1)(3\d{0,9})?$/.test(text)) setNumero(text);
    } else {
      if (/^\d{0,11}$/.test(text)) setNumero(text);
    }
  };

  const handleLogin = async () => {
    if (!numero || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, `${numero}@mail.com`, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        await AsyncStorage.setItem("tipoCuenta", tipoCuenta);
        await AsyncStorage.setItem("numeroCuenta", userData.numero);

        navigation.navigate("WithdrawScreen");
      } else {
        Alert.alert("Error", "No se encontró información del usuario.");
      }
    } catch (error) {
      Alert.alert("Error", "Número o contraseña incorrectos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tipoCuenta}</Text>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de cuenta"
        keyboardType="numeric"
        maxLength={11}
        value={numero}
        onChangeText={handleInputChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        keyboardType="numeric"
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50", 
  },
  cancelButton: {
    backgroundColor: "#D32F2F", 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
