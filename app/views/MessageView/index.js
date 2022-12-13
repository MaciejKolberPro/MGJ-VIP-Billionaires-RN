import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  FlatList,
  Image,
  RefreshControl, SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { COLOR_BORDER, COLOR_GRAY_DARK, COLOR_WHITE, themes } from '../../constants/colors'
import StatusBar from '../../containers/StatusBar'
import { withTheme } from '../../theme'
import images from '../../assets/images'
import styles from './styles'
import firebaseSdk from '../../lib/firebaseSdk'
import { dateStringFromNow, dateStringFromNowShort } from '../../utils/datetime'
import ActivityIndicator from '../../containers/ActivityIndicator'
import I18n from '../../i18n'
import MainScreen from '../../containers/MainScreen'
import * as HeaderButton from '../../containers/HeaderButton'
import debounce from '../../utils/debounce'
import { navigateToProfile } from '../../utils/const'
import { fetchUnread as fetchUnreadAction } from '../../actions/chat'
import FloatingTextInput from '../../containers/FloatingTextInput'
import sharedStyles from '../Styles'
import { SearchBox } from '../../containers/SearchBox'
import scrollPersistTaps from '../../utils/scrollPersistTaps'
import { Badge } from 'react-native-paper'
import moment from 'moment'
import CsAutocompleteSelect from '../../containers/CsAutocompleteSelect'

const MessageView = props => {
  const tabBarHeight = useBottomTabBarHeight()
  const [state, setState] = useState({
    text: '',
    data: [],
    searchData: [],
    refreshing: false,
    loading: true,
    unReads: 0,
    users: [],
  })
  const { theme, navigation, user } = props
  const { searchData, data, refreshing, loading, users } = state

  const unSubscribeRoom = useRef(null)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={navigation.toggleDrawer}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
          }}>
          <Feather
            name="menu"
            size={22}
            color={themes[theme].activeTintColor}
          />
        </TouchableOpacity>
      ),
      title: I18n.t('Messages'),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('FindFriend')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
          }}>
          <Feather
            name="search"
            size={22}
            color={themes[theme].activeTintColor}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: themes[theme].messageHeader,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: themes[theme].activeTintColor,
        alignSelf: 'flex-start',
      },
    })
  }, [theme])

  useEffect(() => {
    init()

    return () => {
      if (unSubscribeRoom.current) {
        unSubscribeRoom.current()
        unSubscribeRoom.current = null
      }
    }
  }, [])

  // useEffect(() => {
  //   onSearch();
  // }, [state.text, state.data]);

  const init = async () => {
    const messageUsers = []
    if (global.unSubscribeRoom) {
      global.unSubscribeRoom()
      global.unSubscribeRoom = undefined
    }
    if (unSubscribeRoom.current) {
      unSubscribeRoom.current()
      unSubscribeRoom.current = null
    }
    const roomSubscribe = await firestore().collection(firebaseSdk.TBL_ROOM)
    unSubscribeRoom.current = roomSubscribe.onSnapshot(async querySnapShot => {
      const userSnaps = await firestore()
        .collection(firebaseSdk.TBL_USER)
        .get()
      const users = []
      userSnaps.forEach(s => users.push(s.data()))

      let allUnReads = 0
      let list = []
      querySnapShot.forEach(doc => {
        const room = doc.data()
        if (room.sender === user.userId || room.receiver === user.userId) {
          const receiver = users.find(u => u.userId === (room.sender === user.userId ? room.receiver : room.sender))
          let unReads = 0
          if (room.confirmUser === user.userId) {
            unReads = room.unReads
          }
          if (!messageUsers.find(messageUser => messageUser.userId === receiver.userId)) {
            messageUsers.push(receiver)
          }
          allUnReads += unReads
          list.push({
            id: doc.id,
            ...room,
            account: receiver,
            unReads,
          })
        }
      })
      list.sort((a, b) => b.date.seconds - a.date.seconds)
      setState({
        ...state,
        data: list,
        refreshing: false,
        loading: false,
        unReads: allUnReads,
        users: messageUsers,
      })
      props.fetchUnread()
    })
  }

  const onRefresh = () => {
    setState({ ...state, refreshing: true })
    init()
  }

  const onSearchChangeText = text => {
    setState({
      ...state,
      text: text.trim(),
      loading: false,
    })
  }

  const onSearchMessage = async (roomID, text) => {
    const messagesRef = await firestore().collection(firebaseSdk.TBL_MESSAGE)
    const snapshot = await messagesRef.where('roomId', '==', roomID).get()
    if (snapshot.empty) {
      return false
    }

    let isExistCounter = 0
    snapshot.forEach(doc => {
      if (doc.data().message.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
        isExistCounter++
      }
    })

    return isExistCounter > 0

  }

  const onSearch = () => {
    const { text, data } = state
    if (text.length > 0) {
      let searchData = []
      data.map(async d => {
        if (d.account.displayName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
          searchData.push(d)
        } else {
          await onSearchMessage(d.id, text) ? searchData.push(d) : null
        }
      })
      setState({
        ...state,
        searchData,
        loading: false,
        refreshing: false,
      })
    } else {
      setState({
        ...state,
        searchData: data,
        loading: false,
        refreshing: false,
      })
    }
  }

  const onPressItem = item => {
    navigation.navigate('Chat', { room: item })
  }

  const isOnline = true
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => onPressItem(item)}
      style={[styles.itemContainer, {
        backgroundColor: themes[theme].chatSecondaryColor,
        marginBottom: index === data.length - 1 ? tabBarHeight : undefined,
      }]}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            item.account?.avatar
              ? { uri: item.account?.avatar }
              : images.default_avatar
          }
          style={styles.itemImage}
        />
        <Badge
          visible={true}
          size={12}
          style={[styles.badge, { backgroundColor: isOnline ? '#32D674' : '#2B2A2A' }, { borderColor: themes[theme].chatBadgeBorderColor }]}>
        </Badge>
      </View>
      <View style={styles.itemContent}>
        <Text
          style={[styles.itemTitle, { color: themes[theme].activeTintColor }]}>
          {item.account?.displayName}
        </Text>
        <Text
          style={styles.itemMessage}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', marginHorizontal: 2 }}>
        <Text style={[styles.itemMessage, { color: '#C7C7C7' }]}>
          {dateStringFromNowShort(item.date)}
        </Text>
        <Text style={[styles.itemMessage, { color: '#C7C7C7' }]}>
          {item.unReads > 0 ? item.unReads : ''}
        </Text>
      </View>
    </TouchableOpacity>
  )
  return (
    <View style={[sharedStyles.container, { backgroundColor: themes[theme].chatBackground, paddingHorizontal: 16 }]}>
      {loading && (
        <ActivityIndicator absolute theme={theme} size={'large'} />
      )}
      <SafeAreaView style={sharedStyles.container}>
        <SearchBox
          onChangeText={onSearchChangeText}
          onSubmitEditing={onSearch}
          theme={theme}
          clearTextType
          placeholder={I18n.t('Search')}
        />
        <View style={styles.chatRoomCounter}>
          <Text style={[styles.chatRoomText, { color: themes[theme].titleColor }]}>Chat</Text>
          <Badge style={{ backgroundColor: COLOR_GRAY_DARK, color: COLOR_WHITE }}>
            {searchData && searchData.length > 0 ? searchData.length : data.length}
          </Badge>
        </View>

        <View style={{ flex: 1 }}>
          {state.text.length > 0 && (
            <FlatList
              data={searchData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={themes[theme].actionColor}
                />
              }
            />
          )}
          {state.text.length < 1 && data.length > 0 ? (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={themes[theme].actionColor}
                />
              }
            />
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  )
}
const mapStateToProps = state => ({
  user: state.login.user,
})

const mapDispatchToProps = dispatch => ({
  fetchUnread: params => dispatch(fetchUnreadAction(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageView))
