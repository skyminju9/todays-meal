import React, {useEffect} from "react";
import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { FadeInLeft } from "react-native-reanimated";

function Bookmark(){
    return(
        <Text>
            bookmark page
        </Text>
    );
}

export default Bookmark;