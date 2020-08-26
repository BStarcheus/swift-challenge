# swift-challenge
Submit your Swift code to sort the array of arrays and find the hidden clue.

[Live Demo](https://hummushacks.github.io/swift)

My goal for this project was to learn about some unique features of Swift
and gain experience with a Swift web app framework. I also wanted to
provide others with a fun way to learn more about Swift and sorting.

The backend runs a Kitura web server, which accepts a Swift file submission.
It then places this file in the Challenge folder to compile and run separately.
This tests the user's code, and if they succeed in sorting the array of arrays
it sends the clue back to the frontend.

## Usage
First navigate to the backend directory.

If you have Swift installed you can run locally:
```
swift run
```

or build and run with Docker:
```
docker build --tag swift-ch-run .
docker run -p 8080:8080 -it --name sw-ch-run swift-ch-run
```

The frontend currently submits to my Google Cloud Run container.
To run locally, replace the form submission in
[swift.html](https://github.com/BStarcheus/swift-challenge/blob/1c709cc8eebf1092acc880addd175b2f43c0f99b/frontend/swift.html#L36)
to point to http://localhost:8080