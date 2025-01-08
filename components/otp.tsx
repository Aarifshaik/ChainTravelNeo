import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

interface OtpInputProps {
  sections?: number;
  sectionLength?: number;
  onOtpComplete?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ sections = 6, sectionLength = 1, onOtpComplete }) => {
  const [otpValues, setOtpValues] = useState(Array(sections).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleChange = ({ text, index }: { text: string; index: number }) => {
    const updatedValues = [...otpValues];
    updatedValues[index] = text.slice(0, sectionLength); // Replace the value at the current index
    setOtpValues(updatedValues);

    // Move to the next input if the current one is filled
    if (text.length === sectionLength && index < sections - 1) {
      nextInput(index);
    }

    // Notify OTP completion only if all cells are filled and the last cell is focused
    const completeOtp = updatedValues.join('');
    if (completeOtp.length === sections * sectionLength && index === sections - 1) {
      onOtpComplete && onOtpComplete(completeOtp);
    }
  };

  const nextInput = (index: number) => {
    const nextInputRef = inputsRef[index + 1]?.current;
    if (nextInputRef) nextInputRef.focus();
  };

  const prevInput = (index: number) => {
    const prevInputRef = inputsRef[index - 1]?.current;
    if (prevInputRef) prevInputRef.focus();
  };

  const inputsRef = Array.from({ length: sections }, () => React.createRef<TextInput>());

  return (
    <View style={styles.container}>
      {otpValues.map((value, index) => (
        <TextInput
          key={index}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={sectionLength}
          value={value}
          selectTextOnFocus={true} // Automatically selects text on focus
          onChangeText={(text) => {
            handleChange({ text, index });
            if (text.length === sectionLength && index < sections - 1) {
              nextInput(index); // Explicitly move to the next input
            }
          }}
          ref={inputsRef[index]}
          onFocus={() => setFocusedIndex(index)} // Update the focused index
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              // If current input is not empty, delete the value
              if (otpValues[index] !== '') {
                const updatedValues = [...otpValues];
                updatedValues[index] = ''; // Remove the value
                setOtpValues(updatedValues);
              }
              // If the current input is empty and it's not the first one, move to the previous input
              else if (index > 0) {
                prevInput(index);
              }
            }
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    padding: 10,
    fontSize: 18,
    width: 50,
    marginHorizontal: 5, // Add spacing between cells
  },
});

export default OtpInput;
