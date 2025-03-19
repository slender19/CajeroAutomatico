import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Config/firebaseConfig";
import Checkbox from "expo-checkbox";

const RegisterScreen = () => {
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState(null);
  const navigation = useNavigation();

  const validarNumero = () => {
    if (tipoCuenta === "Nequi" && !/^3\d{9}$/.test(numero)) {
      return "Número inválido para Nequi (Debe empezar con 3 y tener 10 dígitos)";
    }
    if (tipoCuenta === "Ahorro a la Mano" && !/^[01]3\d{9}$/.test(numero)) {
      return "Número inválido para Ahorro a la Mano (Debe empezar con 0 o 1, el segundo dígito debe ser 3 y tener 11 dígitos)";
    }
    if (tipoCuenta === "Cuenta de Ahorros" && !/^\d{11}$/.test(numero)) {
      return "Número inválido para Cuenta de Ahorros (Debe tener 11 dígitos del 0 al 9)";
    }
    return null;
  };

  const handleRegister = async () => {
    if (!tipoCuenta) {
      Alert.alert("Error", "Debes seleccionar un tipo de cuenta.");
      return;
    }
    const error = validarNumero();
    if (error) {
      Alert.alert("Error", error);
      return;
    }
    if (!/^\d{6}$/.test(password)) {
      Alert.alert("Error", "La contraseña debe tener exactamente 6 dígitos.");
      return;
    }

    try {
      const email = `${numero}@mail.com`; 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        numero,
        tipoCuenta,
      });

      Alert.alert("Éxito", `Cuenta registrada correctamente como ${tipoCuenta}.`);
      console.log("Usuario creado:", user);
      
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Número"
        keyboardType="numeric"
        maxLength={11}
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña (6 dígitos)"
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox value={tipoCuenta === "Nequi"} onValueChange={() => setTipoCuenta("Nequi")} />
          <Text style={styles.checkboxLabel}>Nequi</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox value={tipoCuenta === "Ahorro a la Mano"} onValueChange={() => setTipoCuenta("Ahorro a la Mano")} />
          <Text style={styles.checkboxLabel}>Ahorro a la Mano</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox value={tipoCuenta === "Cuenta de Ahorros"} onValueChange={() => setTipoCuenta("Cuenta de Ahorros")} />
          <Text style={styles.checkboxLabel}>Cuenta de Ahorros</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  checkboxContainer: {
    width: "80%",
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#6200ee",
    marginTop: 10,
  },
});

export default RegisterScreen;
