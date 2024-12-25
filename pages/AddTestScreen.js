import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addTahlil } from '../services/aTahlillerService';
import { REFS } from '../shared/consts';
import { useNavigation } from '@react-navigation/native';

const AddTestScreen = ({ route }) => {
    const { userId } = route.params;

    const navigation = useNavigation();
    // Tahlil Bilgileri State'leri
    const [raporNo, setRaporNo] = useState('');
    const [tani, setTani] = useState('');
    const [numuneTuru, setNumuneTuru] = useState('');
    const [raporGrubu, setRaporGrubu] = useState('');

    const [tetkikIstemZamani, setTetkikIstemZamani] = useState(new Date());
    const [numuneAlmaZamani, setNumuneAlmaZamani] = useState(new Date());
    const [numuneKabulZamani, setNumuneKabulZamani] = useState(new Date());
    const [uzmanOnayZamani, setUzmanOnayZamani] = useState(new Date());

    const [showTetkikDatePicker, setShowTetkikDatePicker] = useState(false);
    const [showTetkikTimePicker, setShowTetkikTimePicker] = useState(false);

    const [showNumuneAlmaDatePicker, setShowNumuneAlmaDatePicker] = useState(false);
    const [showNumuneAlmaTimePicker, setShowNumuneAlmaTimePicker] = useState(false);

    const [showNumuneKabulDatePicker, setShowNumuneKabulDatePicker] = useState(false);
    const [showNumuneKabulTimePicker, setShowNumuneKabulTimePicker] = useState(false);

    const [showUzmanOnayDatePicker, setShowUzmanOnayDatePicker] = useState(false);
    const [showUzmanOnayTimePicker, setShowUzmanOnayTimePicker] = useState(false);

    // Dinamik Değerler
    const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);

    // Bölüm Açılır/Kapanır Durumları
    const [showTahlilBilgileri, setShowTahlilBilgileri] = useState(false);
    const [showTarihSaatBilgileri, setShowTarihSaatBilgileri] = useState(false);
    const [showDegerler, setShowDegerler] = useState(true);

    const removeDeger = (index) => {
        const updatedDegerler = degerler.filter((_, i) => i !== index);
        setDegerler(updatedDegerler);
    };


    const addDeger = () => {
        setDegerler([...degerler, { ad: REFS[0], sonuc: '' }]);
    };

    const updateDeger = (index, key, value) => {
        const updatedDegerler = [...degerler];
        updatedDegerler[index][key] = value;
        setDegerler(updatedDegerler);
    };

    const handleSubmit = async () => {
        try {
            await addTahlil(
                userId,
                raporNo,
                tani,
                numuneTuru,
                raporGrubu,
                tetkikIstemZamani,
                numuneAlmaZamani,
                numuneKabulZamani,
                uzmanOnayZamani,
                degerler
            );
            console.log('Tahlil başarıyla eklendi');
            Alert.alert('Başarılı', 'Tahlil eklendi!');
            navigation.goBack();
        } catch (error) {
            console.error('Hata:', error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Tahlil Ekle</Text>

            {/* Tahlil Bilgileri */}
            <TouchableOpacity onPress={() => setShowTahlilBilgileri(!showTahlilBilgileri)}>
                <Text style={styles.sectionTitle}>Tahlil Bilgileri</Text>
            </TouchableOpacity>
            {showTahlilBilgileri && (
                <View style={styles.section}>
                    <TextInput style={styles.input} placeholder="Rapor Numarası" value={raporNo} onChangeText={setRaporNo} />
                    <TextInput style={styles.input} placeholder="Tanı" value={tani} onChangeText={setTani} />
                    <TextInput style={styles.input} placeholder="Numune Türü" value={numuneTuru} onChangeText={setNumuneTuru} />
                    <TextInput style={styles.input} placeholder="Rapor Grubu" value={raporGrubu} onChangeText={setRaporGrubu} />
                </View>
            )}

            {/* Tarih ve Saat Bilgileri */}
            <TouchableOpacity onPress={() => setShowTarihSaatBilgileri(!showTarihSaatBilgileri)}>
                <Text style={styles.sectionTitle}>Tarih ve Saat Bilgileri</Text>
            </TouchableOpacity>
            {showTarihSaatBilgileri && (
                <View style={styles.section}>
                    {/* Tetkik İstem Zamanı */}
                    <TouchableOpacity onPress={() => setShowTetkikDatePicker(true)} style={styles.datePicker}>
                        <Text>Tetkik İstem Tarihi: {tetkikIstemZamani.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showTetkikDatePicker && (
                        <DateTimePicker
                            value={tetkikIstemZamani}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowTetkikDatePicker(false);
                                if (date) setTetkikIstemZamani(date);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowTetkikTimePicker(true)} style={styles.datePicker}>
                        <Text>Tetkik İstem Saati: {tetkikIstemZamani.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showTetkikTimePicker && (
                        <DateTimePicker
                            value={tetkikIstemZamani}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setShowTetkikTimePicker(false);
                                if (date) setTetkikIstemZamani(date);
                            }}
                        />
                    )}

                    {/* Numune Alma Zamanı */}
                    <TouchableOpacity onPress={() => setShowNumuneAlmaDatePicker(true)} style={styles.datePicker}>
                        <Text>Numune Alma Tarihi: {numuneAlmaZamani.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showNumuneAlmaDatePicker && (
                        <DateTimePicker
                            value={numuneAlmaZamani}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowNumuneAlmaDatePicker(false);
                                if (date) setNumuneAlmaZamani(date);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowNumuneAlmaTimePicker(true)} style={styles.datePicker}>
                        <Text>Numune Alma Saati: {numuneAlmaZamani.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showNumuneAlmaTimePicker && (
                        <DateTimePicker
                            value={numuneAlmaZamani}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setShowNumuneAlmaTimePicker(false);
                                if (date) setNumuneAlmaZamani(date);
                            }}
                        />
                    )}

                    {/* Numune Kabul Zamanı */}
                    <TouchableOpacity onPress={() => setShowNumuneKabulDatePicker(true)} style={styles.datePicker}>
                        <Text>Numune Kabul Tarihi: {numuneKabulZamani.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showNumuneKabulDatePicker && (
                        <DateTimePicker
                            value={numuneKabulZamani}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowNumuneKabulDatePicker(false);
                                if (date) setNumuneKabulZamani(date);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowNumuneKabulTimePicker(true)} style={styles.datePicker}>
                        <Text>Numune Kabul Saati: {numuneKabulZamani.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showNumuneKabulTimePicker && (
                        <DateTimePicker
                            value={numuneKabulZamani}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setShowNumuneKabulTimePicker(false);
                                if (date) setNumuneKabulZamani(date);
                            }}
                        />
                    )}

                    {/* Uzman Onay Zamanı */}
                    <TouchableOpacity onPress={() => setShowUzmanOnayDatePicker(true)} style={styles.datePicker}>
                        <Text>Uzman Onay Tarihi: {uzmanOnayZamani.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showUzmanOnayDatePicker && (
                        <DateTimePicker
                            value={uzmanOnayZamani}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowUzmanOnayDatePicker(false);
                                if (date) setUzmanOnayZamani(date);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowUzmanOnayTimePicker(true)} style={styles.datePicker}>
                        <Text>Uzman Onay Saati: {uzmanOnayZamani.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showUzmanOnayTimePicker && (
                        <DateTimePicker
                            value={uzmanOnayZamani}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setShowUzmanOnayTimePicker(false);
                                if (date) setUzmanOnayZamani(date);
                            }}
                        />
                    )}
                </View>
            )}

            {/* Dinamik Değerler */}
            <TouchableOpacity onPress={() => setShowDegerler(!showDegerler)}>
                <Text style={styles.sectionTitle}>Değerler</Text>
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




            {/* Kaydet Butonu */}
            <Button title="Tahlil Ekle" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
        color: '#4CAF50',  // Belirgin hale getirmek için yeşil renk
        backgroundColor: '#e0f7fa',  // Başlık arka planı
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

export default AddTestScreen;
