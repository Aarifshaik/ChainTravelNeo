import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "ChainTravel",
    slug: "ChainTravel",
    version: "2.0.0",
    scheme: "CryptoNeo",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-dev-launcher",
        {
          launchMode: "most-recent",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      // image: "./assets/splash.png",
      // resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "ACCESS_WIFI_STATE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyAnABeGypvb0XluDNOX3qnQTA0bMSPwI94"
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: process.env.App_Id || "com.aarif1419.ChainTravelNeo",      
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "9a0b6ae7-eb62-4715-9551-c24f67a70141",
      },
    },
  };
};