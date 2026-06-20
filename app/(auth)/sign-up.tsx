import { useAuth, useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded, userId, sessionId, getToken } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }
  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      console.error("Sign up error:", error.message, null, 2);
      alert(`Sign up error: ${error.message}`);
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };
  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/sign-in");
          router.replace(url as any);
        },
      });
    }
  };
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    <View className="flex-1 justify-center px-6 py-12">
      <Image
        source={require("../assets/images/stayk.png")}
        className="w-32 h-16 mb-8"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        Verify your account
      </Text>
      <Text className="text-gray-600 mb-8">
        We've sent a verification code to your email.
      </Text>
      <TextInput
        className="flex border border-gray-300 rounded-xl px-4 py-3"
        placeholder="Enter verification code"
        keyboardType="number-pad"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="words"
        value={code}
        onChangeText={setCode}
      />
      {errors.fields.code && (
        <Text className="text-red-500 text-sm mt-2">
          {errors.fields.code.message}
        </Text>
      )}
      <TouchableOpacity
        disabled={isLoading}
        onPress={onVerifyPress}
        className="bg-[#51AE9] rounded-xl px-4 py-3 mt-6"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-base">Verify</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => signUp.verifications.sendEmailCode()}
        className="py-2"
      >
        <Text className="text-[#51AE9] font-semibold">I need new code</Text>
      </TouchableOpacity>
    </View>;
  }
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../assets/images/stayk.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Create account
        </Text>
        <Text className="text-gray-600 mb-8">Your home, your choice</Text>
        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="flex border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <TextInput
          className="flex border border-gray-300 rounded-xl px-4 py-3"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500 text-sm mt-2">
            {errors.fields.emailAddress.message}
          </Text>
        )}
        <TextInput
          className="flex border border-gray-300 rounded-xl px-4 py-3"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.fields.password && (
          <Text className="text-red-500 text-sm mt-2">
            {errors.fields.password.message}
          </Text>
        )}
        <TouchableOpacity
          disabled={isLoading}
          onPress={onSignUpPress}
          className="bg-[#51AE9] rounded-xl px-4 py-3 mt-6"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">
              Create Account
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Already have an account? </Text>{" "}
          <Link href="/sign-in">
            <Text className="text-[#51AE9] font-semibold">Sign In</Text>
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
