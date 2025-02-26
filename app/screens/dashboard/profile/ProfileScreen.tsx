import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}


export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  

  const{authenticationStore:{logout}}=useStores()
  // Pull in navigation via hook
  // const navigation = useNavigation()

  useEffect(()=>{
    // logout()
  },[])
  return (
    <Screen style={$root} preset="scroll">
      <Text text="profile" />
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
