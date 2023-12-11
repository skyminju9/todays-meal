import React, { useEffect } from "react";
import {Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios';

const typeOfFood = [
    {id:1, txt:'한식', isChecked:false},
    {id:2, txt:'양식', isChecked:false},
    {id:3, txt:'일식', isChecked:false},
    {id:4, txt:'중식', isChecked:false},
    {id:5, txt:'채식', isChecked:false},
];

const data = [
    {id:6, txt:'닭고기', isChecked:false},
    {id:7, txt:'돼지고기', isChecked:false},
    {id:8, txt:'쇠고기', isChecked:false},
    {id:9, txt:'애호박', isChecked:false},
    {id:10, txt:'양배추', isChecked:false},
    {id:11, txt:'가지', isChecked:false},
    {id:12, txt:'당근', isChecked:false},
    {id:13, txt:'오이', isChecked:false},
    {id:14, txt:'감자', isChecked:false},
    {id:15, txt:'고구마', isChecked:false},
    {id:16, txt:'두부', isChecked:false},
    {id:17, txt:'토마토', isChecked:false},
    {id:18, txt:'레몬', isChecked:false},
    {id:19, txt:'딸기', isChecked:false},
    {id:20, txt:'치즈', isChecked:false},

];

const getSessionUserName = async () => {

    try{
        const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getUserName');
        return response.data.userName;
    }catch(error){
        console.error('Error fetching user name:',error);
        return null;
    }
};


function Analyse(){

    const userIcon = <Icon name="user-circle" size={40} />;
    const navigation = useNavigation();
    const [selectedItems, setSelectedItems] = useState([]);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const userNameFromSession = await getSessionUserName();
                if (userNameFromSession) {
                    setUserName(userNameFromSession);
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
    
        fetchUserName();
    }, []);
    
    
    const handleCheckboxChange = (id) => {
        const updatedItems = selectedItems.includes(id)
            ? selectedItems.filter((item)=>item!==id)
            : [...selectedItems, id];
        setSelectedItems(updatedItems);
    };

    const handleSubmit = () => {
        console.log("Selected Items:", selectedItems);
    }
    
    return(
        
        <View style={styles.container}>
            <ScrollView>
                <Pressable style = {styles.usericonContainer} onPress={()=>navigation.navigate('Settings')}>
                    {userIcon}
                </Pressable>
                <View style = {styles.titleContainer}>
                    <Text style = {styles.title}>
                        레시피 추천을 위해
                    </Text>
                    <Text style = {styles.title}>
                        {userName}님의 취향을
                    </Text>
                    <Text style = {styles.title}>
                        파악하는 중입니다...
                    </Text>
                </View>
                
                <View style={styles.checkboxesContainer}>
                    <Text style={styles.text}>STEP 1. 선호 음식 종류 </Text>
                    {typeOfFood.map((item) => (
                        <View key={item.id} style={styles.checkboxContainer}>
                            <CheckBox
                                title={item.txt}
                                checked={selectedItems.includes(item.id)}
                                onPress={() => handleCheckboxChange(item.id)}
                                containerStyle={styles.checkboxContainerStyle}
                            />
                        </View>
                    ))}
                    
                    <Text style={styles.text}>STEP 2. 선호 식재료 </Text>
                    {data.map((item) => (
                        <View key={item.id} style={styles.checkboxContainer}>
                            <CheckBox
                                title={item.txt}
                                checked={selectedItems.includes(item.id)}
                                onPress={() => handleCheckboxChange(item.id)}
                                containerStyle={styles.checkboxContainerStyle}
                            />
                        </View>
                    ))}
                    
                </View>
                
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={()=>{
                        handleSubmit();
                        navigation.navigate('Recipe');
                    }}>
                        <Text style={styles.buttonText}>제출하기</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex:1 ,
        flexDirection:'column',
        //alignItems: 'flex-start',
        margin:0,
        backgroundColor: '#ffffff',
    },
    text:{

        color:'black',
        fontWeight:'bold',
        right:50,
        padding:20,

    },
    usericonContainer:{
        marginLeft:340,
        marginTop:15,
    },
    titleContainer:{

        //position:'absolute',
        //top:80,
        marginVertical:20,
        alignSelf:'center',

    },
    title:{
        alignSelf:'center',
        color:'black',
        fontSize:23,
        fontWeight:'bold',

    },
    checkboxesContainer:{

        //marginTop:10,
        //marginBottom:10,
        marginVertical:20,
        alignItems:'center',
        //paddingBottom:20,
        paddingHorizontal:20,
        paddingBottom:100,
    },
    checkboxContainer: {
        //marginTop:10,
        //marginBottom:10,
        marginVertical:10,
        
    },
    checkboxContainerStyle: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
        
    },
    buttonContainer:{
        position:'absolute',
        bottom:20,
        alignSelf:'center',
        width:270,
        alignItems:'flex-end',
        
    },
    button:{

        alignSelf:'center',
        paddingVertical:15,
        paddingHorizontal:100,
        borderRadius:10,
        backgroundColor:'#EDF6FF',
    },
    buttonText:{

        fontSize:17,
        lineHeight:21,
        fontWeight:'bold',
        letterSpacing:1,
        color:'black',

    },
})

export default Analyse;