import React, { useEffect } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView, useWindowDimensions,
} from 'react-native'
import { connect } from 'react-redux'

import { themes } from '../../constants/colors'
import StatusBar from '../../containers/StatusBar'
import { withTheme } from '../../theme'
import styles from './styles'
import { VectorIcon } from '../../containers/VectorIcon'
import { useNavigation } from '@react-navigation/native'
import { SceneMap, TabView } from 'react-native-tab-view'
import firestore from '@react-native-firebase/firestore'
import firebaseSdk from '../../lib/firebaseSdk'
import UsersList from '../../containers/UsersList'
import { FOLLOWER_USERS, FOLLOWING_USERS } from '../../constants/app'

const ConnectionsView = ({ theme, user }) => {
  const layout = useWindowDimensions()
  const navigation = useNavigation()
  const [index, setIndex] = React.useState(0)
  const [routes, setRoutes] = React.useState([
    { key: 'first', title: 'Followers' },
    { key: 'second', title: 'Followings' },
  ])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.header} onPress={() => navigation.toggleDrawer()}>
          <VectorIcon type="MaterialCommunityIcons" name="arrow-left" color={themes[theme].titleColor} size={24} />
        </TouchableOpacity>
      ),
      title: null,
      headerRight: () => (<></>),
      headerStyle: {
        backgroundColor: themes[theme].backgroundColor,
        shadowOpacity: 0,
      },
    })
  }, [theme])

  useEffect(() => {
    init()
  }, [user])

  const init = async () => {
    const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get()

    const followers_list = []
    const followings_list = []
    userSnaps.forEach(s => {
      const userInfo = { ...s.data(), id: s.id }
      if (user.userId !== userInfo.userId) {
        if (user.followers && user.followers.includes(userInfo.userId)) {
          followers_list.push(userInfo)
        }
        if (user.followings && user.followings.includes(userInfo.userId)) {
          followings_list.push(userInfo)
        }
      }
    })
    setRoutes([
      { key: 'first', title: `Followers (${followers_list.length})` },
      { key: 'second', title: `Followings (${followings_list.length})` },
    ])
  }

  const renderTabBar = (props) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[styles.tabItem, index === i ? styles.activeTab : '', {
                borderBottomColor: index === i ? themes[theme].titleColor : themes[theme].borderColor,
              }]}
              onPress={() => setIndex(i)}>
              <Text style={[styles.tabText, {
                color: index === i ? themes[theme].titleColor : themes[theme].textColor,
              }]}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderScene = SceneMap({
    first: (() => <UsersList type={FOLLOWER_USERS} isSelf theme={theme} />),
    second: (() => <UsersList type={FOLLOWING_USERS} isSelf theme={theme} />),
  })

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[theme].backgroundColor,
      }}>
      <StatusBar />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          initialLayout={{ width: layout.width }}
          onIndexChange={setIndex}
        />
      </View>

    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  user: state.login.user,
})

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ConnectionsView))