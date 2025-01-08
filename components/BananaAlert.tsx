import React from 'react';
import { Button,AlertDialog, YStack, XStack } from 'tamagui'; // Make sure you have the correct import

export const BananasDialog = ({
    visible,
    onCancel,
    // onConfirm,
    heading,
    message,

  }: {
    visible: boolean;
    onCancel: () => void;
    // onConfirm: () => void;
    heading?: string;
    message?: string;
  }) => {
    return (
      <AlertDialog open={visible} onOpenChange={onCancel}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay opacity={0.5} />
          <AlertDialog.Content >
            <YStack space>
              <AlertDialog.Title>{heading}</AlertDialog.Title>
              <AlertDialog.Description>
                {message}
              </AlertDialog.Description>
  
              <XStack space="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button width="$6" onPress={onCancel} themeInverse >Ok</Button>
                </AlertDialog.Cancel>
                {/* <AlertDialog.Action asChild>
                  <Button theme="active" onPress={onConfirm}>
                    Bananas
                  </Button>
                </AlertDialog.Action> */}
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  };