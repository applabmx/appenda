import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Text } from "@/components/Text"
import { he } from "date-fns/locale"

export interface SizedBoxProps {
  /**
   * An optional style override useful for padding & margin.
   */
  width?: number
  height?: number
}

/**
 * Describe your component here
 */

export const SizedBox = observer(function SizedBox(props: SizedBoxProps) {
  const { width, height } = props

  const { themed } = useAppTheme()

  return <View style={{ ...(width && { width }), ...(height && { height }) }}></View>
})
