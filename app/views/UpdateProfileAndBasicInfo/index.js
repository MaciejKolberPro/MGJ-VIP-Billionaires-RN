import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Image, Alert} from 'react-native';
import {RadioButton} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import styles from './style';
import images from '../../assets/images';
import {COLOR_WHITE, themes} from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import {withTheme} from '../../theme';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import I18n from '../../i18n';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {VectorIcon} from '../../containers/VectorIcon';
import Button from '../../containers/Button';
import {
  checkCameraPermission,
  checkPhotosPermission,
} from '../../utils/permissions';
import BasicInfoModal from './BasicInfoModal';
import AddExperienceModal from './AddExperienceModal';
import firebaseSdk from '../../lib/firebaseSdk';
import {showToast} from '../../lib/info';
import {loginSuccess as loginSuccessAction} from '../../actions/login';
import {appStart as appStartAction} from '../../actions/app';
import {connect} from 'react-redux';

const imagePickerConfig = {
  cropping: true,
  freeStyleCropEnabled: true,
  width: 1200,
  height: 1500,
  enableRotationGesture: true,
  avoidEmptySpaceAroundImage: false,
  cropperChooseText: I18n.t('Choose'),
  cropperCancelText: I18n.t('Cancel'),
  mediaType: 'photo',
};

const theme = 'light';

const UpdateProfileAndBasicInfo = ({loginSuccess, user, dispatch}) => {
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const [basicInfoUpdated, setBasicInfoUpdated] = useState(false);
  const [radioButtonChecked, setRadioButtonChecked] = useState(false);
  const [experienceAdded, setExperienceAdded] = useState(false);

  // modal states
  const [basicInfoModalOpen, setBasicInfoModalOpen] = useState(true);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState({
    imageUrl: '',
    imageName: 'Image name.png',
  });
  const [userInfo, setUserInfo] = useState({
    displayName: '',
    gender: 'male',
    city: '',
    phone: '',
    birthday: '',
    job: '',
    company: '',
    role: '',
    years_of_service: '',
    salary: '',
    avatar: '',
  });
  const onUserInfoUpdated = update => {
    console.log('final updated user data - ', update);
    setUserInfo(userInfo => {
      return {...userInfo, ...update};
    });
  };
  // open camera
  const takePhoto = async () => {
    if (await checkCameraPermission()) {
      ImagePicker.openCamera(imagePickerConfig)
        .then(image => {
          setImage_path(image);
        })
        .catch(console.warn);
    }
  };

  const setImage_path = async image => {
    const image_url = await firebaseSdk.uploadMedia(
      firebaseSdk.STORAGE_TYPE_PHOTO,
      image.path,
    );
    console.log('imageURL', image_url);
    if (image_url) {
      setProfileImage({
        imageUrl: image_url,
        imageName: image.filename,
      });
      userInfo.avatar = image_url;
      console.log('user with avatar', userInfo);
    }
  };
  // choose from gallery
  const chooseFromLibrary = async () => {
    if (await checkPhotosPermission()) {
      ImagePicker.openPicker(imagePickerConfig).then(image => {
        console.log('image', image);
        setImage_path(image);
      });
    }
  };

  const toggleAction = () => {
    Alert.alert('', I18n.t('Upload_Profile_Picture').toUpperCase(), [
      {
        text: I18n.t('Cancel'),
        onPress: () => {},
      },
      {
        text: I18n.t('Take_a_Photo'),
        onPress: () => {
          takePhoto();
        },
      },
      {
        text: I18n.t('Select_Photo'),
        onPress: () => {
          chooseFromLibrary();
        },
      },
    ]);
  };

  const onSubmit = () => {
    if (!userInfo) {
      showToast(I18n.t('please_complete_these_steps_to_confirm'));
      return;
    }

    if (!radioButtonChecked) {
      showToast(I18n.t('you_should_agree_with_terms'));
      return;
    }

    setIsLoading(true);
    const user_ = {...user, ...userInfo};
    firebaseSdk
      .updateUser(user_)
      .then(async () => {
        showToast(I18n.t('Register_complete'));
        loginSuccess({...user_, emailVerified: true});
      })
      .catch(err => {
        showErrorAlert(I18n.t('Register_fail'));
      })
      .finally(() => setIsLoading(false));
    console.log('user', user_);
  };
  return (
    <SafeAreaView
      style={{flex: 1, flexDirection: 'column', backgroundColor: COLOR_WHITE}}>
      <StatusBar />

      {/* Basic info modal */}
      <BasicInfoModal
        isVisible={basicInfoModalOpen}
        onBackdropPress={() => setBasicInfoModalOpen(!basicInfoModalOpen)}
        onUpdate={onUserInfoUpdated}
        setBasicInfoUpdated={setBasicInfoUpdated}
        setBasicInfoModalOpen={setBasicInfoModalOpen}
      />

      {/* Experience modal */}
      <AddExperienceModal
        isVisible={experienceModalOpen}
        onBackdropPress={() => setExperienceModalOpen(!experienceModalOpen)}
        onUpdate={onUserInfoUpdated}
        setExperienceAdded={setExperienceAdded}
        setExperienceModalOpen={setExperienceModalOpen}
      />

      <ScrollView
        style={{flex: 1, backgroundColor: COLOR_WHITE, height: '100%'}}
        {...scrollPersistTaps}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Image style={styles.logo} source={images.logo} />
          <Text
            style={[
              styles.welcomeText,
              {color: themes[theme].headerTitleColor},
            ]}>
            {I18n.t('Onboard_text_welcome')}
          </Text>
          <Text style={styles.completeStepsText}>
            {I18n.t('please_complete_these_steps_for_verification')}
          </Text>
        </View>

        {/* Upload Buttons container */}
        <View style={styles.uploadButtonsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={toggleAction}>
            <VectorIcon
              type="AntDesign"
              name="checkcircleo"
              color={profileImageUpdated ? '#1BA050' : '#858585'}
              size={18}
            />
            <Text style={styles.uploadProfileImageText}>
              {I18n.t('Upload_Profile_Picture')}
            </Text>
            <Text
              style={[
                styles.uploadNowText,
                {color: themes[theme].actionColor},
              ]}>
              {I18n.t('Upload_Now')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setBasicInfoModalOpen(!basicInfoModalOpen)}>
            <VectorIcon
              type="AntDesign"
              name="checkcircleo"
              color={basicInfoUpdated ? '#1BA050' : '#858585'}
              size={18}
            />
            <Text style={styles.uploadProfileImageText}>
              {I18n.t('update_basic_information')}
            </Text>
            <Text
              style={[
                styles.uploadNowText,
                {color: themes[theme].actionColor},
              ]}>
              {I18n.t('Upload_Now')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add experience container */}
        <View style={styles.addExperienceContainer}>
          <Text style={styles.updateExperienceTxt}>
            {I18n.t('Refresh_Your_Experience')}
          </Text>
          <TouchableOpacity
            style={styles.addExperienceBtn}
            onPress={() => setExperienceModalOpen(!experienceModalOpen)}>
            <Text
              style={[
                styles.addExperienceTxt,
                {color: themes[theme].otherAuxiliaryText},
              ]}>
              {I18n.t('Add_New_Experience')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other container */}
        <View style={styles.othersContainer}>
          <Text style={styles.updateExperienceTxt}>
            {I18n.t('Other_Options')}
          </Text>
          <TouchableOpacity style={styles.basicSubscriptionBtn}>
            <Image source={images.reward_badge} style={styles.reward_badge} />
            <View style={styles.basicSubscriptionAndUpgradePlanContainer}>
              <Text style={styles.basicSubscriptionText}>
                Basic Supscription
              </Text>
              <Text style={styles.upgradePlanText}>upgrade plan</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inviteNowBtn}>
            <Image
              source={images.fast_email_sending}
              style={styles.fast_email_sending}
            />
            <View style={styles.basicSubscriptionAndUpgradePlanContainer}>
              <Text style={styles.inviteTitle}>
                Invite to engage more people
              </Text>
              <Text style={styles.inviteDescription}>Invite now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom sheet/terms and conditions */}
      <View style={styles.bottomSheet}>
        <View style={styles.radioButtonAndText}>
          <RadioButton.Android
            status={radioButtonChecked ? 'checked' : 'unchecked'}
            onPress={() => setRadioButtonChecked(!radioButtonChecked)}
            // style={styles.radioButton}
            color="#DBAA2E"
          />
          <Text style={styles.termsAndConditionsPrivacyPolicy}>
            {I18n.t('Accept_Terms_text_1')}
            <Text style={styles.termsAndConditions}>
              {I18n.t('Terms_and_Conditions')}
            </Text>{' '}
            {I18n.t('And')} {'\n'}
            <Text style={styles.privacyPolicy}>{I18n.t('Privacy_Policy')}</Text>
          </Text>
        </View>
        <Button
          title={I18n.t('Confirm_And_Register_Account')}
          theme={theme}
          size="W"
          style={styles.confirmBtn}
          onPress={onSubmit}
          testID="confirn_create_account"
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  user: state.login.user,
});

const mapDispatchToProps = dispatch => ({
  loginSuccess: params => dispatch(loginSuccessAction(params)),
  appStart: params => dispatch(appStartAction(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(UpdateProfileAndBasicInfo));
