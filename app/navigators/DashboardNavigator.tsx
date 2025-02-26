import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FavoritesScreen, HomeScreen, MapsScreen, NotificationsScreen, ProfileScreen, WelcomeScreen } from "@/screens"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { Icon } from "@/components"
import { colors, typography } from "@/theme"
import { TextStyle, ViewStyle } from "react-native"
import { translate } from "@/i18n"

export type DashboardNavigatorParamList = {
  Home: undefined,
  Map: undefined,
  Notification: undefined,
  Favorites: undefined,
  Profile: undefined,

}

const Tab = createBottomTabNavigator<DashboardNavigatorParamList>()
export const DashboardNavigator = () => {
  const iconSize:number= 24;
  return (
    <Tab.Navigator
    screenOptions={({route})=>({
      tabBarIcon:({focused,color,size})=>{
        if (route.name === "Home") {
          return <Icon icon="home" size={iconSize} color={color} />
        } else if (route.name === "Map") {
          return <Icon icon="location" size={iconSize+2} color={color} />
        } else if (route.name === "Notification") {
          return <Icon icon="notification" size={iconSize} color={color} />
        } else if (route.name === "Favorites") {
          return <Icon icon="favorite" size={iconSize} color={color} />
        } else {
          return <Icon icon="profile" size={iconSize} color={color} />
        }
      },
      tabBarActiveTintColor: colors.bottomMenuSelectdColor,
        tabBarInactiveTintColor: colors.bottomMenuUnselectedColor,
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: $tabBarStyle,
        tabBarLabelStyle:$tabBarLabelStyle
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel:translate("dashBoardScreen:home")}} />
      <Tab.Screen name="Map" component={MapsScreen} options={{tabBarLabel:translate("dashBoardScreen:map")}} />
      <Tab.Screen name="Notification" component={NotificationsScreen} options={{tabBarLabel:translate("dashBoardScreen:notification")}}/>
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{tabBarLabel:translate("dashBoardScreen:favorite")}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel:translate("dashBoardScreen:profile")}}/>
    </Tab.Navigator>
  )
}

const $tabBarStyle:ViewStyle={
  height: 92,
}
const $tabBarLabelStyle:TextStyle={
  fontSize:12,
  fontFamily: typography.fonts.inter.semiBold
}