import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, useWindowDimensions } from "react-native";
import { registerUser } from "../services/authService";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    btnText: Math.min(width * 0.04, 16),
    dividerText: Math.min(width * 0.03, 12),
    loginText: Math.min(width * 0.038, 15),
    termsText: Math.min(width * 0.027, 11),
  }), [width]);

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSignUp = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);
    await registerUser(email, password, fullName);

    Alert.alert(
      "Account Created!",
      `Welcome ${fullName}! Your account has been created successfully.`,
      [
        {
          text: "Continue",
          onPress: () => navigation.replace("Home"),
        },
      ]
    );
  } catch (error) {
    Alert.alert("Signup Failed", error.message);
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
          <Text style={[styles.tagline, { fontSize: dynamicStyles.tagline }]}>Join your family circle</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.welcomeText, { fontSize: dynamicStyles.welcomeText }]}>Create Account</Text>
          <Text style={[styles.subText, { fontSize: dynamicStyles.subText }]}>Sign up to get started</Text>

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError, { fontSize: dynamicStyles.input }]}
              placeholder="John Doe"
              placeholderTextColor="#ccc"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: "" });
                }
              }}
              editable={!loading}
            />
            {errors.fullName && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.fullName}</Text>}
          </View>

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Confirm Password</Text>
            <View style={[styles.inputWithIcon, errors.confirmPassword && styles.inputError]}>
              <TextInput
                style={[styles.inputField, { fontSize: dynamicStyles.input }]}
                placeholder="Confirm your password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: "" });
                  }
                }}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!confirmPassword || loading}
              >
                <Text style={{ fontSize: 18 }}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.confirmPassword}</Text>}
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={[styles.requirementText, { fontSize: dynamicStyles.label }]}>
              {password.length >= 6 ? "✅" : "○"} At least 6 characters
            </Text>
            <Text style={[styles.requirementText, { fontSize: dynamicStyles.label }]}>
              {password && confirmPassword && password === confirmPassword ? "✅" : "○"} Passwords match
            </Text>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={[styles.btnText, { fontSize: dynamicStyles.btnText }]}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={[styles.dividerText, { fontSize: dynamicStyles.dividerText }]}>Already have account?</Text>
            <View style={styles.line} />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.replace("Login")}
            disabled={loading}
          >
            <Text style={[styles.btnSecondaryText, { fontSize: dynamicStyles.loginText }]}>Sign In Instead</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={[styles.termsText, { fontSize: dynamicStyles.termsText }]}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
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
  requirementsContainer: {
    backgroundColor: "#FFF5F9",
    borderRadius: 10,
    padding: "3%",
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B9D",
  },
  requirementText: {
    color: "#555",
    fontWeight: "500",
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
  btnText: {
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
    backgroundColor: "#f0f0f0",
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
