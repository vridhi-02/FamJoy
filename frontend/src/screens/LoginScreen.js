import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, useWindowDimensions } from "react-native";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { width } = useWindowDimensions();

  const dynamicStyles = useMemo(() => ({
    heroEmoji: Math.min(width * 0.14, 56),
    appName: Math.min(width * 0.085, 32),
    tagline: Math.min(width * 0.035, 14),
    welcomeText: Math.min(width * 0.06, 24),
    subText: Math.min(width * 0.033, 13),
    label: Math.min(width * 0.03, 12),
    input: Math.min(width * 0.038, 15),
    errorText: Math.min(width * 0.027, 11),
    forgot: Math.min(width * 0.033, 13),
    btnText: Math.min(width * 0.04, 16),
    dividerText: Math.min(width * 0.03, 12),
    btnSecondaryText: Math.min(width * 0.038, 15),
    termsText: Math.min(width * 0.027, 11),
  }), [width]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "At least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await loginUser(email, password);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={{ fontSize: dynamicStyles.heroEmoji, marginBottom: 8 }}>👨‍👩‍👧‍👦</Text>
          <Text style={[styles.appName, { fontSize: dynamicStyles.appName }]}>FamJoy</Text>
          <Text style={[styles.tagline, { fontSize: dynamicStyles.tagline }]}>Celebrate every birthday together</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.welcomeText, { fontSize: dynamicStyles.welcomeText }]}>Welcome Back!</Text>
          <Text style={[styles.subText, { fontSize: dynamicStyles.subText }]}>Sign in to your family account</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError, { fontSize: dynamicStyles.input }]} 
              placeholder="you@family.com"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              editable={!loading}
            />
            {errors.email && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Password</Text>
            <View style={[styles.inputWithIcon, errors.password && styles.inputError]}>
              <TextInput
                style={[styles.inputField, { fontSize: dynamicStyles.input }]}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={!password || loading}
              >
                <Text style={{ fontSize: 18 }}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.password}</Text>}
          </View>

          <TouchableOpacity>
            <Text style={[styles.forgot, { fontSize: dynamicStyles.forgot }]}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnPrimary, loading && styles.btnDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={[styles.btnPrimaryText, { fontSize: dynamicStyles.btnText }]}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={[styles.dividerText, { fontSize: dynamicStyles.dividerText }]}>Don't have an account?</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity 
            style={styles.btnSecondary}
            onPress={() => navigation.navigate("SignUp")}
            disabled={loading}
          >
            <Text style={[styles.btnSecondaryText, { fontSize: dynamicStyles.btnSecondaryText }]}>Create New Account</Text>
          </TouchableOpacity>

          <Text style={[styles.termsText, { fontSize: dynamicStyles.termsText }]}>
            By signing in, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  hero: { 
    paddingTop: "12%", 
    paddingBottom: "8%", 
    paddingHorizontal: "8%",
    alignItems: "center", 
    gap: 8,
    backgroundColor: "#FF6B9D",
  },
  emoji: { 
    marginBottom: 8,
  },
  appName: { 
    color: "#fff", 
    fontWeight: "800", 
    letterSpacing: -1,
  },
  tagline: { 
    color: "rgba(255,255,255,0.85)", 
    fontWeight: "500",
  },
  formContainer: {
    padding: "6%",
    paddingBottom: "10%",
    gap: 16,
  },
  welcomeText: {
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  subText: {
    color: "#888",
    marginBottom: 12,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 4,
  },
  label: { 
    fontWeight: "700", 
    color: "#555", 
    letterSpacing: 0.3,
  },
  input: { 
    backgroundColor: "#F8F8F8", 
    borderRadius: 12, 
    padding: "4%", 
    color: "#1A1A2E",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inputWithIcon: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: "2%",
  },
  inputField: {
    flex: 1,
    padding: "4%",
    color: "#1A1A2E",
  },
  eyeIcon: {
    padding: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#FF6B9D",
    backgroundColor: "#FFF5F9",
  },
  errorText: {
    color: "#FF6B9D",
    fontWeight: "600",
    marginTop: 4,
  },
  forgot: { 
    color: "#FF6B9D", 
    fontWeight: "600", 
    textAlign: "right",
    marginTop: 4,
  },
  btnPrimary: { 
    backgroundColor: "#FF6B9D", 
    borderRadius: 12, 
    padding: "4%", 
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: { 
    color: "#fff", 
    fontWeight: "700",
  },
  divider: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10,
    marginVertical: 12,
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: "#f0f0f0" 
  },
  dividerText: { 
    color: "#999", 
    fontWeight: "500",
  },
  btnSecondary: { 
    borderRadius: 12, 
    padding: "3.5%", 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "#FF6B9D",
    backgroundColor: "#FFF5F9",
  },
  btnSecondaryText: { 
    color: "#FF6B9D", 
    fontWeight: "700",
  },
  termsText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
});
