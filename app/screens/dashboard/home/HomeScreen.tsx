import { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  FlatList,
  Image,
  TextStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Card, EventsList, Screen, SearchBar, SizedBox, Text } from "@/components"
import { colors, typography } from "@/theme"
import { View } from "react-native"
import { api } from "@/services/api"
import { formatDate } from "@/utils/formatDate"
import { Categories, EventListResponseModel, Events } from "@/models/EventListResponseModel"
import moment from "moment"
import { FlashList } from "@shopify/flash-list"
import { number } from "mobx-state-tree/dist/internal"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import React from "react"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(_pros) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [filteredData, setFilteredData] = useState<Events[] | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Categories | null>(null)
  const [categories, setCategories] = useState<Categories[] | null>(null)
  const [subCategories, setSubCategories] = useState<Categories[] | null>(null)
  
  const rawUniqueSubCategories = useRef<Categories[]>()
  const rawData = useRef<EventListResponseModel>()

  const selectedCategoryRef = useRef<Categories>()
  const selectedSubcategoryRef = useRef<Categories | null>()

  const {navigation}=_pros
 
  const organizeData = (data: EventListResponseModel) => {
    // Extract all categories and subcategories
    const allCategories = data?.events.flatMap((event) => event.categories)

    //Extract all unique categories
    const categores = allCategories.filter((cat) => cat.parent == null)

    // Remove duplicates
    const distinctCategories = Array.from(new Map(categores.map((cat) => [cat.uuid, cat])).values())

    //Extract all unique sub categories
    const subcategories = allCategories.filter((cat) => cat.parent != null)
    rawUniqueSubCategories.current = subcategories

    // Filter subcategories based on selected category
    const filteredSubcategories: Categories[] | undefined = subcategories?.filter(
      (sub) => sub.parent === allCategories[0]?.uuid,
    )
    // Remove duplicates
    const distinctSubCategories = Array.from(
      new Map(filteredSubcategories.map((cat) => [cat.uuid, cat])).values(),
    )
    setCategories(distinctCategories)

    setSubCategories(distinctSubCategories)

    setSelectedCategory(distinctCategories[0])
    selectedCategoryRef.current = distinctCategories[0]

    //filter data initially
    const filteredEvents = data?.events.filter((event) =>
      event.categories.some((cat) => cat.uuid === selectedCategoryRef.current?.uuid),
    )
    setFilteredData(filteredEvents)
  }

  function filterSubCategory() {
    const filteredSubcategories: Categories[] | undefined = rawUniqueSubCategories.current?.filter(
      (sub) => sub.parent === selectedCategoryRef.current?.uuid,
    )

    // Remove duplicates
    const distinctSubCategories = Array.from(
      new Map(filteredSubcategories?.map((cat) => [cat.uuid, cat])).values(),
    )
    setSubCategories(distinctSubCategories!)
  }

  const filterEventForCategorySelection = () => {
    if (rawData != null) {
      const filteredEvents = rawData.current?.events.filter((event) =>
        event.categories.some((cat) => cat.uuid === selectedCategoryRef.current?.uuid),
      )
      setFilteredData(filteredEvents)
    }
  }

  const filterEventForSubCategorySelelction = () => {
    if (rawData != null) {
      const filteredEvents = rawData.current?.events.filter((event) =>
        event.categories.some((cat) => cat.uuid === selectedSubcategoryRef.current?.uuid),
      )
      setFilteredData(filteredEvents)
    }
  }

  const getEvents = async () => {
    setLoading(true)
    const monthId: string = moment().format("YYYY-MM")
    const response = await api.getEvents(monthId)
    setLoading(false)
    if (response.kind == "ok") {
      rawData.current = response.data
      organizeData(response.data)
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  return (
    <View style={$root}>
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        backgroundColor={colors.pageBackgroundColor}
        contentContainerStyle={$screen}
      >
        <SearchBar />

        <SizedBox height={10} />
        {categories != null && (
          <FlashList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            extraData={selectedCategory}
            data={categories}
            estimatedItemSize={categories.length}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  selectedCategoryRef.current = item

                  setSelectedCategory(item)

                  filterSubCategory()

                  filterEventForCategorySelection()

                  selectedSubcategoryRef.current = null
                  setSelectedSubcategory(null)
                }}
              >
                <View
                  style={[
                    $category,
                    selectedCategory?.uuid == item.uuid
                      ? {
                          backgroundColor: colors.bottomMenuSelectdColor,
                          borderColor: colors.bottomMenuSelectdColor,
                        }
                      : {},
                  ]}
                >
                  <Text
                    style={
                      selectedCategory?.uuid == item.uuid
                        ? $selectedCategoryText
                        : $unSelectedCategoryText
                    }
                    text={item.name}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <SizedBox height={10} />
        {subCategories != null && subCategories.length != 0 && (
          <FlashList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={subCategories}
            extraData={selectedSubcategory}
            estimatedItemSize={subCategories.length}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  selectedSubcategoryRef.current = item
                  setSelectedSubcategory(item)
                  filterEventForSubCategorySelelction()
                }}
              >
                <View
                  style={[
                    $category,
                    selectedSubcategory?.uuid == item.uuid
                      ? {
                          backgroundColor: colors.bottomMenuSelectdColor,
                          borderColor: colors.bottomMenuSelectdColor,
                        }
                      : {},
                  ]}
                >
                  <Text
                    style={
                      selectedSubcategory?.uuid == item.uuid
                        ? $selectedCategoryText
                        : $unSelectedCategoryText
                    }
                    text={item.name}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <SizedBox height={10} />
        {filteredData != null && filteredData.length != 0 && <EventsList data={filteredData} navigation={navigation} />}
      </Screen>
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
  paddingHorizontal: 10,
}

const $category: ViewStyle = {
  borderRadius: 16,
  borderColor: colors.whiteColor,
  borderWidth: 1,
  backgroundColor: colors.whiteColor,
  paddingHorizontal: 7,
  paddingVertical: 3,
  marginRight: 10,
}

const $selectedCategoryText: TextStyle = {
  color: colors.whiteColor,
  fontSize: 14,
  fontFamily: typography.fonts.poppins.medium,
}

const $unSelectedCategoryText: TextStyle = {
  fontSize: 14,
  fontFamily: typography.fonts.poppins.medium,
}

const $activityIndicator: ViewStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
}
