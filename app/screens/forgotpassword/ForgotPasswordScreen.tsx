import { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  TextStyle,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Icon, iconRegistry, Screen, SizedBox, Text, TextField } from "@/components"
import { colors, typography } from "@/theme"
import { isLoading } from "expo-font"
import { Formik } from "formik"
import { api } from "@/services/api"
import * as Yup from "yup"
import { translate } from "@/i18n"
import { ChangePasswordLinkRequstModel } from "@/models/ChangePasswordLinkRequestModel"
import Snackbar from "react-native-snackbar"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = observer(
  function ForgotPasswordScreen(_pros) {
    const { navigation } = _pros
   
    const formikRef = useRef<any>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const refPasssword = useRef<any>()

    const requestPasswordResetLink = async (data:ChangePasswordLinkRequstModel) => {
      setLoading(true)
      var response = await api.sendPasswordResetLink(data)
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
          navigation.navigate("ResetLinkSentConfirmation",{email:data.email})
        }
      } else {
      }
    }

    const initialValues: ChangePasswordLinkRequstModel = {
      email: "",
    }

    const validationSchema = Yup.object({
      email: Yup.string()
        .email(translate("forgotPasswordScreen:invalidEmailAddress"))
        .required(translate("forgotPasswordScreen:emailIsRequired")),
    })


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
          <Text tx="forgotPasswordScreen:forgotPassword" style={$tittle} />
          <SizedBox height={20} />
          <Text tx="forgotPasswordScreen:enterTheEmailWhichYouRegistered" style={$subtitle} />
          <SizedBox height={20} />
          <Text tx="forgotPasswordScreen:weWilSendYouTheLinkToResetYourPassword" style={$text} />
          <SizedBox height={20} />
          <Formik
            initialValues={initialValues}
            innerRef={formikRef}
            validationSchema={validationSchema}
            onSubmit={(values: ChangePasswordLinkRequstModel, { setSubmitting }) => {
              requestPasswordResetLink(values)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <View>
                <TextField
                  height={40}
                  fontSize={14}
                  inputWrapperStyle={[
                    $inputWrapperStyle,
                    errors.email ? $errroBorder : { backgroundColor: colors.transparent },
                  ]}
                  LeftAccessory={() => (
                    <Icon icon="emailIcon" size={24} color="#9EA2AE" style={$leftAccessory} />
                  )}
                  status={errors.email && touched.email ? "error" : undefined}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholderTx="forgotPasswordScreen:emailAddress"
                  placeholderTextColor="#9EA2AE"
                  helper={errors.email}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => refPasssword.current?.focus()}
                  HelperTextProps={$helper}
                />
              </View>
            )}
          </Formik>
          
          
        </Screen>
        <View style={$bottom}>
          <View style={{flexDirection:"row", justifyContent:"space-around"}}>
          <Button
            preset="redouline"
            tx="forgotPasswordScreen:backToLogin"
            style={{flex:1,}}
            textStyle={{fontSize:14}}
            onPress={() => navigation.navigate("Login")}
          />
          <SizedBox width={10}/>
          <Button
            preset="red"
            style={{flex:1,}}
            textStyle={{fontSize:14}}
            tx="forgotPasswordScreen:resetPassword"
            onPress={() => formikRef.current!.submitForm()}
          />
          </View>
          
          <SizedBox height={15} />
          <View style={{ alignSelf: "center" }}>
            <Text>
              <Text tx="loginScreen:dontHaveAnAccount" style={$dontHaveAccount} />
              <TouchableNativeFeedback onPress={() => navigation.navigate("Register")}>
                <Text tx="loginScreen:register" style={$register} />
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
  },
)

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
const $tittle: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 28,
  color: "#171D1B",
  lineHeight: 30,
  textAlign: "left",
}
const $subtitle: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 18,
  color: "#171D1B",
}

const $inputWrapperStyle: ViewStyle = {
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: colors.transparent,
  borderColor: "#9EA2AE",
}

const $bottom: ViewStyle = {
  position: "absolute",
  bottom: 25,
  width: "100%",
  paddingHorizontal: 15,
}

const $dontHaveAccount: TextStyle = {
  color: "#696868",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $register: TextStyle = {
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
