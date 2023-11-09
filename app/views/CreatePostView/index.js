import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {createThumbnail} from 'react-native-create-thumbnail';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';

import {withTheme} from '../../theme';
import KeyboardView from '../../containers/KeyboardView';
import sharedStyles from '../Styles';
import StatusBar from '../../containers/StatusBar';
import styles from './styles';
import images from '../../assets/images';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import SafeAreaView from '../../containers/SafeAreaView';
import {showErrorAlert, showToast} from '../../lib/info';
import {setUser as setUserAction} from '../../actions/login';
import * as HeaderButton from '../../containers/HeaderButton';
import CsTextInput from '../../containers/CsTextInput';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {
  POST_TYPE_PHOTO,
  POST_TYPE_TEXT,
  POST_TYPE_VIDEO,
} from '../../constants/app';
import firebaseSdk, {DB_ACTION_ADD} from '../../lib/firebaseSdk';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import {GradientHeader} from '../../containers/GradientHeader';
import {COLOR_BTN_BACKGROUND, HEADER_BAR_START, themes} from '../../constants/colors';

const CreatePostView = props => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [state, setState] = useState({
    type: props.route.params?.type ?? POST_TYPE_TEXT,
    file_path: props.route.params?.file_path,
    thumbnail: null,
    playing: false,
    isLoading: true,
  });
  const textInputRef = useRef(null);

  const {user, theme} = props;
  const {file_path, thumbnail, type, isLoading, playing} = state;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{paddingLeft: 15}}
          onPress={() => navigation.goBack()}>
          <VectorIcon
            type={'AntDesign'}
            name={'arrowleft'}
            size={20}
            color={theme === 'dark' ? 'white' : themes[theme].deactiveTintColor}
          />
        </TouchableOpacity>
      ),
      title: I18n.t('Create_post')
    });
  }, [text]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (state.type === POST_TYPE_VIDEO) {
      createThumbnail({url: state.file_path, timestamp: 100}).then(
        thumbnail => {
          setState({...state, isLoading: false, thumbnail: thumbnail.path});
          console.log('thumbnail', thumbnail);
        },
      );
    } else {
      setState({...state, isLoading: false});
    }
  };

  const isValid = () => {
    if (type === POST_TYPE_TEXT && !text.length) {
      showToast(I18n.t('please_enter_post_text'));
      textInputRef.current.focus();
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (!isValid()) return;

    setState({...state, isLoading: true});

    let post = {
      userId: user.userId,
      likes: [],
      comments: [],
      type: type,
      text: text.length > 0 ? text : null,
      date: new Date(),
    };

    switch (type) {
      case POST_TYPE_TEXT:
        return savePost(post);
      case POST_TYPE_PHOTO:
        return firebaseSdk
          .uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, file_path)
          .then(image_url => {
            post.photo = image_url;
            savePost(post);
          })
          .catch(err => {
            showErrorAlert(I18n.t('Upload_Image_failed'));
            setState({...state, isLoading: false});
          });
      case POST_TYPE_VIDEO:
        return firebaseSdk
          .uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, file_path)
          .then(video_url => {
            post.video = video_url;
            firebaseSdk
              .uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, thumbnail)
              .then(image_url => {
                post.thumbnail = image_url;
                savePost(post);
              })
              .catch(err => {
                showErrorAlert(I18n.t('Uploading_thumbnail_failed'));
                setState({...state, isLoading: false});
              });
          })
          .catch(err => {
            showErrorAlert(I18n.t('Upload_Image_failed'));
            setState({...state, isLoading: false});
          });
    }
  
  };

  const savePost = post => {
    firebaseSdk
      .setData(firebaseSdk.TBL_POST, DB_ACTION_ADD, post)
      .then(() => {
        showToast(I18n.t('Publish_post_complete'));
        setState({...state, isLoading: false});
        navigation.popToTop();
      })
      .catch(() => {
        showErrorAlert(I18n.t('Publish_post_failed'));
        setState({...state, isLoading: false});
      });
  };

  const renderForm = () => {
    switch (type) {
      case POST_TYPE_TEXT:
        return (
          <View style={styles.inputContainer}>
            <CsTextInput
              inputRef={textInputRef}
              containerStyle={styles.roundInput}
              inputStyle={styles.textStyle}
              wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
              placeholder={I18n.t('write_something_here')}
              returnKeyType="send"
              keyboardType="default"
              onChangeText={val => setText(val)}
              textLength={text.length}
              multiline={true}
              theme={theme}
            />
          </View>
        );
      case POST_TYPE_PHOTO:
        return (
          <View style={styles.inputContainer}>
            <CsTextInput
              inputRef={textInputRef}
              containerStyle={styles.roundInput}
              inputStyle={styles.textStyle}
              wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
              placeholder={I18n.t('Photo_post_placeholder')}
              returnKeyType="send"
              keyboardType="default"
              onChangeText={val => setText(val)}
              textLength={text.length}
              multiline={true}
              theme={theme}
            />
            <Image
              source={{uri: file_path}}
              style={[styles.imageStyle, {borderRadius: 20, marginTop:10}]}
              resizeMode="cover"
            />
          </View>
        );
      case POST_TYPE_VIDEO:
        return (
          <View style={styles.inputContainer}>
            {playing && (
              <Video
                source={{uri: file_path}}
                style={styles.video}
                controls
                onEnd={() => setState({...state, playing: false})}
                resizeMode={'contain'}
              />
            )}
            {thumbnail && !playing && (
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{uri: thumbnail}}
                  style={styles.thumbnail}
                  resizeMode={'contain'}
                />
                <TouchableOpacity
                  onPress={() => setState({...state, playing: true})}
                  style={[styles.playIcon, {position: 'absolute'}]}>
                  <VectorIcon
                    name="playcircleo"
                    type={'AntDesign'}
                    size={72}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={{height: 15}}/>
            <CsTextInput
              inputRef={textInputRef}
              containerStyle={styles.roundInput}
              inputStyle={styles.textStyle}
              wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
              placeholder={I18n.t('Video_post_placeholder')}
              returnKeyType="send"
              keyboardType="default"
              onChangeText={val => setText(val)}
              textLength={text.length}
              multiline={true}
              theme={theme}
            />
          </View>
        );
    }
    return null;
  };

  return (
    <SafeAreaView
      style={[
        sharedStyles.container,
        {backgroundColor: themes[theme].navbarBackground},
      ]}>
      <StatusBar />
      <KeyboardView
        contentContainerStyle={[
          sharedStyles.contentContainer,
          {
            backgroundColor: themes[theme].backgroundColor,
            height: '100%',
          },
        ]}
        keyboardVerticalOffset={128}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 15,
          }}
          {...scrollPersistTaps}>
          {isLoading && (
            <ActivityIndicator absolute theme={theme} size={'large'} />
          )}
          <View style={{flex: 1, marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.userName, {color: themes[theme].activeTintColor}]}>
                {I18n.t('whats_on_your_mind')}
              </Text>
              <Text style={[styles.userName, {marginLeft: 5, color: themes[theme].websiteLink}]}>
                {user?.displayName || ''}
              </Text>
            </View>

            {renderForm()}

            <TouchableOpacity style={[styles.button, {backgroundColor: COLOR_BTN_BACKGROUND}]}
              onPress={onSubmit}>
              <Text style={[styles.updateText, {color: themes[theme].normalTextColor}]}>
                {I18n.t('Publish')}
              </Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  user: state.login.user,
});

const mapDispatchToProps = dispatch => ({
  setUser: params => dispatch(setUserAction(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(CreatePostView));
