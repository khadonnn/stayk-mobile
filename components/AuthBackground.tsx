import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function AuthBackground() {
  return (
    // StyleSheet.absoluteFillObject giúp View này phủ kín toàn bộ màn hình và nằm chìm xuống dưới
    <View
      style={[StyleSheet.absoluteFillObject, { backgroundColor: "#ffffff" }]}
      pointerEvents="none"
    >
      {/* Họa tiết sóng (Wave) ở phía trên */}
      <Svg
        width={width}
        height={width * 0.7}
        viewBox="0 0 1440 320"
        style={{ position: "absolute", top: 0 }}
      >
        <Path
          fill="#10B981" // Thay mã màu này bằng mã HEX của cusGreen
          fillOpacity="0.05" // Làm mờ đi 5% để tạo cảm giác tinh tế, không làm rối chữ
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </Svg>

      {/* Họa tiết hình tròn góc dưới bên phải */}
      <Svg
        width={200}
        height={200}
        style={{ position: "absolute", bottom: -50, right: -50 }}
      >
        <Circle cx="100" cy="100" r="100" fill="#10B981" fillOpacity="0.03" />
      </Svg>
    </View>
  );
}
