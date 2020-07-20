import Foundation
import Kitura
import KituraCORS

let options = Options(methods: ["POST"])
let cors = CORS(options: options)

public class App {

    let router = Router()

    public init() throws {}

    func postInit() throws {
        router.all(middleware: BodyParser())
        router.all(middleware: cors)

        if #available(macOS 10.13, *) {
            router.post("/") { request, response, next in
                guard let value = request.body else { response.send("Error: No message body"); return }
                guard case let .multipart(data) = value else { response.send("Error: Not a multipart form"); return }
                guard let part = data.first else { response.send("Error: Body was not parsed"); return }
                guard part.filename.hasSuffix(".swift") else { response.send("Error: Must submit .swift file"); return }
                guard case let .raw(rawBody) = part.body else { response.send("Error: Could not decode swift file"); return }
                let bodyStr = String(decoding: rawBody, as: UTF8.self)
                guard bodyStr != "" else { response.send("Error: Could not decode as UTF8"); return }
                guard bodyStr.contains("func sortAndDecode(") else { response.send("Error: Could not find function 'sortAndDecode'."); return }

                // Save user file to Challenge module
                let challengeFolder = URL(fileURLWithPath: FileManager.default.currentDirectoryPath + "/Sources/Challenge", isDirectory: true)
                let newFile = URL(fileURLWithPath: "UserSolution.swift", relativeTo: challengeFolder)
                try rawBody.write(to: newFile)
                
                // swift run the Challenge module
                let task = Process()
                task.executableURL = URL(fileURLWithPath: "/usr/bin/swift")
                task.currentDirectoryURL = challengeFolder
                task.arguments = ["run"]
                let outputPipe = Pipe()
                task.standardOutput = outputPipe
                try task.run()
                task.waitUntilExit()

                let outputData = outputPipe.fileHandleForReading.readDataToEndOfFile()
                var output = String(decoding: outputData, as: UTF8.self)
                
                if output == "" {
                    output = "Compile error. Make sure your function meets all the requirements for parameters and return types."
                }

                response.send(output)
                next()
            }
        } else {
            router.post("/") { request, response, next in
                response.send("Internal error. Incompatible swift version.")
                next()
            }
        }
    }

    public func run() throws {
        try postInit()
        Kitura.addHTTPServer(onPort: 8080, with: router)
        Kitura.run()
    }
}