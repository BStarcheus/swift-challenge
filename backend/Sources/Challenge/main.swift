import Foundation

let names = ["Hummus", "Huckster", "Hannah", "John", "Jenna", "Ryan", "Hank", "Anna", "Megan", "Will", "Stephen", "Zack", "Sydney", "Katie", "Peter"]
let flavors = ["Plain", "Artichoke", "Roasted Pepper", "Black Bean", "Garlic"]
let addin = ["Artichoke", "Roasted Pepper", "Garlic", "Chocolate", "Jalepeno", "Spices", "Oil", "Pine Nuts", "Tahini"]

let columnOptions = [names, flavors, addin, addin, addin]


private func arrSorter(_ arr1: [Any?], _ arr2: [Any?]) -> Bool {
	/* Array comparison by element. 
	   For use in sort(by: ) to get an array of arrays in increasing order.
	
	   nil is less than a value. If neither are nil, compare values normally.
	   If two elements are equal, compare the next elements. */

	let endIndex = arr1.count - 1
	
	// Sort by string columns
	for i in 0..<endIndex {
		if let left = arr1[i] as? String {
			if let right = arr2[i] as? String {
				if left != right {
					// Both not nil
					return left < right
				}
				// Else check next column
			} else {
				// Left not nil, Right nil
				return false
			}
		} else if let _ = arr2[i] as? String {
			// Left nil, right not nil
			return true
		}
		// Else both nil, check next column
	}
	
	// If necessary sort by int
	if let left = arr1[endIndex] as? Int {
		if let right = arr2[endIndex] as? Int {
			if left != right {
				// Both not nil
				return left < right
			}
		} else {
			// Left not nil, Right nil
			return false
		}
	} else if let _ = arr2[endIndex] as? Int {
		// Left nil, right not nil
		return true
	}
	// Else both nil
	return false
}

private func generateRandomArray() -> [[Any?]] {
	// 50 x 6 array of (optional) random values
    // Columns 0-4: String from names, flavors, or addins
    // Column 5: Integer
	var randomArr: [[Any?]] = (0...49).map({ _ in
		(0...columnOptions.count).map({ i in
			// 10% chance of a nil value
			let makeNil = Int.random(in: 0...9)
			if makeNil == 0 {
				return nil
			} else if i == columnOptions.count {
				return Int.random(in: 0...999)
			} else {
				return columnOptions[i].randomElement()
			}
		})
	})

	// Sort the array of arrays by column. nil values are "smallest".
	// If equal values, sort by next column.
	randomArr.sort(by: arrSorter)

	// Insert secret
	let clue = "Clue:22ce04ccef6f6"
	var clueIndex = 0

	// Insert each character as it's ASCII value in decimal
	for i in 0..<randomArr.count {
        // Skip over nil values
		if randomArr[i].last != nil {
			randomArr[i][randomArr[i].endIndex-1] = Int(clue[clue.index(clue.startIndex, offsetBy: clueIndex)].asciiValue!)
			clueIndex += 1
			if clueIndex == clue.count { break }
		}
	}

	// Reshuffle
	randomArr = randomArr.shuffled()

	return randomArr
}


private func checkUserSolution() {
    let randomArr = generateRandomArray()
    let (decodedClue, sortedArr) = sortAndDecode(randomArr)

    // Standardize as strings
    let stringOnlyArr = sortedArr.map({ (arr: [Any?]) -> [String] in
        return arr.map({
            if $0 == nil {
                return "nil"
            } else {
                return "\($0!)"
            }
        })
    })

	// Convert to JSON
    var json: [String: Any] = [
        "decodedClue": decodedClue,
        "userSortedArr": stringOnlyArr
    ]
    if decodedClue == "Clue:22ce04ccef6f6" {
        json["message"] = "Congratulations, you decoded the clue!"
    } else {
        json["message"] = "The array isn't quite sorted, but take a look at your decoded clue and the data to see where you may have gone wrong. It should start with 'Clue:'"
    }

    guard let jsonRaw = try? JSONSerialization.data(withJSONObject: json) else { print("Error encoding JSON"); return }
    let jsonStr = String(decoding: jsonRaw, as: UTF8.self)

    // Send through pipe to main program
    print(jsonStr)
}


checkUserSolution()