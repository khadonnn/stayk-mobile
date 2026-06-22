import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // ==========================================
  // MÀN HÌNH XÁC THỰC OTP
  // ==========================================
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center bg-white px-8">
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/stayk.png")}
            className="w-56 h-28"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-extrabold text-gray-900 mb-3 text-center">
          Xác thực tài khoản
        </Text>
        <Text className="text-gray-500 text-center mb-8 px-2 text-base">
          Chúng tôi đã gửi mã xác nhận đến email{"\n"}
          <Text className="font-bold text-gray-800">{email}</Text>
        </Text>

        <View className="mb-6">
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
            placeholder="Nhập mã gồm 6 chữ số"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          {errors.fields.code && (
            <Text className="text-red-500 mt-2 ml-2 text-sm">
              {errors.fields.code.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-cusGreen py-4 rounded-2xl items-center shadow-sm mb-6"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg tracking-wide">
              Xác nhận
            </Text>
          )}
        </TouchableOpacity>

        <View className="items-center space-y-4">
          <TouchableOpacity
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text className="text-cusGreen font-semibold text-base">
              Gửi lại mã
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => signUp.reset()}>
            <Text className="text-gray-400 text-sm mt-4">Quay lại từ đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==========================================
  // MÀN HÌNH ĐĂNG KÝ
  // ==========================================
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-8 py-12">
        {/* Logo Section */}
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/stayk.png")}
            className="w-56 h-28"
            resizeMode="contain"
          />
        </View>

        {/* Header Text */}
        <View className="mb-8">
          <Text className="text-4xl font-extrabold text-gray-900 mb-2">
            Tạo tài khoản
          </Text>
          <Text className="text-base text-gray-500">
            Bắt đầu hành trình tìm kiếm trải nghiệm lưu trú lý tưởng.
          </Text>
        </View>

        {/* Row: Họ và Tên */}
        <View className="flex-row gap-4 mb-4">
          <TextInput
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
            placeholder="Họ"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
          <TextInput
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
            placeholder="Tên"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        {/* Input Email */}
        <View className="mb-4">
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
            placeholder="Địa chỉ Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.fields.emailAddress && (
            <Text className="text-red-500 mt-2 ml-2 text-sm">
              {errors.fields.emailAddress.message}
            </Text>
          )}
        </View>

        {/* Input Password */}
        <View className="mb-8">
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
            placeholder="Mật khẩu"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.fields.password && (
            <Text className="text-red-500 mt-2 ml-2 text-sm">
              {errors.fields.password.message}
            </Text>
          )}
        </View>

        {/* Button Sign Up */}
        <TouchableOpacity
          onPress={onSignUpPress}
          disabled={isLoading}
          className="w-full bg-cusGreen py-4 rounded-2xl items-center shadow-sm mb-8"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg tracking-wide">
              Đăng Ký
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-500 text-base">Đã có tài khoản? </Text>
          <Link href="/sign-in">
            <Text className="text-cusGreen font-bold text-base">
              Đăng nhập ngay
            </Text>
          </Link>
        </View>

        {/* Yêu cầu cho Clerk Bot protection */}
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
