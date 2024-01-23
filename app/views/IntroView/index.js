import React, { useRef } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from '../../theme'
import styles from './styles'
import images from '../../assets/images'
import AppIntroSlider from 'react-native-app-intro-slider'
import sharedStyles from '../Styles'
import { themes } from '../../constants/colors'
import I18n from '../../i18n'
import Button from '../../containers/Button'
import { appReady } from '../../actions/app'
import i18n from '../../i18n'

const theme = 'light'

const slides = [
  {
    key: 1,
    title: i18n.t('Onboard_text_welcome'),
    text: i18n.t('Onboard_text_1'),
    image: images.intro_1,
  },
  {
    key: 2,
    title: i18n.t('Onboard_text_welcome'),
    text: i18n.t('Onboard_text_2'),
    image: images.intro_2,
  },
  {
    key: 3,
    title: i18n.t('Onboard_text_welcome_2'),
    text: i18n.t('Onboard_text_3'),
    image: images.intro_3,
  },
]

const IntroView = ({ appReady }) => {
  const sliderRef = useRef(null)
  const _renderItem = ({ item }) => (
    <ImageBackground style={styles.container} source={images.background}>
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.description}>
          <Text style={[styles.title, { color: themes[theme].titleColor }]}>{item.title}</Text>
          <Text style={[styles.text, { color: themes[theme].titleColor }]}>{item.text}</Text>
        </View>
      </View>
    </ImageBackground>
  )

  const _renderPagination = (activeIndex) => {
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {slides.length > 1 &&
              slides.map((_, i) => (
                <View
                  key={i}
                  style={i === activeIndex ? styles.activatedDot : [styles.dot]}
                />
              ))}
          </View>
          <View style={{ marginHorizontal: 48, marginTop: 48 }}>
            <Button
              style={styles.submitBtn}
              title={activeIndex < slides.length - 1 ? I18n.t('Next').toUpperCase() : I18n.t('Proceed_to_app')}
              size="W"
              onPress={() => _onDone(activeIndex)}
              theme={theme}
              pressingHighlight
            />
          </View>
        </SafeAreaView>
      </View>
    )
  }


  const _onDone = (activeIndex) => {
    if (activeIndex < slides.length - 1) {
      sliderRef.current.goToSlide(++activeIndex)
    } else {
      appReady()
    }
  }
  return (
    <View
      style={[
        sharedStyles.container,
        { backgroundColor: themes[theme].backgroundColor },
      ]}>
      <AppIntroSlider
        ref={sliderRef}
        renderItem={_renderItem}
        data={slides}
        onDone={_onDone}
        renderPagination={_renderPagination}
        bottomButton
      />
    </View>

  )
}

const mapDispatchToProps = dispatch => ({
  appReady: () => dispatch(appReady()),
})

export default connect(null, mapDispatchToProps)(withTheme(IntroView))
