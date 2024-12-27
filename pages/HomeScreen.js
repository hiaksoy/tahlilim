import { REFS } from '../shared/consts';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../configs/firebase_config';

export default function HomeScreen({ navigation }) {
    const [showDegerler, setShowDegerler] = useState(true);
    const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);
    const user = auth.currentUser;

    const updateDeger = (index, key, value) => {
        const updatedDegerler = [...degerler];
        updatedDegerler[index][key] = value;
        setDegerler(updatedDegerler);
    };

    const removeDeger = (index) => {
        const updatedDegerler = degerler.filter((_, i) => i !== index);
        setDegerler(updatedDegerler);
    };

    const addDeger = () => {
        setDegerler([...degerler, { ad: REFS[0], sonuc: '' }]);
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar backgroundColor="#f9fafc" barStyle="dark-content" />
            <ScrollView style={styles.container}>


                {!user && (
                    <Button
                        title="Login Sayfasına Git"
                        onPress={() => navigation.navigate('Login')}
                    />
                )}

                {user && (
                    <Button
                        title="Geri Git"
                        onPress={() => navigation.goBack()}
                    />
                )}



                <TouchableOpacity onPress={() => setShowDegerler(!showDegerler)}>
                    <Text style={styles.sectionTitle}>Hızlı Arama</Text>
                </TouchableOpacity>
                {showDegerler && (
                    <View style={styles.section}>
                        {degerler.map((deger, index) => (
                            <View key={index} style={styles.dynamicRow}>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={deger.ad}
                                        onValueChange={(value) => updateDeger(index, 'ad', value)}
                                    >
                                        {REFS.map((ref, i) => (
                                            <Picker.Item key={i} label={ref} value={ref} />
                                        ))}
                                    </Picker>
                                </View>
                                <TextInput
                                    style={styles.dynamicInput}
                                    placeholder="Sonuç"
                                    value={deger.sonuc}
                                    onChangeText={(value) => updateDeger(index, 'sonuc', value)}
                                />
                                {/* Silme butonu */}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => removeDeger(index)}
                                >
                                    <Text style={styles.deleteButtonText}>-</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <Button title="Değer Ekle" onPress={addDeger} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafc',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Android için status bar yüksekliği
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9fafc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: '#4CAF50',
        backgroundColor: '#e0f7fa',
        padding: 8,
        borderRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    datePicker: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    dynamicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerContainer: {
        flex: 1,
        marginRight: 10,
    },
    dynamicInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
