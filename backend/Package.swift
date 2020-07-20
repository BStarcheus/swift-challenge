// swift-tools-version:5.0
import PackageDescription

let package = Package(
    name: "swiftChallenge",
    dependencies: [
        .package(url: "https://github.com/IBM-Swift/Kitura", from: "2.8.0"),
        .package(url: "https://github.com/IBM-Swift/Kitura-CORS.git", from: "2.1.1")
    ],
    targets: [
        .target(
            name: "swiftChallenge",
            dependencies: [ "Application" ]),
        .target(
            name: "Application", 
            dependencies: [ "Kitura", "KituraCORS" ]),
        .testTarget(
            name: "swiftChallengeTests",
            dependencies: [ "Application" ]),
    ]
)