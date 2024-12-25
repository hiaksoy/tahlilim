import { db } from '../configs/firebase_config';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TestsScreen = () => {
    const navigation = useNavigation();
    const [tests, setTests] = useState([]);
    const [expandedTest, setExpandedTest] = useState(null);


    const fetchTests = async () => {
        try {
            const data = await getAllTests();
            setTests(data);
        } catch (error) {
            Alert.alert('Hata', error.message || 'Testler alınamadı.');
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleToggleExpand = (testId) => {
        setExpandedTest(expandedTest === testId ? null : testId);
    };

    const handleAddTest = () => {
        navigation.navigate('AddTest');
    };
    

    const handleEditTest = (testId) => {
        navigation.navigate('EditTest', { testId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Testler</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handleAddTest(item.id)}
            >
                <Text style={styles.buttonText}>Testi Görüntüle</Text>
            </TouchableOpacity>


            <FlatList
                data={tests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.testItem}>
                        <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
                            <Text style={styles.testName}>{item.name}</Text>
                        </TouchableOpacity>

                        {expandedTest === item.id && (
                            <View style={styles.testDetails}>
                                <Text style={styles.testDetailText}>Soru Sayısı: {item.questionCount}</Text>
                                <Text style={styles.testDetailText}>Süre: {item.duration} dakika</Text>
                                <Text style={styles.testDetailText}>Zorluk: {item.difficulty}</Text>

                                <View style={styles.actionButtons}>


                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => handleEditTest(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Tahlili Düzenle</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => handleDeleteTest(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Tahlili Sil</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    testItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    testName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    testDetails: {
        marginTop: 10,
    },
    testDetailText: {
        fontSize: 16,
        color: '#555',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
    },
});

export default TestsScreen;