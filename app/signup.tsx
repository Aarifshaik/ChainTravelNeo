import React, { useState } from 'react';
import {  YStack } from 'tamagui';
import { SignUpScreen } from '../components/Authenticate';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from './_layout';
import { useEffect } from 'react';
// import Auth from '~/components/Auth';
import {  AppState } from 'react-native'
import { supabase } from '~/utils/supabase'
import { BananasDialog } from '~/components/BananaAlert';
import { Session } from '@supabase/supabase-js';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name , setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertDes, setAlertDes] = useState('');
  const [Heading,setHeading] = useState('Signup Failed...!');
  const [dialogVisible, setDialogVisible] = useState(false);
  const { currentTheme,toggleTheme } = useContext(ThemeContext);
  const [coolor, setColor] = useState('#1b1f24');
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleHideDialog = () => setDialogVisible(false);

  return (
    <>
    <YStack flex={1} ai="center" jc="center" bg="$background" padding="$6">
      
      <YStack
        position="absolute"
        top={10}
        right={10}
        zIndex={1} // Ensure it stays on top
      >
        <TouchableOpacity onPress={toggleTheme}>
        <Ionicons name="sunny-outline" size={30} color= {coolor} />
        </TouchableOpacity>
      </YStack>
      {/* <SignInScreen /> */}
      <SignUpScreen 
          // email={email} 
          // setEmail={setEmail} 
          // password={password} 
          // setPassword={setPassword} 
          // signUp={signUpWithEmail} 
          // name={name}
          // setName={setName}
          // loading={loading}
        />
        <BananasDialog
          visible={dialogVisible}
          onCancel={handleHideDialog}
          // onConfirm={handleConfirm}
          heading={Heading}
          message={alertDes}
        />
      {/* <Auth/> */}
    </YStack>
    </>
  );
}
