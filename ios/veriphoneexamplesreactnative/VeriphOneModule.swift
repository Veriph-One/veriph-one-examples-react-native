import Foundation
import React
import VeriphOne
import UIKit
import SwiftUI

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
    DispatchQueue.main.async {
      guard let rootViewController = UIApplication.shared.delegate?.window??.rootViewController else {
          callback([NSNull(), "No root view controller found"])
          return
      }

      self.launchVerification(with: apiKey, sessionUuid: sessionUuid, rootViewController: rootViewController) { result in
          callback([result ?? NSNull()])
      }
    }
  }

  private func launchVerification(with apiKey: String,
                                  sessionUuid: String,
                                  rootViewController: UIViewController,
                                  completion: @escaping (String?) -> Void) {
    let veriphOneView = VeriphOneView(sessionUuid: sessionUuid, apiKey: apiKey) { a in
        if let a = a {
            completion(a)
            DispatchQueue.main.async {
              rootViewController.dismiss(animated: true)
            }
        } else {
          completion(nil)
        }
    }
    
    let hostingController = UIHostingController(rootView: veriphOneView)
    rootViewController.present(hostingController, animated: true)
  }
}
