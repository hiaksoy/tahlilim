import React from 'react';
import { View, Text, Button } from 'react-native';

const EmptyPages = () => {


    return (
        <View >
            <Text>Open up App.js to start working on your app!</Text>
            <Button
                title="Login Sayfasına Git"
                onPress={() => navigation.navigate('Login')}
            />
            <Button
                title="Register Sayfasına Git"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );


}
export default EmptyPages;


