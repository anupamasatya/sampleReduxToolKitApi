//
//  SecurityModule.m
//  YApp
//
//  Created by Adithya on 20/05/21.
//

#import "SecurityModule.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import <React/RCTLog.h>

#define E_AUTH_RECOGNIZED_SUCCESS = "E_AUTH_RECOGNIZED_SUCCESS";
#define E_AUTH_NOT_RECOGNIZED_SUCCESS = "E_AUTH_NOT_RECOGNIZED_SUCCESS";
#define SECURITY_LOCK_NOT_AVAILABLE = "SECURITY_LOCK_NOT_AVAILABLE";
#define IS_SECURITY_ENABLED = "IS_SECURITY_ENABLED";
#define IS_SECURITY_DISABLED = "IS_SECURITY_DISABLED";


@implementation SecurityModule

// To export a module named CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authenticateDevice)
{
  NSLog(@"came to bio metric code");
  LAContext *context = [[LAContext alloc] init];
  NSError *authError = nil;
  
  //        Test if fingerprint authentication is available
  //        on the device and a fingerprint has been enrolled.
  
  NSString *myLocalizedReasonString = @"Please authenticate using your passcode or fingerprint.";
  
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&authError]) {
    
    [context evaluatePolicy:LAPolicyDeviceOwnerAuthentication
     
            localizedReason:myLocalizedReasonString
     
                      reply:^(BOOL success, NSError *error) {
      if (success) {
        [self sendEventWithName:@"SecurityAuth" body:@{@"eventProperty": @"E_AUTH_RECOGNIZED_SUCCESS"}];
        
        NSLog(@"User authenticated successfully, take appropriate action");
      }
      else {
        NSLog(@"User did not authenticate successfully, look at error and take appropriate action");
        if(error.code == -1){
          NSLog(@"Application retry limit exceeded");
        }
        else if(error.code == LAErrorUserCancel){
          NSLog(@"user has tapped the home button and authentication is canced by user");
          [self sendEventWithName:@"SecurityAuth" body:@{@"eventProperty": @"E_AUTH_NOT_RECOGNIZED_SUCCESS"}];
        }
        if (@available(iOS 11.0, *)) {
          if(error.code == LAErrorBiometryLockout){
            
            NSLog(@"Authentication was not successful because there were too many failed biometry attempts(5 consequitive attempts)and biometry is now locked.Passcode is required to unlock biometry");
          }
          else if(error.code == LAErrorSystemCancel){
            NSLog(@"Authentication was canceled by system (e.g. another application went to foreground).");
          }
          else if(error.code == LAErrorSystemCancel){
            NSLog(@"Authentication was canceled by system (e.g. another application went to foreground).");
          }
          else {}
        }
        else {
          // Fallback approach on earlier versions
          if (error.code == LAErrorTouchIDLockout){
            
            NSLog(@"Authentication was not successful,because there were too many failed biometry attempts and biometry is now locked.Passcode is required to unlock biometry");
          }
          else {}
        }
      }
    }];
  }
  else {
    
    if (authError.code) {
      
      NSLog(@"There is no need to handle evaluate policy auth    error as user is already handled the policy evaluated error in app delegate if user is not handling the policy evaluated error in app delegate then handle the auth error here.");
    }
  }
  //    }
}
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"SecurityAuth"];
}

- (void)autharisationEventResponseReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"eventProperty"];
  [self sendEventWithName:@"SecurityAuth" body:@{@"eventProperty": eventName}];
}
// This would name the module AwesomeCalendarManager instead
// RCT_EXPORT_MODULE(AwesomeCalendarManager);

@end
