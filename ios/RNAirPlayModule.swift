import Foundation
import AVFoundation
import MediaPlayer

@objc(RNAirPlayModule)
class RNAirPlayModule: NSObject {
  
  /// Show the native AirPlay audio route picker
  @objc
  func showAirPlayPicker(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let routePickerView = AVRoutePickerView()
      routePickerView.prioritizesVideoDevices = false
      
      // Trigger the route picker button
      for view in routePickerView.subviews {
        if let button = view as? UIButton {
          button.sendActions(for: .touchUpInside)
          resolve(true)
          return
        }
      }
      
      reject("AIRPLAY_ERROR", "Could not show AirPlay picker", nil)
    }
  }
  
  /// Get all available audio routes
  @objc
  func getAvailableAudioRoutes(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
    let session = AVAudioSession.sharedInstance()
    let currentRoute = session.currentRoute
    
    var routes: [[String: Any]] = []
    
    for output in currentRoute.outputs {
      let route: [String: Any] = [
        "name": output.portName,
        "type": self.portTypeToString(output.portType),
        "uid": output.uid,
        "isSelected": true
      ]
      routes.append(route)
    }
    
    // Add available inputs as well
    if let availableInputs = session.availableInputs {
      for input in availableInputs {
        let route: [String: Any] = [
          "name": input.portName,
          "type": self.portTypeToString(input.portType),
          "uid": input.uid,
          "isSelected": false
        ]
        routes.append(route)
      }
    }
    
    resolve(routes)
  }
  
  /// Get the current active audio route
  @objc
  func getCurrentAudioRoute(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    let session = AVAudioSession.sharedInstance()
    let currentRoute = session.currentRoute
    
    if let output = currentRoute.outputs.first {
      let route: [String: Any] = [
        "name": output.portName,
        "type": self.portTypeToString(output.portType),
        "uid": output.uid
      ]
      resolve(route)
    } else {
      resolve(nil)
    }
  }
  
  /// Check if AirPlay is currently active
  @objc
  func isAirPlayActive(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
    let session = AVAudioSession.sharedInstance()
    let currentRoute = session.currentRoute
    
    for output in currentRoute.outputs {
      if output.portType == .airPlay {
        resolve(true)
        return
      }
    }
    
    resolve(false)
  }
  
  /// Helper method to convert AVAudioSession.Port to readable string
  private func portTypeToString(_ portType: AVAudioSession.Port) -> String {
    switch portType {
    case .builtInSpeaker:
      return "Speaker"
    case .builtInReceiver:
      return "Phone"
    case .headphones:
      return "Headphones"
    case .bluetoothA2DP, .bluetoothHFP, .bluetoothLE:
      return "Bluetooth"
    case .airPlay:
      return "AirPlay"
    case .carAudio:
      return "CarPlay"
    case .lineOut:
      return "LineOut"
    case .headsetMic:
      return "Headset"
    default:
      return portType.rawValue
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
