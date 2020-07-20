# swift-challenge
Submit your Swift code to sort the array of arrays and find the hidden clue.

The backend runs a Kitura web server, which accepts a Swift file submission. It then places this file in the Challenge folder to compile and run separately. This tests the user's code, and if they succeed in sorting the array of arrays it sends the clue back to the frontend.

## Usage
First navigate to the backend directory.

If you have Swift installed you can run locally.
```
swift run
```

Otherwise build and run with Docker.
```
docker build -t swift-ch-run .
docker run -p 8080:8080 -it --name sw-ch-run swift-ch-run
```

Also note that if you're using the frontend to submit, change the form submission to point to http://localhost:8080.
