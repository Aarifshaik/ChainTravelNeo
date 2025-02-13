import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "ChainTravel",
    slug: "ChainTravel",
    version: "2.0.0",
    scheme: "ChainTravel",
    "owner": "aarif1419",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/bus.png",
      
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
      image: "./assets/splash.png",
      resizeMode: "contain",
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
        "projectId": "0e2708c6-9c6a-4ffe-bc70-b10f856b585f",
      },
    },
  };
};