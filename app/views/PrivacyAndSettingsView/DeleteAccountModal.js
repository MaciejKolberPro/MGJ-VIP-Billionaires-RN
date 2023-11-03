import React from 'react';
import DialogInput from 'react-native-dialog-input';
import I18n from 'i18n-js';
import {connect} from 'react-redux';
import {withTheme} from '../../theme';

const DeleteAccountModal = ({isShow, onClose, theme, onSubmit}) => {
  return (
    <DialogInput
      isDialogVisible={isShow}
      textInputProps={{secureTextEntry: true}}
      title={I18n.t('del_account_title')}
      message={I18n.t('del_account_text')}
      hintInput={I18n.t('please_enter_password')}
      submitInput={password => {
        if (password && password !== '') {
          onClose();
          onSubmit(password);
        }
      }}
      closeDialog={() => {
        onClose();
      }}
    />
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(DeleteAccountModal));
