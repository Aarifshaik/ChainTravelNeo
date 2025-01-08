import { supabase } from './supabase';
import {
    GoogleSignin,
    statusCodes,
  } from '@react-native-google-signin/google-signin'


export const checkAuthSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
        // console.log('User is already logged in:', session.user);
        console.log('User is already logged in');
        return { status: 'success', session };
    } else {
        // console.log('No active session found.');
        return { status: 'error', message: 'No active session' };
    }
};


export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        return { status: 'error', message: error.message };
    }
    console.log('Logged out successfully.');
    return { status: 'success', message: 'Logged out successfully.' };
};

async function insertUserToDatabase(email: string, userId: string, name: string) {
    try {
        const { data, error } = await supabase.from('users').insert([
            { auth_id: userId, email: email, name: name },
        ]);

        if (error) {
            console.error('Error inserting user into database:', error.message);
            if (error.message.includes('duplicate key value')) {
                return {
                    status: 'error',
                    message: 'Email is already registered. Please sign in.',
                };
            }
            return { status: 'error', message: error.message };
        }

        // console.log('User inserted successfully:', data);
        return { status: 'success', message: 'Inserted successfully.'};
    } catch (err) {
        console.error('Unexpected error while inserting user into database:', err);
        return {
            status: 'error',
            message: 'An unexpected error occurred while inserting the user.',
        };
    }
}

export const signUpWithMail = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
        return { status: 'error', message: 'Email, password, and name are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { status: 'error', message: 'Invalid email format. Please enter a valid email.' };
    }

    if (password.length < 6) {
        return { status: 'error', message: 'Password must be at least 6 characters long.' };
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { 
                emailRedirectTo: 'https://aarifshaik.github.io/eduvault-deploy/',
             },
        });

        if (error) {
            console.error('Error during sign-up:', error.message);
            return { status: 'error', message: error.message };
        }

        if (data?.user) {
            const user = data.user;
            if (user.email && user.id) {
                const result = await insertUserToDatabase(user.email, user.id, name);
                return result; // Returning the result from database insertion
            } else {
                console.error('Missing email or ID in user object:', user);
                return {
                    status: 'error',
                    message: 'User email or ID is undefined.',
                };
            }
        }

        return { status: 'error', message: 'User data is missing after sign-up.' };
    } catch (err) {
        console.error('Unexpected error during sign-up:', err);
        return {
            status: 'error',
            message: 'An unexpected error occurred during sign-up.',
        };
    }
};


export const signInWithMail = async (email: string, password: string) => {
    if (!email || !password) {
        return { status: 'error', message: 'Please fill in both email and password fields.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { status: 'error', message: 'Invalid email format. Please enter a valid email.' };
    }

    if (password.length < 6) {
        return { status: 'error', message: 'Password must be at least 6 characters long.' };
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });


        // const error = null;
        // const data: { user: any } = { user: "Aarif" };

        if (error) {
            console.error('Error during sign-in:', error.message);
            return { status: 'error', message: error.message };
        }

        if (data?.user) {
            console.log('Sign-in successful:', data.user);
            return {
                status: 'success',
                message: 'Sign in successful.',
                data: data.user,
            };
        }

        return {
            status: 'error',
            message: 'Sign-in failed: No user data returned.',
        };
    } catch (err) {
        console.error('Unexpected error during sign-in:', err);
        return {
            status: 'error',
            message: 'An unexpected error occurred during sign-in.',
        };
    }
};

export const GoogleSignIn = async () => {
    try {
        // Configure Google Sign-In
        GoogleSignin.configure({
            scopes: ['profile', 'email'], // Scopes you need
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID_WEB, // Replace with your actual Web Client ID
            
            // offlineAccess: true,
            // forceCodeForRefreshToken: true,
            // profileImageSize: 120

        });

        // Check if Play Services are available
        await GoogleSignin.hasPlayServices();

        // Start the sign-in process
        const userInfo = await GoogleSignin.signIn();

        if (userInfo?.data?.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.data.idToken, // Use the idToken from userInfo
            });

            if (error) {
                return { status: 'error', message: error.message };
            } else {
                return { status: 'success', message: 'Sign-in successful.', data };
            }
        } else {
            throw new Error('No ID token present!');
        }
    } catch (error) {
        // Handle different error types from Google Sign-In
        if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
            return { status: 'error', message: 'User cancelled the login flow.' };
        } else if ((error as any).code === statusCodes.IN_PROGRESS) {
            return { status: 'error', message: 'Sign-in operation is in progress.' };
        } else if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            return { status: 'error', message: 'Play services not available or outdated.' };
        } else {
            // Catch other errors (including network or unknown)
            return { status: 'error', message: (error as any).message || 'An unexpected error occurred.' };
        }
    }
};

export const SendOtp = async (phone: string) => {
    if (phone.length != 10) {
        return { status: 'error', message: 'Please enter a valid phone number.' };
    }

    try {
        const { data, error } = await supabase.auth.signInWithOtp({ phone: ('+91'+ phone) });
        // const data = {
        //     user: {
        //       id: '12345',
        //       phone: '+919876543210',
        //       app_metadata: { provider: 'phone' },
        //       user_metadata: { name: 'Test User' },
        //       created_at: '2025-01-01T10:00:00.000Z',
        //     },
        //     session: {
        //       access_token: 'dummy-access-token',
        //       refresh_token: 'dummy-refresh-token',
        //       expires_in: 3600,
        //       token_type: 'bearer',
        //     },
        //   };
          
        //   const error = null;
          

        if (error) {
            return { status: 'error', message: error.message };
        }
        return { status: 'success', message: 'OTP sent successfully.', data };
    } catch (err) {
        console.error('Unexpected error during OTP send:', err);
        return { status: 'error', message: 'An unexpected error occurred during OTP send.' };
    }
};


export const VerifyOtp = async (phone: string, otp: string) => {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: otp,
            type: 'sms',
        });

        // const data = {
        //     user: {
        //       id: '12345',
        //       phone: '+919876543210',
        //       app_metadata: { provider: 'phone' },
        //       user_metadata: { name: 'Test User' },
        //       created_at: '2025-01-01T10:00:00.000Z',
        //     },
        //     session: {
        //       access_token: 'dummy-access-token',
        //       refresh_token: 'dummy-refresh-token',
        //       expires_in: 3600,
        //       token_type: 'bearer',
        //     },
        //   };
          
        //   const error = null;

        if (error) {
            console.error('Error verifying OTP:', error.message);
            return { status: 'error', message: error.message };
        }

        if (data?.session) {
            return { status: 'success', message: 'OTP verified successfully.', data: data.session };
        } else {
            return { status: 'error', message: 'Session not found after OTP verification.' };
        }
    } catch (error) {
        console.error('Unexpected error during OTP verification:', error);
        return { status: 'error', message: 'An unexpected error occurred during OTP verification.' };
    }
};

