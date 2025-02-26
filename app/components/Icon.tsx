import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  const { theme } = useAppTheme()

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    { tintColor: color ?? theme.colors.text },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  settings: require("../../assets/icons/settings.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  home:require("../../assets/icons/home_icon.png"),
  location:require("../../assets/icons/location_icon.png"),
  notification:require("../../assets/icons/notification_icon.png"),
  favorite:require("../../assets/icons/favorite_icon.png"),
  profile:require("../../assets/icons/profile_icon.png"),
  search: require("../../assets/icons/search_icon.png"),
  calendar: require("../../assets/icons/calendar_icon.png"),
  filterIcon: require("../../assets/icons/filter_icon.png"),
  heartEmpty: require("../../assets/icons/heart_empty_icon.png"),
  shareButtonIcon:require("../../assets/icons/share_icon.png"),
  notificationButtonIcon: require("../../assets/icons/notification_button_icon.png"),
  time: require("../../assets/icons/time_icon.png"),
  backButtonIcon: require("../../assets/icons/back_button_icon.png"),
  appLogo: require("../../assets/icons/app_logo.png"),
  passwordView: require("../../assets/icons/password_view_icon.png"),
  passwordHide: require("../../assets/icons/password_hide_icon.png"),
  userNameIocn: require("../../assets/icons/user_name_icon.png"),
  passwordIcon: require("../../assets/icons/password_icon.png"),
  emailIcon: require("../../assets/icons/email_icon.png"),
  phoneNumberIcon: require("../../assets/icons/phone_number_icon.png"),
  
}


const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
