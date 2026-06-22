import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AuthBackground from "../../components/AuthBackground";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
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
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const isLoading = fetchStatus === "fetching";

  // ==========================================
  // MÀN HÌNH VERIFY CODE (ĐÃ THÊM TOUCHABLE DỂ ĐÓNG BÀN PHÍM)
  // ==========================================
  if (signIn.status === "needs_client_trust") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Text className="text-gray-500 text-center mb-8 px-4 text-base">
            Vui lòng nhập mã xác thực vừa được gửi đến email của bạn.
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
              <Text className="text-white font-bold text-lg">Xác nhận</Text>
            )}
          </TouchableOpacity>

          <View className="items-center space-y-4">
            <TouchableOpacity onPress={() => signIn.mfa.sendEmailCode()}>
              <Text className="text-cusGreen font-semibold text-base">
                Gửi lại mã
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => signIn.reset()}>
              <Text className="text-gray-400 text-sm mt-4">
                Quay lại từ đầu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // ==========================================
  // MÀN HÌNH SIGN IN (DÙNG SCROLLVIEW NÊN ĐÃ HỖ TRỢ ĐÓNG BÀN PHÍM)
  // ==========================================
  return (
    <View className="flex-1 bg-white">
      <AuthBackground />
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

          {/* Text Section */}
          <View className="mb-8">
            <Text className="text-4xl font-extrabold text-gray-900 mb-2">
              Welcome! 👋
            </Text>
            <Text className="text-base text-gray-500">
              Đăng nhập để tiếp tục trải nghiệm của bạn.
            </Text>
          </View>

          {/* Input Section */}
          <View className="mb-4">
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
              placeholder="Địa chỉ email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.fields.identifier && (
              <Text className="text-red-500 mt-2 ml-2 text-sm">
                {errors.fields.identifier.message}
              </Text>
            )}
          </View>

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

          {/* Button Section */}
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            className="w-full bg-cusGreen py-4 rounded-2xl items-center shadow-sm mb-8"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg tracking-wide">
                Đăng Nhập
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 text-base">Chưa có tài khoản? </Text>
            <Link href="/sign-up">
              <Text className="text-cusGreen font-bold text-base">
                Đăng ký ngay
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
