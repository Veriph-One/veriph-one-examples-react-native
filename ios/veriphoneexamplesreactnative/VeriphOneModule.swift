import Foundation
import React

@objc(VeriphOneModule)
class VeriphOneModule: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
      return true
  }

  @objc(subscribeToVerificationEvent:sessionUuid:callback:)
  func subscribeToVerificationEvent(
      _ apiKey: String,
      sessionUuid: String,
      callback: @escaping RCTResponseSenderBlock
  ) {
    guard let rootViewController = UIApplication.shared.delegate?.window??.rootViewController else {
        callback([NSNull(), "No root view controller found"])
        return
    }

    launchVerification(with: apiKey, sessionUuid: sessionUuid, rootViewController: rootViewController) { result in
        callback([result ?? NSNull()])
    }
  }

  private func launchVerification(with apiKey: String,
                                  sessionUuid: String,
                                  rootViewController: UIViewController,
                                  completion: @escaping (String?) -> Void) {
    completion("Success")
  }
}
