import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar, Icon } from 'react-native-elements';

import Divider from '../components/divider';
import Badge from '../components/badge';

import { styles as listStyles } from '../home/action-list-items.styles';

const labelSuncoastInfo = <Text>SUNCOAST INFO</Text>;
const labelAvatar = <Text>AVATAR PHOTOS</Text>;
const labelIdentifyingInfo = <Text>IDENTIFYING INFO</Text>;
const labelAdd = <Text>ADD</Text>;
const labelAddresses = <Text>ADDRESSES</Text>;
const labelEmailAddresses = <Text>EMAIL ADDRESSES</Text>;

export class CallCenterHome extends Component {
  static navigationOptions = {
    title: ' ',
    header: navigation => ({
      left: (
        <Icon name="forum" color="#FFFFFF" containerStyle={{ marginLeft: 3 }} />
      ),
      title: (
        <Image source={require('../images/sovrinsecuredconnection.png')} />
      ),
      right: (
        <Button
          title="X"
          onPress={() => {
            saveRoute = async value => {
              try {
                await AsyncStorage.setItem('newCurrentRoute', value);
              } catch (error) {
                console.log('Error saving newCurrentRoute' + error);
              }
            };
            this.saveRoute('Home');
            navigation.navigate('Home');
          }}
          color="#FFFFFF"
        />
      ),
      style: {
        backgroundColor: '#2A5270',
      },
    }),
  };

  render() {
    return (
      <View style={listStyles.container}>
        <ScrollView>
          <LinearGradient colors={['#2A5270', '#132A3F']}>
            <View style={[styles.infoContainer]}>
              <Text style={[styles.white, styles.bold, styles.title]}>
                Suncoast
              </Text>
              <Text style={[styles.white, styles.infoTalking]}>
                Currently Talking With
              </Text>
              <Text style={[styles.white, styles.bold, styles.infoName]}>
                JOHN BEST
              </Text>
              <Text style={[styles.white, styles.infoCustomerService]}>
                CUSTOMER SERVICE SPECIALIST
              </Text>
            </View>
          </LinearGradient>
          <View style={[listStyles.container]}>
            <Divider left={labelSuncoastInfo} />
            <View style={[listStyles.container]}>
              <View
                style={[
                  styles.verticalSpace,
                  listStyles.horizontalSpace,
                  listStyles.listItemContainer,
                ]}
              >
                <Text style={[listStyles.textLabel, styles.label]}>
                  SUNCOAST MEMBER NUMBER
                </Text>
                <Text style={[listStyles.listItemValue]}>25269755</Text>
              </View>
              <View
                style={[
                  styles.verticalSpace,
                  listStyles.horizontalSpace,
                  listStyles.listItemContainer,
                ]}
              >
                <Text style={[listStyles.textLabel, styles.label]}>
                  MEMBER SINCE
                </Text>
                <Text style={listStyles.listItemValue}>2009</Text>
              </View>
              <View
                style={[
                  styles.verticalSpace,
                  listStyles.horizontalSpace,
                  listStyles.listItemContainer,
                ]}
              >
                <Text style={[listStyles.textLabel, styles.label]}>
                  PAYER SCORE
                </Text>
                <Text style={listStyles.listItemValue}>86</Text>
              </View>
            </View>

            <Divider left={labelAvatar} />
            <View style={listStyles.listItemContainer}>
              <View
                style={[
                  listStyles.avatarsContainer,
                  listStyles.horizontalSpace,
                ]}
              >
                <Avatar
                  containerStyle={listStyles.avatar}
                  medium
                  rounded
                  source={require('../invitation/inviter.jpeg')}
                />
                <Badge
                  counter={86}
                  name={'white'}
                  badgeStyle={listStyles.badge}
                />
              </View>
            </View>

            <Divider left={labelIdentifyingInfo} right={labelAdd} />
            <View
              style={[
                listStyles.container,
                listStyles.listItem,
                listStyles.horizontalSpace,
                listStyles.listItemContainer,
              ]}
            >
              <Badge counter={76} name={'grey'} />
              <View style={listStyles.listItemContainer}>
                <Text style={listStyles.textLabel}>NAME</Text>
                <Text style={listStyles.listItemValue}>Drummond Reed</Text>
              </View>
            </View>
            <View
              style={[
                listStyles.container,
                listStyles.listItem,
                listStyles.horizontalSpace,
                listStyles.listItemContainer,
              ]}
            >
              <Badge counter={38} name={'grey'} />
              <View style={listStyles.listItemContainer}>
                <Text style={listStyles.textLabel}>DATE OF BIRTH</Text>
                <Text style={listStyles.listItemValue}>11/14/1968</Text>
              </View>
            </View>
            <View
              style={[
                listStyles.container,
                listStyles.listItem,
                listStyles.horizontalSpace,
                listStyles.listItemContainer,
              ]}
            >
              <Badge counter={21} name={'grey'} />
              <View style={listStyles.listItemContainer}>
                <Text style={listStyles.textLabel}>SOCIAL SECURITY NUMBER</Text>
                <Text style={listStyles.listItemValue}>234-65-8765</Text>
              </View>
            </View>

            <Divider left={labelAddresses} right={labelAdd} />
            <View
              style={[
                listStyles.container,
                listStyles.listItem,
                listStyles.horizontalSpace,
                listStyles.listItemContainer,
              ]}
            >
              <Badge counter={21} name={'grey'} />
              <View style={listStyles.listItemContainer}>
                <Text style={listStyles.textLabel}>HOME ADDRESS</Text>
                <Text style={listStyles.listItemValue}>
                  11453 Lesterband Circle NW Steam Harbor, WA 98329
                </Text>
              </View>
            </View>

            <Divider left={labelEmailAddresses} right={labelAdd} />
            <View
              style={[
                listStyles.container,
                listStyles.listItem,
                listStyles.horizontalSpace,
                listStyles.listItemContainer,
              ]}
            >
              <Badge counter={21} name={'grey'} />
              <View style={listStyles.listItemContainer}>
                <Text style={listStyles.textLabel}>EMAIL ADDRESS 1</Text>
                <Text style={listStyles.listItemValue}>
                  drummond.reed@example.domain.com
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    );
  }
}

export default StackNavigator(
  {
    Connections: {
      screen: CallCenterHome,
    },
  },
  {}
);

const styles = StyleSheet.create({
  infoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  white: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  bold: {
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  infoName: {
    fontSize: 30,
    marginVertical: 5,
  },
  infoTalking: {
    fontSize: 16,
  },
  infoCustomerService: {
    fontSize: 13,
  },
  verticalSpace: {
    marginBottom: 3,
    paddingVertical: 5,
  },
  label: {
    marginBottom: 2,
  },
});
