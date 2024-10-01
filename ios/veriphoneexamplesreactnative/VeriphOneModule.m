#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(VeriphOneModule, NSObject)

RCT_EXTERN_METHOD(subscribeToVerificationEvent:(NSString *)apiKey sessionUuid:(NSString *)sessionUuid callback:(RCTResponseSenderBlock)callback)

@end
