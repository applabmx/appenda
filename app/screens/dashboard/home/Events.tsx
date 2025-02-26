import {
  FlatList,
  Image,
  ImageStyle,
  Share,
  StyleProp,
  TextStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, typography, type ThemedStyle } from "@/theme"
import { Text } from "@/components/Text"
import { Events } from "@/models/EventListResponseModel"
import { Card, Icon, iconRegistry, SizedBox } from "@/components"
import { FlashList } from "@shopify/flash-list"
import { useEffect, useRef } from "react"
import { translate } from "@/i18n"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
import { AppStackScreenProps } from "@/navigators/AppNavigator"
import Config from "@/config"

export interface EventProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  data: Events[]
  navigation: any
}

/**
 * Describe your component here
 */

export const EventsList = observer(function Event(props: EventProps) {
  const { style, data, navigation } = props
  const $styles = [style]
  const { themed } = useAppTheme()
  const listRef = useRef<FlatList>(null)

  const convertMinutes = (totalMinutes: number) => {
    if (totalMinutes < 60) {
      return `${totalMinutes} ${translate("homeScreen:min")}${totalMinutes === 1 ? "" : "s"}`
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return minutes > 0
      ? `${hours} ${translate("homeScreen:hour")}${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`
      : `${hours} ${translate("homeScreen:hour")}${hours === 1 ? "" : "s"}`
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToIndex({ animated: false, index: 0 })
    }
  }, [data])

  const onShare = async (data: Events) => {
    try {
      const result = await Share.share(
        {
          title: data.name,
          message:
            translate("homeScreen:checkOutThisLink") +
            " " +
            Config.SHARE_BASE_URL +
            data.slug +
            "/" +
            data.id,
          url: Config.SHARE_BASE_URL + data.slug + "/" + data.id,
        },
        {
          //Android
          dialogTitle: translate("homeScreen:shareVia"),
          //iOS -  a subject to share via email
          subject:
            translate("homeScreen:checkOutThisLink") +
            " " +
            Config.SHARE_BASE_URL +
            data.slug +
            "/" +
            data.id,
        },
      )

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // User shared via a specific app (e.g., email, SMS)
          console.log("Shared via", result.activityType)
        } else {
          // User simply shared
          console.log("Shared successfully")
        }
      } else if (result.action === Share.dismissedAction) {
        // User dismissed the share dialog
        console.log("Share dismissed")
      }
    } catch (error: any) {
      console.log("Error", error.message)
    }
  }
  return (
    <FlatList
      data={data}
      ref={listRef}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("EventDetail", { id: item.id })}>
          <Card
            style={{ padding: 0, marginBottom: 10, borderColor: colors.whiteColor }}
            HeadingComponent={
              <View>
                <Image
                  style={{ borderRadius: 16 }}
                  source={{ uri: item.images[0].url }}
                  height={170}
                  resizeMode="cover"
                />
                <View style={$cardHeadingBottom}>
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={item.consumption_occasions}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View style={$consumptionOcassioin}>
                          <Text
                            preset="default"
                            style={{
                              fontFamily: typography.fonts.inter.medium,
                              fontSize: 12,
                              color: "#131927",
                            }}
                            text={item.name}
                          />
                        </View>
                      )}
                    />
                  </View>
                  <SizedBox width={10} />
                  <TouchableNativeFeedback onPress={() => navigation.navigate("Login")}>
                    <Image source={iconRegistry.heartEmpty} style={$icon} />
                  </TouchableNativeFeedback>
                </View>
              </View>
            }
            ContentComponent={
              <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={$title}>
                  <Text style={$titleText} text={item.name} />
                  <SizedBox width={10} />
                  <TouchableNativeFeedback onPress={() => onShare(item)}>
                    <Image source={iconRegistry.shareButtonIcon} style={$icon} />
                  </TouchableNativeFeedback>
                  <SizedBox width={10} />
                  <TouchableNativeFeedback>
                    <Image source={iconRegistry.notificationButtonIcon} style={$icon} />
                  </TouchableNativeFeedback>
                </View>
                <Text style={$descriptionText} text={item.place.name} />
                <View style={$duration}>
                  <Icon icon="time" size={18} color="#828282" />
                  <SizedBox width={5} />
                  <Text style={$descriptionText} text={convertMinutes(item.duration)} />
                </View>
                <SizedBox height={5} />
                <View style={$duration}>
                  <Text
                    style={{ fontFamily: typography.fonts.inter.semiBold, fontSize: 16 }}
                    text={"$ " + item.price_range.min + ""}
                  />
                  <Text tx="homeScreen:mxn" txOptions={{ ifan: "-" }} />
                  <Text
                    style={{ fontFamily: typography.fonts.inter.semiBold, fontSize: 16 }}
                    text={"$ " + item.price_range.max + ""}
                  />
                  <Text tx="homeScreen:mxn" txOptions={{ ifan: "" }} />
                </View>
              </View>
            }
          />
        </TouchableOpacity>
      )}
    />
  )
})

const $cardHeadingBottom: ViewStyle = {
  position: "absolute",
  flexDirection: "row",
  bottom: 7,
  width: "100%",
  paddingHorizontal: 10,
}

const $icon: ImageStyle = { width: 30, height: 30 }

const $titleText: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 16,
  color: colors.blackColor,
  flex: 1,
}

const $duration: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $descriptionText: TextStyle = {
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
  color: "#828282",
  flex: 1,
}

const $title: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $consumptionOcassioin: ViewStyle = {
  backgroundColor: colors.whiteColor,
  borderRadius: 15,
  height: 25,
  paddingHorizontal: 10,
  alignSelf: "flex-end",
  marginRight: 10,
}
