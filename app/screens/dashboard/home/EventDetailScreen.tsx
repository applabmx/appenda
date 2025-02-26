import { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Share,
  TextStyle,
  TouchableNativeFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Icon, iconRegistry, Screen, SizedBox, Text } from "@/components"
import Carousel from "react-native-reanimated-carousel"
import { EvetnDetailResponseModel } from "@/models/EventDetailResponseModel"
import { api } from "@/services/api"
import { colors } from "@/theme/colors"
import AnimatedDotsCarousel from "react-native-animated-dots-carousel"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { typography } from "@/theme"
import { translate } from "@/i18n"
import { da } from "date-fns/locale"
import RenderHTML from "react-native-render-html"
import Config from "@/config"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface EventDetailScreenProps extends AppStackScreenProps<"EventDetail"> {}

export const EventDetailScreen: FC<EventDetailScreenProps> = observer(
  function EventDetailScreen(_pros) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [isLoading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<EvetnDetailResponseModel | null>(null)

    const { navigation, route } = _pros
    const insets = useSafeAreaInsets()
    const [pageindex, setPageIndx] = useState<number>(0)
    const { width } = useWindowDimensions()

    const getEventDetail = async () => {
      setLoading(true)
      const id = route.params!["id"] as string
      console.log(id)
      const data = await api.getEventDetail(id)
      setLoading(false)
      if (data.kind == "ok") {
        setData(data.data)
      }
    }

    const isHtmlString = (str: string) => {
      const htmlRegex = /<[^>]*>/g
      return htmlRegex.test(str)
    }

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

    const onShare = async () => {
      try {
        const result = await Share.share({
          title:  data!.name,
          message: translate("homeScreen:checkOutThisLink")+" "+Config.SHARE_BASE_URL+data!.slug+"/"+data!.id,
          url:Config.SHARE_BASE_URL+data!.slug+"/"+data!.id
        },{
          //Android
          dialogTitle: translate("homeScreen:shareVia"),
          //iOS -  a subject to share via email
          subject: translate("homeScreen:checkOutThisLink")+" "+Config.SHARE_BASE_URL+data!.slug+"/"+data!.id,
        });
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // User shared via a specific app (e.g., email, SMS)
            console.log('Shared via', result.activityType);
          } else {
            // User simply shared
            console.log('Shared successfully');
          }
        } else if (result.action === Share.dismissedAction) {
          // User dismissed the share dialog
          console.log('Share dismissed');
        }
      } catch (error:any) {
        console.log('Error', error.message);
      }
    };

    useEffect(() => {
      getEventDetail()
    }, [])

    return (
      <View style={$root}>
        <Screen backgroundColor={colors.pageBackgroundColor} preset="scroll">
          {data != null && (
            <View>
              <View style={{ height: 300 }}>
                <Carousel
                  loop
                  width={width}
                  height={300}
                  autoPlay={false}
                  data={data.images}
                  onSnapToItem={(index) => setPageIndx(index)}
                  scrollAnimationDuration={1000}
                  renderItem={({ index }) => (
                    <Image
                      style={{ width: width, height: 300 }}
                      source={{ uri: data.images[index].url }}
                    />
                  )}
                />
                <View style={[$buttons, { top: insets.top }]}>
                  <Icon
                    icon="backButtonIcon"
                    size={34}
                    color={colors.whiteColor}
                    onPress={() => navigation.goBack()}
                  />
                  <Image source={iconRegistry.heartEmpty} style={$icon} />
                </View>
                <View
                  style={$top}
                >
                  <AnimatedDotsCarousel
                    length={data.images.length}
                    currentIndex={pageindex}
                    maxIndicators={data.images.length}
                    interpolateOpacityAndColor={false}
                    activeIndicatorConfig={$activeIndicator}
                    inactiveIndicatorConfig={$inActiveIndicator}
                    decreasingDots={[
                      {
                        config: { color: "#EA2B4C", margin: 3, opacity: 1, size: 8 },
                        quantity: 1,
                      },
                      {
                        config: { color: "#EA2B4C", margin: 3, opacity: 1, size: 8 },
                        quantity: 1,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={$body}>
                <View style={$title}>
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={data.consumption_occasions}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View style={$consumptionOcassioin}>
                          <Text preset="default" style={$consumptionText} text={item.name} />
                        </View>
                      )}
                    />
                  </View>
                  <SizedBox width={10} />
                  <TouchableNativeFeedback onPress={()=>onShare()}>
                    <Image source={iconRegistry.shareButtonIcon} style={$icon} />
                  </TouchableNativeFeedback>
                  <SizedBox width={10} />
                  <TouchableNativeFeedback>
                    <Image source={iconRegistry.notificationButtonIcon} style={$icon} />
                  </TouchableNativeFeedback>
                </View>
                <Text style={$titleText} text={data.name} />
                <SizedBox height={10} />
                <View style={$duration}>
                  <Icon icon="time" size={18} color="#828282" />
                  <SizedBox width={5} />
                  <Text style={$descriptionText} text={convertMinutes(data.duration)} />
                  <Text
                    style={$price}
                    text={
                      data.is_free == true
                        ? translate("eventDetailScreen:free")
                        : "$ " + data.price + ""
                    }
                  />
                </View>
                <SizedBox height={15} />
                <Text style={$generalInformation} tx="eventDetailScreen:generalInformation" />
                <SizedBox height={10} />
                {isHtmlString(data.description) ? (
                  <RenderHTML
                    contentWidth={width}
                    source={{ html: data.description }}
                    tagsStyles={{
                      p: {
                        fontSize: 16,
                        fontFamily: typography.fonts.inter.regular,
                        color: "#555555",
                      }, // Set font size for <p> tags
                      h1: {
                        fontSize: 17,
                        fontWeight: "bold",
                        fontFamily: typography.fonts.inter.regular,
                        color: "#555555",
                      }, // Set font size for <h1> tags
                    }}
                  />
                ) : (
                  <Text style={$description} text={data.description} />
                )}
                <SizedBox height={10} />
                <View style={$divider} />
                <SizedBox height={10} />
                <Text style={$generalInformation} tx="eventDetailScreen:location" />
                <SizedBox height={5} />
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <Icon icon="location" size={25} color="#828282" />
                  <SizedBox width={10} />
                  <View style={{ flex: 1 }}>
                    <Text style={$placeName} text={data.place.name} />
                    <SizedBox height={5} />
                    <Text style={$placeDescription} text={data.place.description} />
                    <SizedBox height={100} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </Screen>
        {isLoading && (
          <ActivityIndicator
            style={$activityIndicator}
            size={"large"}
            color={colors.loadingIndicatorColor}
          />
        )}
        <View style={$bottom}>
          <Button preset="red" tx="eventDetailScreen:seeAvailableDates" />
        </View>
      </View>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
const $icon: ImageStyle = { width: 35, height: 35 }
const $activityIndicator: ViewStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
}
const $buttons: ViewStyle = {
  position: "absolute",
  width: Dimensions.get("window").width,
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 15,
}

const $activeIndicator = {
  color: "#EA2B4C",
  margin: 3,
  opacity: 1,
  size: 8,
}
const $inActiveIndicator = {
  color: "#F7AAB7",
  margin: 3,
  opacity: 0.5,
  size: 8,
}

const $body: ViewStyle = {
  marginHorizontal: 10,
  flexDirection: "column",
}
const $title: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
}

const $titleText: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 18,
  color: colors.blackColor,
}

const $price: TextStyle = {
  fontFamily: typography.fonts.inter.bold,
  fontSize: 18,
  color: colors.blackColor,
}
const $consumptionOcassioin: ViewStyle = {
  backgroundColor: "#FFD3B3",
  borderRadius: 11,
  paddingHorizontal: 10,
  height: 25,
  justifyContent: "center",
  alignSelf: "center",
  marginRight: 10,
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

const $generalInformation: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 18,
  color: "#171D1B",
}
const $description: TextStyle = {
  fontFamily: typography.fonts.inter.regular,
  fontSize: 16,
  color: "#555555",
}
const $divider: ViewStyle = { borderWidth: 1, borderColor: "#E0E0E0", width: "100%" }
const $consumptionText: TextStyle = {
  fontFamily: typography.fonts.inter.medium,
  fontSize: 12,
  color: "#FF6A00",
}

const $placeName: TextStyle = { fontFamily: typography.fonts.inter.semiBold, fontSize: 16 }
const $placeDescription: TextStyle = { fontFamily: typography.fonts.inter.regular, fontSize: 14 }

const $top:ViewStyle={
  position: "absolute",
  bottom: 20,
  flex: 1,
  backgroundColor: "#FAFAFA",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
  alignSelf: "center",
}

const $bottom:ViewStyle={ position: "absolute", bottom: 25, width: "100%", paddingHorizontal: 15 }