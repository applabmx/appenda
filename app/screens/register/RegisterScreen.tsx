import { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Linking,
  Modal,
  TextStyle,
  Touchable,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@/navigators"
import {
  Button,
  Checkbox,
  Icon,
  iconRegistry,
  Screen,
  SizedBox,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "@/components"
import { LoginRequestModel } from "@/models/LoginRequestModel"
import Snackbar from "react-native-snackbar"
import { colors, typography } from "@/theme"
import { api } from "@/services/api"
import * as Yup from "yup"
import { translate } from "@/i18n"
import { Formik } from "formik"
import { RegisterRequestModel } from "@/models/RegisterRequestModel"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_pros) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const refLastName = useRef<any>()
  const refPhoneNumber = useRef<any>()
  const refEmail = useRef<any>()
  const refPassword = useRef<any>()
  const refConfirmPassword = useRef<any>()

  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState<boolean>(true)
  const formikRef = useRef<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const { navigation } = _pros
  const [isTerm, setIsTerm] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState(false)

  const doLogin = async (data: RegisterRequestModel) => {
    if (!isTerm) {
      Snackbar.show({
        text: translate("registerScreen:pleaseAcceptTheTermsAndConditionAndPrivacyPolicy"),
        duration: Snackbar.LENGTH_LONG,
        fontFamily: typography.fonts.inter.medium,
      })
    } else {
      data.acept_terms = true
      setLoading(true)
      var response = await api.register(data)
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
          setModalVisible(!modalVisible)
        }
      } else {
      }
    }
  }

  const initialValues: RegisterRequestModel = {
    name: "",
    last_name: "",
    cell_phone: "",
    email: "",
    password: "",
    password_confirm: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(translate("registerScreen:lastNameIsRequired")),
    last_name: Yup.string().required(translate("registerScreen:lastNameIsRequired")),
    cell_phone: Yup.string()
      .min(10, translate("registerScreen:phoneNumberIsNotValid"))
      .max(10, translate("registerScreen:phoneNumberIsNotValid"))
      .required(translate("registerScreen:phoneNumberIsRequired")),
    email: Yup.string()
      .email(translate("registerScreen:invalidEmailAddress"))
      .required(translate("registerScreen:emailIsRequired")),
    password: Yup.string()
      .min(6, translate("registerScreen:password6Valiation"))
      .matches(/[A-Z]/, translate("registerScreen:passwordOneUpperCaseValidation"))
      .matches(/[0-9]/, translate("registerScreen:passwordContain1Number"))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        translate("registerScreen:passwordContainSpecialCharacter"),
      )
      .required(translate("registerScreen:passwordIsRequired")),
    password_confirm: Yup.string()
      .oneOf(
        [Yup.ref("password"), undefined],
        translate("registerScreen:passwordAndConfirmPasswordDidNotMatch"),
      )
      .required(translate("registerScreen:confirmPasswordIsRequired")),
  })

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isPasswordHidden ? "passwordView" : "passwordHide"}
            color={colors.palette.neutral800}
            size={24}
            containerStyle={props.style}
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          />
        )
      },
    [isPasswordHidden],
  )

  const ConfirmPasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isConfirmPasswordHidden ? "passwordView" : "passwordHide"}
            color={colors.palette.neutral800}
            size={24}
            containerStyle={props.style}
            onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
          />
        )
      },
    [isConfirmPasswordHidden],
  )

  return (
    <View style={$root}>
      <Screen
        style={$screen}
        preset="scroll"
        backgroundColor={colors.pageBackgroundColor}
        safeAreaEdges={["top"]}
      >
        <SizedBox height={40} />
        <Image source={iconRegistry.appLogo} style={$appLogo} />
        <SizedBox height={20} />
        <Text tx="registerScreen:createMyAccountAndExporeEvents" style={$title} />
        <SizedBox height={20} />
        <Text tx="registerScreen:register" style={$subtitle} />
        <SizedBox height={20} />
        <Formik
          initialValues={initialValues}
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={(values: RegisterRequestModel, { setSubmitting }) => {
            doLogin(values)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <View>
              <TextField
                height={40}
                fontSize={14}
                onSubmitEditing={() => refLastName.current?.focus()}
                LeftAccessory={() => (
                  <Icon icon="userNameIocn" size={24} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.name && touched.name
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                status={errors.name && touched.name ? "error" : undefined}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholderTx="registerScreen:name"
                placeholderTextColor="#9EA2AE"
                keyboardType="default"
                returnKeyType="next"
                HelperTextProps={$helper}
                helper={errors.name && touched.name ? errors.name : undefined}
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                fontSize={14}
                ref={refLastName}
                onSubmitEditing={() => refPhoneNumber.current?.focus()}
                LeftAccessory={() => (
                  <Icon icon="userNameIocn" size={24} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.last_name && touched.last_name
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                status={errors.last_name && touched.last_name ? "error" : undefined}
                onChangeText={handleChange("last_name")}
                onBlur={handleBlur("last_name")}
                value={values.last_name}
                placeholderTx="registerScreen:lastName"
                placeholderTextColor="#9EA2AE"
                keyboardType="default"
                returnKeyType="next"
                HelperTextProps={$helper}
                helper={errors.last_name && touched.last_name ? errors.last_name : undefined}
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                fontSize={14}
                ref={refPhoneNumber}
                onSubmitEditing={() => refEmail.current?.focus()}
                LeftAccessory={() => (
                  <Icon icon="phoneNumberIcon" size={22} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.cell_phone && touched.cell_phone
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                status={errors.cell_phone && touched.cell_phone ? "error" : undefined}
                onChangeText={handleChange("cell_phone")}
                onBlur={handleBlur("cell_phone")}
                value={values.cell_phone}
                placeholderTx="registerScreen:phoneNumber"
                placeholderTextColor="#9EA2AE"
                keyboardType="numeric"
                returnKeyType="next"
                HelperTextProps={$helper}
                helper={errors.cell_phone && touched.cell_phone ? errors.cell_phone : undefined}
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                fontSize={14}
                ref={refEmail}
                onSubmitEditing={() => refPassword.current?.focus()}
                LeftAccessory={() => (
                  <Icon icon="emailIcon" size={24} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.email && touched.email
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                status={errors.email && touched.email ? "error" : undefined}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholderTx="registerScreen:email"
                placeholderTextColor="#9EA2AE"
                returnKeyType="next"
                keyboardType="email-address"
                HelperTextProps={$helper}
                helper={errors.email && touched.email ? errors.email : undefined}
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                fontSize={14}
                ref={refPassword}
                onSubmitEditing={() => refConfirmPassword.current?.focus()}
                secureTextEntry={isPasswordHidden}
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
                placeholderTx="registerScreen:password"
                placeholderTextColor="#9EA2AE"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                RightAccessory={PasswordRightAccessory}
                helper={
                  errors.password && touched.password
                    ? errors.password
                    : translate("registerScreen:passwordMustBeSixDigits")
                }
                HelperTextProps={errors.password && touched.password ? $helper : $helperInfo}
                returnKeyType="next"
              />
              <SizedBox height={15} />
              <TextField
                height={40}
                ref={refConfirmPassword}
                fontSize={14}
                secureTextEntry={isConfirmPasswordHidden}
                status={errors.password_confirm && touched.password_confirm ? "error" : undefined}
                LeftAccessory={() => (
                  <Icon icon="passwordIcon" size={24} color="#9EA2AE" style={$leftAccessory} />
                )}
                inputWrapperStyle={[
                  $inputWrapperStyle,
                  errors.password_confirm && touched.password_confirm
                    ? $errroBorder
                    : { backgroundColor: colors.transparent },
                ]}
                placeholderTx="registerScreen:confirmPassword"
                placeholderTextColor="#9EA2AE"
                onChangeText={handleChange("password_confirm")}
                onBlur={handleBlur("password_confirm")}
                value={values.password_confirm}
                RightAccessory={ConfirmPasswordRightAccessory}
                helper={
                  errors.password_confirm && touched.password_confirm
                    ? errors.password_confirm
                    : undefined
                }
                HelperTextProps={$helper}
                returnKeyType="done"
              />
            </View>
          )}
        </Formik>
        <SizedBox height={20} />
        <View style={$termsAndConditionView}>
          <Checkbox
            value={isTerm}
            inputInnerStyle={{ backgroundColor: colors.redButtonColor }}
            inputOuterStyle={{ borderColor: "#CFD8DC", backgroundColor: colors.transparent }}
            onValueChange={() => setIsTerm(!isTerm)}
          />
          <SizedBox width={10} />
          <Text>
            <Text tx="registerScreen:iAcceptThe" style={$iAccept} />
            <Text
              tx="registerScreen:termsAndConditionAndPrivacyPolicy"
              style={$termsAndCondition}
            />
          </Text>
        </View>
        <SizedBox height={200} />
      </Screen>

      <View style={$bottom}>
        <Button
          preset="red"
          tx="registerScreen:creatMyAccount"
          onPress={() => formikRef.current!.submitForm()}
        />
        <SizedBox height={15} />
        <View style={{ alignSelf: "center", marginHorizontal: 50 }}>
          <Text style={{ textAlign: "center" }}>
            <Text tx="registerScreen:doYouAlreadyHaveAccount" style={$iAccept} />
            <TouchableNativeFeedback
              style={{ backgroundColor: "yellow" }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text tx="registerScreen:login" style={$login} />
            </TouchableNativeFeedback>
            <Text tx="registerScreen:andDontMissAnything" style={$iAccept} />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={$modelCenter}>
          <View style={$modelContent}>
            <Text tx="registerScreen:helpUsConfirmThatThisEmailIsYours" style={$modelTitle} />
            <SizedBox height={20} />
            <Text tx="registerScreen:weHaveSentLinkToYourMail" style={$modelDescription} />
            <SizedBox height={20} />
            <Button
              preset="red"
              tx="registerScreen:openMail"
              onPress={() => {
                setModalVisible(!modalVisible)
                Linking.openURL("mailto:")
              }}
            />
            <SizedBox height={10} />
            <Button
              preset="redouline"
              tx="registerScreen:cancel"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
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
  backgroundColor: colors.pageBackgroundColor,
}

const $iAccept: TextStyle = {
  color: "#696868",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $termsAndCondition: TextStyle = {
  color: "#212121",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
  textDecorationLine: "underline",
}

const $login: TextStyle = {
  color: "#EA2B4C",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 14,
}
const $helper: any = { style: { color: "#EE443F" } }
const $helperInfo: any = { style: { color: "#9EA2AE" } }
const $errroBorder: ViewStyle = { backgroundColor: "#FDECEC", borderColor: "#EE443F" }
const $termsAndConditionView: ViewStyle = {
  alignSelf: "flex-start",
  flexDirection: "row",
  marginHorizontal: 5,
}

const $leftAccessory: ImageStyle = {
  alignSelf: "center",
  flex: 1,
  marginLeft: 10,
}

const $modelCenter: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  margin: 10,
}

const $modelContent: ViewStyle = {
  borderRadius: 12,
  backgroundColor: colors.whiteColor,
  padding: 20,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
}

const $modelTitle: TextStyle = {
  fontFamily: typography.fonts.inter.semiBold,
  color: "#131927",
  fontSize: 16,
  textAlign: "center",
}

const $modelDescription: TextStyle = {
  fontFamily: typography.fonts.inter.regular,
  color: "#6D717F",
  fontSize: 14,
  lineHeight: 20,
  textAlign: "center",
}
