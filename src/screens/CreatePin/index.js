import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import jwtdecode from 'jwt-decode';

import Auth from '../../components/Auth';
import Button from '../../components/Button';
import http from '../../helpers/http';
import {showMessage} from '../../helpers/showMessage';

class CreatePin extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    code: '',
    id: null,
    loading: false,
  };
  onSubmit = async () => {
    this.setState({loading: true});
    const pin = new URLSearchParams();
    pin.append('pin', this.state.code);
    try {
      const {data} = await http().post(`api/auth/pin?id=${this.state.id}`, pin);
      showMessage(data.message, 'success');
      try {
        await http().patch(`api/auth/verified?id=${this.state.id}`);
        this.setState({loading: false});
        this.props.navigation.navigate('SignIn');
      } catch (error) {
        this.setState({loading: false});
        showMessage(error.response.data.message, 'danger');
      }
    } catch (error) {
      this.setState({loading: false});
      showMessage(error.response.data.message, 'danger');
    }
  };
  componentDidMount() {
    const {route} = this.props;
    if (route.params.token) {
      const {id} = jwtdecode(route.params.token);
      console.log(id);
      this.setState({id});
    }
  }
  render() {
    return (
      <Auth
        title="Create Pin"
        subTitle="Create a PIN that’s contain 6 digits number for security purpose in Walletchip.">
        <View style={styles.row}>
          <SmoothPinCodeInput
            codeLength={6}
            cellStyle={styles.cell}
            cellStyleFocused={styles.focus}
            value={this.state.code}
            onTextChange={code => this.setState({code})}
          />
        </View>
        {this.state.loading ? (
          <ActivityIndicator color="#000000" size="large" />
        ) : (
          <Button
            text="Confirm"
            textColor={this.state.code.length === 6 ? 'white' : '#88888F'}
            color={this.state.code.length === 6 ? '#6379F4' : '#DADADA'}
            onPress={() => this.onSubmit()}
          />
        )}
      </Auth>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 178,
  },
  cell: {
    borderWidth: 1,
    borderColor: 'rgba(169, 169, 169, 0.6)',
    borderRadius: 10,
  },
  focus: {
    borderColor: '#6379F4',
  },
});

export default CreatePin;
