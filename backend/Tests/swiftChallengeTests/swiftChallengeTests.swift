import XCTest
import Kitura
@testable import Application

final class swiftChallengeTests: XCTestCase {
    override func setUp() {
        super.setUp()
        do {
            let app = try App()
            try app.postInit()
            Kitura.addHTTPServer(onPort: 8080, with: app.router)
            Kitura.start()
        } catch {
            XCTFail("Couldn't start Application test server: \(error)")
        }
    }
    override func tearDown() {
        Kitura.stop()
        super.tearDown()
    }

    func submitForm(with body: String, expect message: String) {
        let url = URL(string: "http://127.0.0.1:8080")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("multipart/form-data; boundary=----WebKitFormBoundarydVPrsOKrTclhL9gs", forHTTPHeaderField: "Content-Type")
        request.httpBody = Data("------WebKitFormBoundarydVPrsOKrTclhL9gs\r\n\(body)------WebKitFormBoundarydVPrsOKrTclhL9gs--\r\n".utf8)

        let expectedResp = expectation(description: "Server will respond '\(message)'")

        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            guard let data = data, let resp = response as? HTTPURLResponse else { XCTFail("No response data"); expectedResp.fulfill(); return }
            XCTAssertEqual(resp.statusCode, 200)
            
            if let returnData = String(data: data, encoding: .utf8) {
                XCTAssertTrue(returnData.contains(message))
            } else {
                XCTFail("Could not decode response")
            }
            expectedResp.fulfill()
        }
        task.resume()
        waitForExpectations(timeout: 5)
        XCTAssertEqual(task.state, .completed)
    }
    
    func testNonSwiftFile() {
        // Test with non-Swift file. Server should reject.
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_fail.py\"\r\nContent-Type: application/octet-stream\r\n\r\nprint(\"This should fail\")\r\n", 
                   expect: "Error: Must submit .swift file")
    }

    func testInvalidSwiftFile() {
        // No function in file
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_fail.swift\"\r\nContent-Type: application/octet-stream\r\n\r\nprint(\"This should fail\")\r\n", 
                   expect: "Error: Could not find function 'sortAndDecode'.")

        // Invalid function name in file
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_fail.swift\"\r\nContent-Type: application/octet-stream\r\n\r\nfunc badSolution() {\n\tprint(\"This should fail\")\n}\r\n", 
                   expect: "Error: Could not find function 'sortAndDecode'.")

        // Invalid parameters and return type in function
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_fail.swift\"\r\nContent-Type: application/octet-stream\r\n\r\nfunc sortAndDecode(_ str: String) -> String {\n\tprint(\"This should fail\")\n}\r\n", 
                   expect: "Compile error. Make sure your function meets all the requirements for parameters and return types.")
    }

    func testValidSwiftFile() {
        // Valid function, but wrong solution
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_sol.swift\"\r\nContent-Type: application/octet-stream\r\n\r\nfunc sortAndDecode(_ arr: [[Any?]]) -> (String, [[Any?]]) {\n\treturn (\"WrongClue\", arr)\n}\r\n", 
                   expect: "The array isn't quite sorted, but take a look at your decoded clue and the data to see where you may have gone wrong. It should start with 'Clue:'")
    }

    func testValidSolution() {
        submitForm(with: "Content-Disposition: form-data; name=\"swiftFile\"; filename=\"test_sol.swift\"\r\nContent-Type: application/octet-stream\r\n\r\nfunc sortAndDecode(_ arr: [[Any?]]) -> (String, [[Any?]]) {\n\tlet sortedArr = arr.sorted(by: {\n\t\tlet endIndex = $0.count - 1\n\t\tfor i in 0..<endIndex {\n\t\t\tif let left = $0[i] as? String {\n\t\t\t\tif let right = $1[i] as? String {\n\t\t\t\t\tif left != right { // Both not nil\n\t\t\t\t\t\treturn left < right\n\t\t\t\t\t} // Else check next column\n\t\t\t\t} else { // Left not nil, Right nil\n\t\t\t\t\treturn false\n\t\t\t\t}\n\t\t\t} else if let _ = $1[i] as? String { // Left nil, right not nil\n\t\t\t\treturn true\n\t\t\t} // Else both nil, check next column\n\t\t}\n\t\t\n\t\t\n\t\tif let left = $0[endIndex] as? Int {\n\t\t\tif let right = $1[endIndex] as? Int {\n\t\t\t\tif left != right { // Both not nil\n\t\t\t\t\treturn left < right\n\t\t\t\t}\n\t\t\t} else { // Left not nil, Right nil\n\t\t\t\treturn false\n\t\t\t}\n\t\t} else if let _ = $1[endIndex] as? Int { // Left nil, right not nil\n\t\t\treturn true\n\t\t}\n\t\t// Else both nil\n\t\treturn false\n\t})\n\t\n\t\n\tvar clue = \"\"\n\tvar arrIndex = 0\n\twhile clue.count < 18 {\n\t\tif let letter = sortedArr[arrIndex].last! as? Int {\n\t\t\tclue.append(Character(UnicodeScalar(letter)!))\n\t\t}\n\t\tarrIndex += 1\n\t}\n\n\treturn (clue, sortedArr)\n}\r\n", 
                   expect: "Congratulations, you decoded the clue!")
    }

    static var allTests = [
        ("testNonSwiftFile", testNonSwiftFile),
        ("testInvalidSwiftFile", testInvalidSwiftFile),
        ("testValidSwiftFile", testValidSwiftFile),
        ("testValidSolution", testValidSolution),
    ]
}