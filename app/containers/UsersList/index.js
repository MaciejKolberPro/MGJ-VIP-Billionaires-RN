import React, { useEffect, useState, useRef } from 'react'
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { COLOR_YELLOW, themes } from '../../constants/colors'
import StatusBar from '../../containers/StatusBar'
import { withTheme } from '../../theme'
import SearchBox from '../../containers/SearchBox'
import styles from './styles'
import { setUser as setUserAction } from '../../actions/login'
import images from '../../assets/images'
import firebaseSdk, { DB_ACTION_ADD, DB_ACTION_DELETE, NOTIFICATION_TYPE_FOLLOW } from '../../lib/firebaseSdk'
import ActivityIndicator from '../../containers/ActivityIndicator'
import I18n from '../../i18n'
import { ALL_USERS, FOLLOWER_USERS, FOLLOWING_USERS } from '../../constants/app'

const UsersList = ({ theme, user, setUser, type, isSelf, account = [] }) => {
  const navigation = useNavigation()
  const [state, setState] = useState({
    refreshing: false,
    loading: true,
    updating: false,
  })
  const [data, setData] = useState([])
  const [text, setText] = useState('')
  const inputBox = useRef(null)

  const { refreshing, updating, loading } = state

  useEffect(() => {
    if (inputBox.current) {
      inputBox.current.focus()
    }
  }, [])

  useEffect(() => {
    getData(text)
  }, [text, user])

  const getData = async (searchText) => {
    const posts = []
    const users = []
    const followers = []
    const followings = []
    const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get()
    const postSnaps = await firestore().collection(firebaseSdk.TBL_POST).get()
    postSnaps.forEach(p => posts.push({ id: p.id, userId: p.data().userId }))
    userSnaps.forEach(s => {
      const userInfo = { ...s.data(), id: s.id }
      const userPosts = posts.filter(p => p.userId === userInfo.userId)
      if (isSelf) {
        if (userInfo.userId !== user.userId && !user.blocked.includes(userInfo.userId)) {
          users.push({ ...userInfo, postCount: userPosts.length })
          if (user.followings.includes(userInfo.userId)) {
            followings.push({ ...userInfo, postCount: userPosts.length })
          }
          if (user.followers.includes(userInfo.userId)) {
            followers.push({ ...userInfo, postCount: userPosts.length })
          }
        }
      } else {
        if (userInfo.userId !== account.userId && !account.blocked.includes(userInfo.userId)) {
          users.push({ ...userInfo, postCount: userPosts.length })
          if (account.followings.includes(userInfo.userId)) {
            followings.push({ ...userInfo, postCount: userPosts.length })
          }
          if (account.followers.includes(userInfo.userId)) {
            followers.push({ ...userInfo, postCount: userPosts.length })
          }
        }
      }
    })

    let temp = []
    if (type === ALL_USERS) {
      temp = users
    } else if (type === FOLLOWER_USERS) {
      temp = followers
    } else if (type === FOLLOWING_USERS) {
      temp = followings
    }

    if (searchText.length > 0) {
      const data = temp.filter(d => {
        const key = d.displayName || ''
        return key.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
      })
      setData(data)
      setState({ ...state, updating: false, loading: false, refreshing: false })
    } else {
      setData(temp)
      setState({ ...state, updating: false, loading: false, refreshing: false })
    }
  }

  const onSearchChangeText = text => {
    setText(text)
    setState({ ...state, loading: false })
  }

  const onToggleFollow = (item, following) => {
    setState({ ...state, updating: true })
    firebaseSdk
      .updateFollows(user.id, item.id, following ? DB_ACTION_DELETE : DB_ACTION_ADD)
      .then(({ myFollowings }) => {
        if (!following) {
          const activity = {
            type: NOTIFICATION_TYPE_FOLLOW,
            sender: user.userId,
            receiver: item.userId,
            content: '',
            text: item.text,
            postId: null,
            title: item.displayName,
            message: I18n.t('user_follows_you', {
              name: user.displayName,
            }),
            date: new Date(),
          }
          firebaseSdk.addActivity(activity, item.token).then(r => {})
        }
        setUser({ followings: myFollowings })
      })
      .finally(() => {
        setState({ ...state, updating: false })
      })
  }

  const onPressItem = item => {
    navigation.push('OtherProfile', { userId: item.userId })
  }

  const renderItem = ({ item }) => {
    const following = user.followings.includes(item.userId)
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => onPressItem(item)}>
        <View style={styles.itemHeader}>
          <View style={[styles.avatarContainer, { borderColor: themes[theme].borderColor }]}>
            <Image
              source={item.avatar ? { uri: item.avatar } : images.default_avatar}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemText, { color: themes[theme].activeTintColor }]}>
              {item.displayName}
            </Text>
            {item.handle && (
              <Text style={[styles.itemPost, { color: themes[theme].textColor }]}>
                {item.handle}
              </Text>
            )}
            {item.postCount > 0 && (
              <Text style={[styles.itemPost, { color: themes[theme].textColor }]}>
                {`${item.postCount} ${I18n.t('Posts').toLowerCase()}`}
              </Text>
            )}
          </View>
        </View>
        {isSelf && (
          <TouchableOpacity
            style={[styles.actionContainer, {
              backgroundColor: themes[theme].backgroundColor, borderColor: themes[theme].borderColor,
            }]}
            onPress={() => onToggleFollow(item, following)}
          >
            <Text
              style={[
                styles.actionText,
                { color: following ? COLOR_YELLOW : themes[theme].activeTintColor },
              ]}>
              {following ? I18n.t('Following').toLowerCase() : I18n.t('Follow').toLowerCase()}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator theme={theme} size={'large'} />
    }
    return null
  }

  const onRefresh = () => {
    setState({ ...state, refreshing: true })
    getData(text)
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <SearchBox
        onChangeText={onSearchChangeText}
        theme={theme}
        placeholder={I18n.t('Search')}
      />
      {updating && <ActivityIndicator absolute theme={theme} size={'large'} />}
      <View style={[styles.container, { marginVertical: 16 }]}>
        {data.length > 0 && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themes[theme].activeTintColor} />
            }
          />
        )}
      </View>
    </View>
  )
}

const mapStateToProps = state => ({
  user: state.login.user,
})

const mapDispatchToProps = dispatch => ({
  setUser: params => dispatch(setUserAction(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(UsersList))