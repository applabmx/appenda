import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ActivityIndicator, Image, ImageStyle, Linking, TextStyle, TouchableNativeFeedback, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, iconRegistry, Screen, SizedBox, Text } from "@/components"
import { colors, typography } from "@/theme"
import { api } from "@/services/api"
import Snackbar from "react-native-snackbar"
import { translate } from "@/i18n"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface ResetLinkSentConfirmationScreenProps extends AppStackScreenProps<"ResetLinkSentConfirmation"> {}


export const ResetLinkSentConfirmationScreen: FC<ResetLinkSentConfirmationScreenProps> = observer(function ResetLinkSentConfirmationScreen(_pros) {
  
  const { navigation, route } = _pros
  const email:string= route.params.email;
     
      const [isLoading, setLoading] = useState<boolean>(false)

      const requestPasswordResetLink = async () => {
        setLoading(true)
        var response = await api.sendPasswordResetLink({email:email})
        setLoading(false)
        if (response.kind == "ok") {
          if (response.data.error != null) {
            //Show Login error
            Snackbar.show({
              text: response.data.error,
              duration: Snackbar.LENGTH_LONG,
              fontFamily: typography.fonts.inter.medium,
            })
          } else {
            Snackbar.show({
              text: translate("ResetLinkSentConfirmationScreen:checkYourMailToUpdateYourPassword"),
              duration: Snackbar.LENGTH_LONG,
              fontFamily: typography.fonts.inter.medium,
            })
          }
        } else {
        }
      }
  return (
   <View style={$root}>
           <Screen
             style={$screen}
             preset="auto"
             backgroundColor={colors.pageBackgroundColor}
             safeAreaEdges={["top"]}
           >
             <SizedBox height={20} />
             <Image source={iconRegistry.appLogo} style={$appLogo} />
             <SizedBox height={30} />
             <Text tx="ResetLinkSentConfirmationScreen:checkYourMailToUpdateYourPassword" style={$title} />
             <SizedBox height={20} />
             <View  style={{flexDirection:"row"}}>
               <Text>
                 <Text tx="ResetLinkSentConfirmationScreen:weHaveSentAnEmailTo" style={$subtitle} />
                 <Text text={email+" "} style={[$subtitle,{color: colors.redButtonColor}]} />
                <Text tx="ResetLinkSentConfirmationScreen:withALinkToRecoverPassword" style={$subtitle} />
  
               </Text>
             </View>
            <SizedBox height={20} />
             <Text tx="ResetLinkSentConfirmationScreen:linkExpiresIn15Minutes" style={$text} />
             <SizedBox height={20} />
             
             
           </Screen>
           <View style={$bottom}>
             <View style={{flexDirection:"row", justifyContent:"space-around"}}>
             <Button
               preset="redouline"
               tx="ResetLinkSentConfirmationScreen:backToLogin"
               style={{flex:1,}}
               textStyle={{fontSize:14}}
               onPress={() => navigation.navigate("Login")}
             />
             <SizedBox width={10}/>
             <Button
               preset="red"
               style={{flex:1,}}
               textStyle={{fontSize:14}}
               tx="ResetLinkSentConfirmationScreen:openMail"
               onPress={() =>Linking.openURL('mailto:')}
             />
             </View>
             
             <SizedBox height={15} />
             <View style={{ alignSelf: "center",paddingHorizontal:20 }}>
               <Text>
                 <Text tx="ResetLinkSentConfirmationScreen:dontGetALinkCode" style={$getLink} />
                 <TouchableNativeFeedback onPress={() => requestPasswordResetLink()}>
                   <Text tx="ResetLinkSentConfirmationScreen:clickHereToResendIt" style={$resend} />
                 </TouchableNativeFeedback>
               </Text>
             </View>
             <SizedBox height={10} />
           </View>
           {isLoading && (
             <ActivityIndicator
               style={$activityIndicator}
               size={"large"}
               color={colors.loadingIndicatorColor}
             />
           )}
         </View>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
const $screen: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
}
const $activityIndicator: ViewStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
}
const $appLogo: ImageStyle = { width: 130, height: 55, resizeMode: "contain" }
const $title: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 28,
  color: "#171D1B",
  lineHeight: 30,
  textAlign: "left",
}
const $subtitle: TextStyle = {
  fontFamily: typography.fonts.inter.medium,
  fontSize: 18,
  color: "#171D1B",
}



const $bottom: ViewStyle = {
  position: "absolute",
  bottom: 25,
  width: "100%",
  paddingHorizontal: 15,
}

const $getLink: TextStyle = {
  color: "#696868",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $resend: TextStyle = {
  color: "#EA2B4C",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $helper: any = { style: { color: "#EE443F" } }
const $errroBorder: ViewStyle = { backgroundColor: "#FDECEC", borderColor: "#EE443F" }

const $leftAccessory: ImageStyle = {
  alignSelf: "center",
  flex: 1,
  marginLeft: 10,
}

const $text: TextStyle = {
  fontFamily: typography.fonts.inter.regular,
  fontSize: 16,
  color: "#555555",
  lineHeight: 20,
}

