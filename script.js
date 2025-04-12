// what is model ? it is a program or representation that learns to make predictions or decisions from data based on neural networks.
// what is face-api.min.js ? this is js library (compressed version of face-api.js)
// in the below line i connect the video variable to the video element of html.
const video = document.getElementById('video')

// Promise.all is the js language feature which is use to run multiple asynchronous operations(which are not dependent on each other).
Promise.all([
    // faceapi is object globally defined in face-api.min.js.
    // nets is also the object defined in faceapi object and it hold the pre-trained neural networds (models).
    // nets doesn't contain the actual files of models it only contain the links or we can say refrence of models.
    // loadFromUri() this is not the built-in feature of js, this only works in the context of face-api.js as it is defined in face-api.js
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
    // .then() this is the feature of the js which runs the arguement when the above operations are run successfully
]).then(startVideo)
function startVideo() {
    // the below line is used to get the web cam access from the user by taking permission from the user.
    navigator.mediaDevices.getUserMedia({ video: {} })
    // the below line will run if user gave the permission.
    // simple src is for the static video element. (src is the property of html so we can apply it to the video element in both ways either in html directly or from the js).
    // but srcObject is for the dynamic video element like live web cam. (srcObject is the property of js but can be applicable on html element).
    // stream is not a keyword. if i write .then(str => { video.srcObject=str;}) this, then it will also work.
    // in the below code stream is consider as a MediaStream object.
    .then(stream => { video.srcObject=stream;})
    // the below line will run if user didn't gave the permission.
    .catch(err => { console.error(err);})
}
// below line add a event listner to the video element of the html (video is connected to the video element of html file), it triggers when the video play.
video.addEventListener('play', () => {
    // faceapi.createCanvasFromMedia() this is the method from face-api.js so it can only be use in the context of face-api.js file as it is not the built-in feature of the js.
    // canvas is transparent which is placed above the video, we can draw only on canvas and not on video element.
    const canvas = faceapi.createCanvasFromMedia(video)
    // before the below line our canvas was only present in js and not in html but after the execution of the below line canvas was not present in our html file.
    document.body.append(canvas)
    // below line create the js object under two properties are created (width and height) whose value are same as the width and height of video element present in html.
    const displaySize = { width: video.width, height: video.height}
    // matchDimensions this is also a method of face-api.js library to give the width and height of the second arguement to the first arguement.
    // although this can also be done like this 
    // canvas.width=video.width
    // canvas.height=video.height
    // but we have to use this thing again in the code that's why we didn't do in this way.
    faceapi.matchDimensions(canvas, displaySize)
    // setInterval this is the built-in js function use to run the code written in it again and again in a fixed interval of time(200ms in our case).
    // in setInterval there is an asynchronous function means we can use await in our function
    setInterval(async () => {
        // we use await for those function which return promise.
        // here detectAllFaces returns a promise because it takes time to process the video stream and face detection.
        // don't be afraid to see this long line of code i can write the below line like this 
        // let faces = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        // faces = faces.withFaceLandmarks();
        // faces = faces.withFaceExpressions();
        // detectAllFaces this is the method inside face-api.js library, which is used to detect the faces in the given image or video here in this case we use web cam.
        // new faceapi.TinyFaceDetectorOptions() this is configuration object with default values which tells that "use TinyFaceDetector for face detection" to faceapi.detectAllFaces.
        // withFaceLandmarks, withFaceExpressions these are also the methode of the face-api.js lib. for landmarks and Expressions.
        // so basically this line stores all the info about the face in detections variable as a list of nested objects. list because there can be many faces in the video. information of one face is stored in the form of nested objects.
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // resizeResults this is again the method of face-api.js.
        // When face-api detects a face, it internally processes the image — and it’s possible that for internal processing, it resizes or compresses the image. 
        // Because of this, the face coordinates you get might not exactly match the canvas size. 
        // So to ensure that all the face detection results (like bounding box, eyes, lips) are drawn at the correct position on the canvas/video screen, resizing is necessary. 
        // resizedDetections = It's an array of face detection objects — just like it was in detections — but now, each object inside has its coordinates (like bounding box, landmarks) adjusted according to the real size of the video/canvas, i.e., displaySize.
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // Whenever i use a <canvas> tag in HTML, it gives you a blank drawing area — like an empty sheet of paper.
        // But to draw anything on that sheet (like shapes, lines, images, or text), you need a drawing tool and getContext('2d') is that tool.
        // example: const canvas = document.getElementById('myCanvas')
        //          const ctx = canvas.getContext('2d')
        //          ctx.fillStyle = 'blue'
        //          ctx.fillRect(10, 10, 100, 100) This will draw a blue rectangle.
        // the below line is the one line writing method. canvas.getContext('2d') this is the tool. clearRect is the method under canvas api.
        // clearRect(0, 0, canvas.width, canvas.height) = clearRect(x, y, width of rectangle you want to clear, height of rectangle you want to clear)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi is the global object under face-api, draw is the object under faceapi and drawDetections, drawFaceLandmarks, drawFaceExpressions are the methods under the draw object.
        // 1st arguement is where we have to draw and second arguement is what we have to draw.
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 200)
})
