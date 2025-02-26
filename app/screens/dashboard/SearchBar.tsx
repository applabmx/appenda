import {
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, type ThemedStyle } from "@/theme"
import { Text } from "@/components/Text"
import { Icon, iconRegistry, SizedBox, TextField } from "@/components"
import { useState } from "react"
import { TextInput } from "react-native-gesture-handler"
import { Image } from "react-native"

export interface SearchBarProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const SearchBar = observer(function SearchBar(props: SearchBarProps) {
  const { style } = props
  const $styles = [$container, style]
  const { themed } = useAppTheme()
  const [searchInput, setSearchInput] = useState<string>("")

  return (
    <View style={$styles}>
      <View style={$textInput}>
        <TextField
          height={37}
          fontSize={16}
          value={searchInput}
          onChangeText={(value) => setSearchInput(value)}
          inputWrapperStyle={$inputWrapperStyle}
          returnKeyType="search"
          placeholderTx="dashBoardScreen:searchEvent"
          LeftAccessory={() => <Icon icon="search" size={20} containerStyle={$leftAccessory} />}
        />
      </View>
      <SizedBox width={10} />
      <TouchableNativeFeedback onPress={() => {}}>
        <Image source={iconRegistry.calendar} style={$icon} />
      </TouchableNativeFeedback>
      <SizedBox width={10} />
      <TouchableNativeFeedback onPress={() => {}}>
        <Image source={iconRegistry.filterIcon} style={$icon} />
      </TouchableNativeFeedback>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "flex-start",
  flexDirection: "row",
}

const $textInput: ViewStyle = {
  flex: 1,
}

const $icon: ImageStyle = {
  width: 37,
  height: 37,
  resizeMode: "contain",
}
const $inputWrapperStyle: ViewStyle = {
  borderRadius: 30,
  borderWidth: 1,
  backgroundColor: colors.whiteColor,
  borderColor: colors.textFieldBorderColor,
}
const $leftAccessory: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  marginLeft: 10,
}

const $text: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.fonts.inter.regular,
  fontSize: 14,
  color: colors.palette.primary500,
})
