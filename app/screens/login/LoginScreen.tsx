import { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  TextStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@/navigators"
import {
  Button,
  Icon,
  iconRegistry,
  Screen,
  SizedBox,
  Text,
  TextField,
  TextFieldAccessoryProps,
  TextFieldProps,
} from "@/components"
import { colors, typography } from "@/theme"
import { TextInput } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { Form, Formik } from "formik"
import { translate } from "@/i18n"
import { values } from "mobx"
import * as Yup from "yup"
import { LoginRequestModel } from "@/models/LoginRequestModel"
import { api } from "@/services/api"
import Snackbar from "react-native-snackbar"
import { CC } from "@/models/LoginResponseMode"
import { save } from "@/utils/storage"
import Config from "@/config"
import { useStores } from "@/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_pros) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const { navigation } = _pros
  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState<boolean>(true)
  const formikRef = useRef<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const {authenticationStore:{}}=useStores()

  const refPasssword = useRef<any>()
  const{authenticationStore:{saveUserInfo}}=useStores();

  const doLogin = async (data: LoginRequestModel) => {
    setLoading(true)
    var response = await api.login(data)
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
        const parsedCC: CC=JSON.parse(response.data.cc);
        saveUserInfo(parsedCC)
      }
    } else {
    }
  }

  const initialValues: FormValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(translate("loginScreen:invalidEmailAddress"))
      .required(translate("loginScreen:emailIsRequired")),
    password: Yup.string().required(translate("loginScreen:passwordIsRequired")),
  })

  interface FormValues {
    email: string
    password: string
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "passwordView" : "passwordHide"}
            color={colors.palette.neutral800}
            size={24}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <View style={$root}>
      <Screen
        style={$screen}
        preset="auto"
        backgroundColor={colors.pageBackgroundColor}
        safeAreaEdges={["top"]}
      >
        <SizedBox height={20} />
        <Icon icon="back" size={30} onPress={() => navigation.goBack()} /> 
        <SizedBox height={30} />
        <Image source={iconRegistry.appLogo} style={$appLogo} />
        <SizedBox height={30} />
        <Text tx="loginScreen:welcome" style={$welcome} />
        <SizedBox height={20} />
        <Text tx="loginScreen:signInAndExporeNewEvents" style={$signIn} />
        <SizedBox height={20} />
        <Formik
          initialValues={initialValues}
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            doLogin(values)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                placeholderTx="loginScreen:email"
                placeholderTextColor="#9EA2AE"
                helper={errors.email}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => refPasssword.current?.focus()}
                HelperTextProps={$helper}
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                ref={refPasssword}
                fontSize={14}
                secureTextEntry={isAuthPasswordHidden}
                status={errors.password && touched.password ? "error" : undefined}
                LeftAccessory={() => (
                  <Icon icon="passwordIcon" size={24} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.password && touched.password
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                placeholderTx="loginScreen:password"
                placeholderTextColor="#9EA2AE"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                RightAccessory={PasswordRightAccessory}
                helper={errors.password && touched.password ? errors.password : undefined}
                HelperTextProps={$helper}
                returnKeyType="done"
              />
            </View>
          )}
        </Formik>
        <SizedBox height={15} />
        <View style={{ alignSelf: "flex-end" }}>
          <Text>
            <Text tx="loginScreen:forgotYourPassword" style={$forgotPassword} />
            <TouchableNativeFeedback onPress={() => navigation.navigate("ForgotPassword")}>
              <Text tx="loginScreen:getItHere" style={$getItHere} />
            </TouchableNativeFeedback>
          </Text>
        </View>
      </Screen>

      <View style={$bottom}>
        <Button
          preset="red"
          tx="loginScreen:login"
          onPress={() => formikRef.current!.submitForm()}
        />
        <SizedBox height={15} />
        <View style={{ alignSelf: "center" }}>
          <Text>
            <Text tx="loginScreen:dontHaveAnAccount" style={$forgotPassword} />
            <TouchableNativeFeedback onPress={() => navigation.navigate("Register")}>
              <Text tx="loginScreen:register" style={$getItHere} />
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
const $appLogo: ImageStyle = { width: 130, height: 55,  resizeMode: "contain" }
const $welcome: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 28,
  color: "#171D1B",
  lineHeight: 30,
  textAlign: "left",
}
const $signIn: TextStyle = {
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

const $forgotPassword: TextStyle = {
  color: "#696868",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $getItHere: TextStyle = {
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
