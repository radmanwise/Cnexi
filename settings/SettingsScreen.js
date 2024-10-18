import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { I18nContext, useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';


export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHead: [],
            tableData: [
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <Feather name="sun" size={25} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Theme')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <MaterialIcons name="block-flipped" size={25} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Block')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('Account')}>
                        <MaterialCommunityIcons name="account-circle-outline" size={25} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Account')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('LanguageSwitcher')}>
                        <Ionicons name="language-sharp" size={25} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Language')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <Feather name="star" size={25} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Favorites')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <Feather name="pie-chart" size={24} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Account status and controls')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <AntDesign name="exclamationcircleo" size={24} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('About')}</Text>
                    </TouchableOpacity>
                ],
                [
                    <TouchableOpacity style={{ padding: 15, flexDirection: 'row' }}>
                        <MaterialIcons name="bug-report" size={24} color="black" />
                        <Text style={{ marginLeft: 10, fontSize: 16 }}>{i18n.t('Report bug')}</Text>
                    </TouchableOpacity>
                ],
            ]
        }
    }

    render() {
        const state = this.state;

        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#ffff' }}>
                    <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
                    <Rows data={state.tableData} textStyle={styles.text} />
                </Table>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 1, paddingTop: 20, backgroundColor: '#fff' },
    head: { backgroundColor: '#ffff' },
    text: { margin: 6 }
});