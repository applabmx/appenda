import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface FavoritesScreenProps extends AppStackScreenProps<"Favorites"> {}


export const FavoritesScreen: FC<FavoritesScreenProps> = observer(function FavoritesScreen() {
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="favorites" />
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
