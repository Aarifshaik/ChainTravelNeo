import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Separator,
  Text,
  SizableText,
  Spinner,
  Theme,
  View,
} from 'tamagui'
import { Input } from './inputsParts'

import GitHubButton from './Buttons/github';
import GoogleButton from './Buttons/google';

import { BananasDialog } from './BananaAlert'
import { useTheme } from 'tamagui';
import {
  signUpWithMail,
  signInWithMail,
  SendOtp,
  VerifyOtp,
  GoogleSignIn
} from '../utils/auth';
import OtpInput from './otp'
import { Sheet } from '@tamagui/sheet';
import { useRouter } from 'expo-router';
import { FormCard } from './layoutParts'
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';


// const theme = useTheme();

export function SignInScreen(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpSuc, setOtpSuc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  // const [coolor, setColor] = useState('#1b1f24');


  const [alertDescription, setAlertDescription] = useState('');
  const [Heading,setHeading] = useState('Signup Failed...!');
  const [dialogVisible, setDialogVisible] = useState(false);
  const { currentTheme } = useContext(ThemeContext);
  const router = useRouter();
  
  // const { currentTheme,toggleTheme } = useContext(ThemeContext);

  const handleHideDialog = () => setDialogVisible(false);

  // const MailLogin = async () => {
  //   setLoading(true);
  //   const res=await signInWithMail(email, password);

  //   setLoading(false);
  //   // setTimeout(() => {
  //   //     setLoading(false);
  //   // }, 1000);
  //   // setOtpRequested(false);
  //   // setPhone('');
  //   // setOtp('');
  //   // setOtpSuc(false);
  //   // console.log("Otp Requested",otpRequested);
  //   // console.log("Phone",phone);
  //   // console.log("Otp",otp);
  //   // console.log("Otp Success",otpSuc);
  //   // setLoading(false);
  // }

  const handleLoginWithMail = async () => {
    setLoading(true);
    const response = await signInWithMail(email, password);
    if (response.status === 'error') {
      setHeading('Login Failed');
      setAlertDescription(response.message);
      setDialogVisible(true);
    } else if (response.status === 'success') {
      setHeading('Login Successful');
      setAlertDescription("Welcome "+response.data);
      setDialogVisible(true);
      console.log(response.data);
      // Additional logic, e.g., redirecting the user or updating the app state, can go here.
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const response = await GoogleSignIn();
    // console.log('response session',response.data?.session);
    // console.log('');
    // console.log('response',response.data?.session?.user);
    // console.log('');
    // console.log('response',response.data?.user.user_metadata.name);

    if (response.status === 'error') {
      setHeading('Google Sign-In Failed');
      setAlertDescription(response.message);
      setDialogVisible(true);
    } else if (response.status === 'success') {
      setHeading('Google Sign-In Successful');
      setAlertDescription("Welcome " +response.data?.user.user_metadata.name);
      setDialogVisible(true);
      // Additional logic, e.g., redirecting the user or updating the app state, can go here.
    }
    setLoading(false);
  };

  // const PhoneLogin = async () => {
  //   setLoading(true);
  //   const res=await SendOtp(phone);
  //   console.log('res... :   ',res);
  //   setOtpRequested(true);
  //   setLoading(false);
  // }

  const handleSendOtp = async () => {
    setLoading(true);
    const response = await SendOtp(phone);
    console.log("Data Received",response.data);
    if (response.status === 'error') {
      setHeading('OTP Sending Failed');
      setAlertDescription(response.message);
      setDialogVisible(true);
    } else if (response.status === 'success') {
      setHeading('OTP Sent Successfully');
      setAlertDescription(response.message);
      setDialogVisible(true);
      setOtpRequested(true);
      // Additional logic, e.g., redirecting to OTP verification, can go here.
    }
    setLoading(false);
  };


  interface OtpCompleteHandler {
    (otp: string): void;
  }

  const handleOtpComplete: OtpCompleteHandler = async (otps) => {
    setLoading(true);
    setOtp(otps);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await VerifyOtp(phone,otp)
    console.log("Data Received in Otp",response.data);
    if(response.status==='error'){
      setHeading('OTP Verification Failed');
      setAlertDescription(response.message);
      setDialogVisible(true);
    } else if (response.status === 'success') {
      setHeading('OTP Verified Successfully');
      setAlertDescription(response.message);
      setDialogVisible(true);
      setOtpSuc(true);
      // Additional logic, e.g., redirecting to OTP verification, can go here.
    }
    setLoading(false)
  };

  const setOpenModal = () => {
    setOpen(true);
    console.log('open', open);
  }



  // useEffect(() => {
  //   if(currentTheme === 'light'){
  //     setColor('#1b1f24');
  //   }else{
  //     setColor('#fff');
  //   }
  // }, [currentTheme]);
  
  return(
    <>
    <BananasDialog
        visible={dialogVisible}
        onCancel={handleHideDialog}
        heading={Heading}
        message={alertDescription}
      />
    <FormCard>
      <View
        flexDirection="column"
        alignItems="stretch"
        minWidth="100%"
        maxWidth="100%"
        gap="$4"
        padding="$4"
        paddingVertical="$6"
        $gtSm={{
          paddingVertical: '$4',
          width: 400,
        }}
      >
        <H1
          alignSelf="center"
          size="$8"
          $xs={{
            size: '$8',
          }}
        >
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="$3">
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <Input.Label htmlFor="email">Email</Input.Label>
              <Input.Box>
                <Input.Area id="email" value={email} onChangeText={setEmail} placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input.Label htmlFor="password">Password</Input.Label>
                <ForgotPasswordLink press={() => router.push("/forgot")}/>
              </View>
              <Input.Box>
                <Input.Area
                  textContentType="password"
                  secureTextEntry
                  id="password"
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="Enter password"
                />
              </Input.Box>
            </Input>
          </View>
        </View>
        <Theme inverse>
          <Button
            disabled={loading}
            onPress={handleLoginWithMail}
            width="100%"
            iconAfter={
              <AnimatePresence>
                {loading && (
                  <Spinner
                    color="$green10"
                    key="loading-spinner"
                    opacity={0.5}
                    scale={2}
                    animation="quick"
                    position="absolute"
                    // left="70%"
                    enterStyle={{
                      opacity: 0,
                      // y: 30,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      // y: 30,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            {!loading && (
            <Button.Text>Sign In</Button.Text>
            )}
          </Button>
        </Theme>
        <View flexDirection="column" gap="$3" width="100%" alignItems="center">
          <Theme>
            <View
              flexDirection="column"
              gap="$3"
              width="100%"
              alignSelf="center"
              alignItems="center"
            >
              <View flexDirection="row" width="100%" alignItems="center" gap="$4">
                <Separator />
                <Paragraph>Or</Paragraph>
                <Separator />
              </View>
              <View flexDirection="row" flexWrap="wrap" gap="$3">
                <GitHubButton />
                <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
                {/* <Button icon={<Image 
                    source={require('../assets/googlenew.png')}
                    style={{ width: 38, height: 38 }} 
                  />} 
                  onPress = {handleGoogleSignIn}
                  flex={1}>
                  <Button.Text> Continue with Google</Button.Text>
                </Button> */}
              </View>
            </View>
          </Theme>
        </View>
        <SignUpLink press={()=> router.push("/signup")}/>
        <PhoneLink press={setOpenModal}/>
      </View>
    </FormCard>
    
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true} // Default type: Modal
      open={open}
      onOpenChange={setOpen}
      snapPoints={[50]} // Default snap point: 100
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="bouncy"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5">
        


      
      <View
        flexDirection="column"
        alignItems="stretch"
        minWidth="100%"
        maxWidth="100%"
        gap="$4"
        padding="$4"
        paddingVertical="$6"
        $gtSm={{
          paddingVertical: '$4',
          width: 400,
        }}
      >
        <H1
          alignSelf="center"
          size="$8"
          $xs={{
            size: '$8',
          }}
        >
          Sign in with Phone
        </H1>


      {otpSuc ? (
        <View flexDirection="column" alignItems="center" gap="$3">
          <H1 alignSelf="center" size="$4">
            OTP Verified
            </H1>
        </View>

      ) : (
        loading && otpRequested ? (
          <View
            flexDirection="column"
            alignItems="stretch"
            minWidth="100%"
            maxWidth="100%"
            gap="$4"
            padding="$4"
            paddingVertical="$6"
            $gtSm={{
              paddingVertical: '$4',
              width: 400,
            }}
          >
            <H1 alignSelf="center" size="$8" $xs={{ size: '$5' }}>
              Verifying.....
            </H1>
          </View>
        ) : !otpRequested ? (
          <>
            <View flexDirection="column" gap="$3">
              <View flexDirection="column" gap="$1">
                <Input size="$4">
                  <Input.Label htmlFor="phone">Phone</Input.Label>
                  <Input.Box>
                    <Input.Area
                      id="phone"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+91 7416340801"
                    />
                  </Input.Box>
                </Input>
              </View>
            </View>

            <Theme inverse>
              <Button
                disabled={loading}
                onPress={handleSendOtp}
                width="100%"
                iconAfter={
                  <AnimatePresence>
                    {loading && (
                      <Spinner
                        color="$green10"
                        key="loading-spinner"
                        opacity={0.5}
                        scale={2}
                        animation="quick"
                        position="absolute"
                        enterStyle={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        exitStyle={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                      />
                    )}
                  </AnimatePresence>
                }
              >
                {!loading && <Button.Text>Get OTP</Button.Text>}
              </Button>
            </Theme>
          </>
        ) : (
          // Render Success Message
          <View flexDirection="column" alignItems="center" gap="$3">
            <H1 alignSelf="center" size="$4">
              Enter the code sent to your phone
            </H1>
            <OtpInput sections={4} sectionLength={1} onOtpComplete={handleOtpComplete} />
            <NotNum phone={phone} press={() => { setPhone(''); setOtpRequested(false); }} />
          </View>
        )
      )}

      </View>




      </Sheet.Frame>
    </Sheet>
    </>
  )
}





export function SignUpScreen() {
  const [coolor, setColor] = useState('#1b1f24');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertDescription, setAlertDescription] = useState('');
  const [Heading,setHeading] = useState('Signup Failed...!');
  const [dialogVisible, setDialogVisible] = useState(false);


  const handleHideDialog = () => setDialogVisible(false);

  const handleSingupWithMail = async () => {
    setLoading(true);
    const response = await signUpWithMail(email, password,name);
    console.log(response)
    if (response.status === 'error') {
      setHeading('SignUp Failed');
      setAlertDescription(response.message);
      setDialogVisible(true);
    } else if (response.status === 'success') {
      setHeading('SignUp Successful.... Please Login');
      setAlertDescription("Welcome "+response.message);
      setDialogVisible(true);
      console.log(response);
      // Additional logic, e.g., redirecting the user or updating the app state, can go here.
    }
    setLoading(false);
  };

  // const { currentTheme } = useContext(ThemeContext);
  // useEffect(() => {
  //   if(currentTheme === 'light'){
  //     setColor('#1b1f24');
  //   }else{
  //     setColor('#fff');
  //   }
  // }, [currentTheme]);

  return (
    <>
    <BananasDialog
        visible={dialogVisible}
        onCancel={handleHideDialog}
        heading={Heading}
        message={alertDescription}
      />
    <FormCard>
      <View
        flexDirection="column"
        alignItems="stretch"
        minWidth="100%"
        maxWidth="100%"
        gap="$4"
        padding="$4"
        paddingVertical="$6"
        $gtSm={{
          paddingVertical: '$4',
          width: 400,
        }}
      >
        <H1
          alignSelf="center"
          size="$8"
          $xs={{
            size: '$7',
          }}
        >
          Sign up to your account
        </H1>
        <View flexDirection="column" gap="$3">
        <View flexDirection="column" gap="$1">
            <Input size="$4">
              <Input.Label htmlFor="input-name">Name</Input.Label>
              <Input.Box>
                <Input.Area id="input-name" value={name} onChangeText={setName} placeholder="Aa" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <Input.Label htmlFor="input-email">Email</Input.Label>
              <Input.Box>
                <Input.Area id="input-email" value={email} onChangeText={setEmail} placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input.Label htmlFor="input-password">Password</Input.Label>
                <ForgotPasswordLink press={() => router.push("/forgot")}/>
              </View>
              <Input.Box>
                <Input.Area
                  textContentType="password"
                  secureTextEntry
                  id="input-password"
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="Enter password"
                />
              </Input.Box>
            </Input>
          </View>
        </View>
        <Theme inverse>
          <Button
            disabled={loading}
            onPress={handleSingupWithMail}
            width="100%"
            iconAfter={
              <AnimatePresence>
                {loading && (
                  <Spinner
                    color="$green10"
                    key="loading-spinner"
                    opacity={0.5}
                    scale={2}
                    animation="quick"
                    position="absolute"
                    // left="70%"
                    enterStyle={{
                      opacity: 0,
                      // y: 30,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      // y: 30,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            {!loading && (
            <Button.Text>Sign Up</Button.Text>
            )}
          </Button>
        </Theme>
        <View flexDirection="column" gap="$3" width="100%" alignItems="center">
          <Theme>
            <View
              flexDirection="column"
              gap="$3"
              width="100%"
              alignSelf="center"
              alignItems="center"
            >
              <View flexDirection="row" width="100%" alignItems="center" gap="$4">
                <Separator />
                <Paragraph>Or</Paragraph>
                <Separator />
              </View>
              <View flexDirection="row" flexWrap="wrap" gap="$3">
                <Button icon={<Ionicons name="logo-github" size={30} color = {coolor} />} flex={1} minWidth="100%" >
                  <Button.Text>Continue with Github</Button.Text>
                </Button>
                <Button icon={<Image 
                    source={require('../assets/googlenew.png')}
                    style={{ width: 38, height: 38 }} 
                  />} flex={1}>
                  <Button.Text> Continue with Google</Button.Text>
                </Button>
              </View>
            </View>
          </Theme>
        </View>
        <SignInLink press={()=> router.back()}/>
      </View>
    </FormCard>
    </>
  )
}

// export function SignInScreen({ email, setEmail, password, setPassword,signIn,signInWithNumber,otpSuc,
//   otpRequested,setOtpRequested,phone,setPhone,otp,setOtp,verifyOtp, handleGoogleSignIn,loading }: SignInScreenProps) {
//   const [coolor, setColor] = useState('#1b1f24');
//   const [position, setPosition] = useState(0);
//   const [open, setOpen] = useState(false);
  
//   const setOpenModal = () => {
//     setOpen(true);
//     console.log('open', open);
//   }

//   interface OtpCompleteHandler {
//     (otp: string): void;
//   }

//   const handleOtpComplete: OtpCompleteHandler = (otps) => {
//     console.log('OTP Entered', otps);
//     setOtp(otps);
//     console.log('otp',otp);
//     verifyOtp();
//   };



//   const { currentTheme } = useContext(ThemeContext);
//   useEffect(() => {
//     if(currentTheme === 'light'){
//       setColor('#1b1f24');
//     }else{
//       setColor('#fff');
//     }
//   }, [currentTheme]);

//   return (
//     <>
//     <FormCard>
//       <View
//         flexDirection="column"
//         alignItems="stretch"
//         minWidth="100%"
//         maxWidth="100%"
//         gap="$4"
//         padding="$4"
//         paddingVertical="$6"
//         $gtSm={{
//           paddingVertical: '$4',
//           width: 400,
//         }}
//       >
//         <H1
//           alignSelf="center"
//           size="$8"
//           $xs={{
//             size: '$8',
//           }}
//         >
//           Sign in to your account
//         </H1>
//         <View flexDirection="column" gap="$3">
//           <View flexDirection="column" gap="$1">
//             <Input size="$4">
//               <Input.Label htmlFor="email">Email</Input.Label>
//               <Input.Box>
//                 <Input.Area id="email" value={email} onChangeText={setEmail} placeholder="email@example.com" />
//               </Input.Box>
//             </Input>
//           </View>
//           <View flexDirection="column" gap="$1">
//             <Input size="$4">
//               <View
//                 flexDirection="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Input.Label htmlFor="password">Password</Input.Label>
//                 <ForgotPasswordLink />
//               </View>
//               <Input.Box>
//                 <Input.Area
//                   textContentType="password"
//                   secureTextEntry
//                   id="password"
//                   value={password} 
//                   onChangeText={setPassword}
//                   placeholder="Enter password"
//                 />
//               </Input.Box>
//             </Input>
//           </View>
//         </View>
//         <Theme inverse>
//           <Button
//             disabled={loading}
//             onPress={signIn}
//             width="100%"
//             iconAfter={
//               <AnimatePresence>
//                 {loading && (
//                   <Spinner
//                     color="$green10"
//                     key="loading-spinner"
//                     opacity={0.5}
//                     scale={2}
//                     animation="quick"
//                     position="absolute"
//                     // left="70%"
//                     enterStyle={{
//                       opacity: 0,
//                       // y: 30,
//                       scale: 0.5,
//                     }}
//                     exitStyle={{
//                       opacity: 0,
//                       // y: 30,
//                       scale: 0.5,
//                     }}
//                   />
//                 )}
//               </AnimatePresence>
//             }
//           >
//             {!loading && (
//             <Button.Text>Sign In</Button.Text>
//             )}
//           </Button>
//         </Theme>
//         <View flexDirection="column" gap="$3" width="100%" alignItems="center">
//           <Theme>
//             <View
//               flexDirection="column"
//               gap="$3"
//               width="100%"
//               alignSelf="center"
//               alignItems="center"
//             >
//               <View flexDirection="row" width="100%" alignItems="center" gap="$4">
//                 <Separator />
//                 <Paragraph>Or</Paragraph>
//                 <Separator />
//               </View>
//               <View flexDirection="row" flexWrap="wrap" gap="$3">
//                 <Button icon={<Ionicons name="logo-github" size={30} color = {coolor} />} flex={1} minWidth="100%" >
//                   <Button.Text>Continue with Github</Button.Text>
//                 </Button>
//                 <Button icon={<Image 
//                     source={require('../assets/googlenew.png')}
//                     style={{ width: 38, height: 38 }} 
//                   />} 
//                   onPress = {handleGoogleSignIn}
//                   flex={1}>
//                   <Button.Text> Continue with Google</Button.Text>
//                 </Button>
//               </View>
//             </View>
//           </Theme>
//         </View>
//         <SignUpLink />
//         <PhoneLink press={setOpenModal}/>
//       </View>
//     </FormCard>
//     <Sheet
//       forceRemoveScrollEnabled={open}
//       modal={true} // Default type: Modal
//       open={open}
//       onOpenChange={setOpen}
//       snapPoints={[50]} // Default snap point: 100
//       dismissOnSnapToBottom
//       position={position}
//       onPositionChange={setPosition}
//       zIndex={100_000}
//       animation="bouncy"
//     >
//       <Sheet.Overlay
//         animation="lazy"
//         enterStyle={{ opacity: 0 }}
//         exitStyle={{ opacity: 0 }}
//       />
//       <Sheet.Handle />
//       <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5">
        


      
//       <View
//         flexDirection="column"
//         alignItems="stretch"
//         minWidth="100%"
//         maxWidth="100%"
//         gap="$4"
//         padding="$4"
//         paddingVertical="$6"
//         $gtSm={{
//           paddingVertical: '$4',
//           width: 400,
//         }}
//       >
//         <H1
//           alignSelf="center"
//           size="$8"
//           $xs={{
//             size: '$8',
//           }}
//         >
//           Sign in with Phone
//         </H1>




//       {/* {!otpRequested ? (
//         <>
//           <View flexDirection="column" gap="$3">
//             <View flexDirection="column" gap="$1">
//               <Input size="$4">
//                 <Input.Label htmlFor="phone">Phone</Input.Label>
//                 <Input.Box>
//                   <Input.Area
//                     id="phone"
//                     keyboardType="phone-pad"
//                     value={phone}
//                     onChangeText={setPhone}
//                     placeholder="+91 7416340801"
//                   />
//                 </Input.Box>
//               </Input>
//             </View>
//           </View>

//           <Theme inverse>
//             <Button
//               disabled={loading}
//               onPress={() => {
//                 signInWithNumber(); 
//               }}
//               width="100%"
//               iconAfter={
//                 <AnimatePresence>
//                   {loading && (
//                     <Spinner
//                       color="$green10"
//                       key="loading-spinner"
//                       opacity={0.5}
//                       scale={2}
//                       animation="quick"
//                       position="absolute"
//                       enterStyle={{
//                         opacity: 0,
//                         scale: 0.5,
//                       }}
//                       exitStyle={{
//                         opacity: 0,
//                         scale: 0.5,
//                       }}
//                     />
//                   )}
//                 </AnimatePresence>
//               }
//             >
//               {!loading && <Button.Text>Get OTP</Button.Text>}
//             </Button>
//           </Theme>
//         </>
//       ) : (
//         // Render Success Message
//         <View flexDirection="column" alignItems="center" gap="$3">
//           <H1 alignSelf="center" size="$4">
//             Enter the code sent to your phone
//           </H1>
//           <OtpInput sections={4} sectionLength={1} onOtpComplete={handleOtpComplete} />
//         <NotNum phone={phone} press={() => { setPhone(''); setOtpRequested(false); }} />
//         </View>
//       )} */}


//       {otpSuc ? (
//         <View flexDirection="column" alignItems="center" gap="$3">
//           <H1 alignSelf="center" size="$4">
//             OTP Verified
//             </H1>
//         </View>

//       ) : (
//         loading && otpRequested ? (
//           <View
//             flexDirection="column"
//             alignItems="stretch"
//             minWidth="100%"
//             maxWidth="100%"
//             gap="$4"
//             padding="$4"
//             paddingVertical="$6"
//             $gtSm={{
//               paddingVertical: '$4',
//               width: 400,
//             }}
//           >
//             <H1 alignSelf="center" size="$8" $xs={{ size: '$5' }}>
//               Verifying.....
//             </H1>
//           </View>
//         ) : !otpRequested ? (
//           <>
//             <View flexDirection="column" gap="$3">
//               <View flexDirection="column" gap="$1">
//                 <Input size="$4">
//                   <Input.Label htmlFor="phone">Phone</Input.Label>
//                   <Input.Box>
//                     <Input.Area
//                       id="phone"
//                       keyboardType="phone-pad"
//                       value={phone}
//                       onChangeText={setPhone}
//                       placeholder="+91 7416340801"
//                     />
//                   </Input.Box>
//                 </Input>
//               </View>
//             </View>

//             <Theme inverse>
//               <Button
//                 disabled={loading}
//                 onPress={() => {
//                   signInWithNumber(); 
//                 }}
//                 width="100%"
//                 iconAfter={
//                   <AnimatePresence>
//                     {loading && (
//                       <Spinner
//                         color="$green10"
//                         key="loading-spinner"
//                         opacity={0.5}
//                         scale={2}
//                         animation="quick"
//                         position="absolute"
//                         enterStyle={{
//                           opacity: 0,
//                           scale: 0.5,
//                         }}
//                         exitStyle={{
//                           opacity: 0,
//                           scale: 0.5,
//                         }}
//                       />
//                     )}
//                   </AnimatePresence>
//                 }
//               >
//                 {!loading && <Button.Text>Get OTP</Button.Text>}
//               </Button>
//             </Theme>
//           </>
//         ) : (
//           // Render Success Message
//           <View flexDirection="column" alignItems="center" gap="$3">
//             <H1 alignSelf="center" size="$4">
//               Enter the code sent to your phone
//             </H1>
//             <OtpInput sections={4} sectionLength={1} onOtpComplete={handleOtpComplete} />
//             <NotNum phone={phone} press={() => { setPhone(''); setOtpRequested(false); }} />
//           </View>
//         )
//       )}

//       </View>




//       </Sheet.Frame>
//     </Sheet>
//     </>
//   )
// }




const LinkPhone = ({
  onPress,
  children,
}: {
  onPress?: () => void
  children: React.ReactNode
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

interface LinkProps {
  press: () => void
}

const PhoneLink = ({press}: LinkProps) => {

  return (
    <LinkPhone
      onPress={press}
      >
    {/* <Button icon={<Ionicons name="call" size={30} color = "black" />} flex={1} minWidth="100%" > */}
      <Paragraph textDecorationStyle="solid" ta="center">
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Login with Phone{' '}
        </SizableText>
      </Paragraph>
    {/* </Button> */}
    </LinkPhone>
  )
}

const SignUpLink  = ({press}: LinkProps) => {
  return (
    <LinkPhone onPress={press}>
      <Paragraph textDecorationStyle="solid" ta="center">
        Don&apos;t have an account?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </SizableText>
      </Paragraph>
    </LinkPhone>
  )
}

const SignInLink  = ({press}: LinkProps) => {
  return (
    <LinkPhone onPress={press}>
      <Paragraph textDecorationStyle="solid" ta="center">
        Already have an account?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign in
        </SizableText>
      </Paragraph>
    </LinkPhone>
  )
}

const ForgotPasswordLink  = ({press}: LinkProps) => {
  return (
    <LinkPhone onPress={press}>
      <Paragraph
        color="$gray11"
        hoverStyle={{
          color: '$gray12',
        }}
        size="$1"
        marginTop="$1"
      >
        Forgot your password?
      </Paragraph>
    </LinkPhone>
  )
}

interface NotNumProps {
  phone: string;
  press: () => void;
}

const NotNum = ({ phone,press }: NotNumProps) => {
  return (
    <LinkPhone
    onPress={press}>
      <Paragraph
        size="$2"
        marginTop="$1"
        color="$gray11"
        hoverStyle={{
          color: '$gray12',
        }}
      >
        Not{' '}
        <Paragraph
          asChild
          size="$3"
          color="$blue10"
          hoverStyle={{
            color: '$gray12',
          }}
        >
          <Text>+91 {phone}?</Text>
        </Paragraph>
      </Paragraph>
    </LinkPhone>

  )
}