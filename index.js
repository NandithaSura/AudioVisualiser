document.getElementById("audio").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // This load event is triggered as soon as the file is read as an array buffer
    // This event callback function is called whenever the readAsArrayBuffer operation is completed
    reader.addEventListener("load", (event) => {
        const arrayBuffer = event.target.result;

        // Create a new AudioContext
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Decode the audio data into an audio buffer
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            visualize(audioBuffer,audioContext)
        })
    })
    reader.readAsArrayBuffer(file)
})
// Function to visualize the audio buffer
function visualize(audioBuffer,audioContext) {
    const canvas = document.getElementById("canvas");
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientHeight; // Fixed width

    //To get the frequencies we want the analyzer node
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 128

    const frequecyBufferLength = analyser.frequencyBinCount
    const frequencyData = new Uint8Array(frequecyBufferLength)

    //CONNECT SOURCE AND ANALYSER TO GET REALTIME DATA
    //method use to get the real time data, updtae the real time ->frequecy data
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(analyser)
    analyser.connect(audioContext.destination) //play the audio
    source.start()
    

    const canvasContext = canvas.getContext("2d");

    // Get the channel data from the audio buffer
    // const channelData = audioBuffer.getChannelData(0); // Get PCM data for the first channel

    // // Set the number of chunks for visualization
    // const numberOfChunks = 400;
    // const chunkSize = Math.ceil(channelData.length / numberOfChunks);

    // Set the fill style for the bars
    
    //const center = canvas.height / 2;
    const barWidth = canvas.width / frequecyBufferLength //numberOfChunck

    function draw(){
        requestAnimationFrame(draw)
        canvasContext.fillStyle = "rgb(173, 216, 230)";
        canvasContext.fillRect(0,0,canvas.width, canvas.height)
        
        //this method will update this array with real time frequency
        analyser.getByteFrequencyData(frequencyData) //Here we are fetching the data only once we want to ftech the data every interval
        // Loop through each chunk and draw a bar for each
        // console.log(frequencyData)
        for (let i = 0; i < frequecyBufferLength; i++) {

            canvasContext.fillStyle = "rgb(" + (frequencyData[i]) + ",118, 138)";

            // const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);
    
            // const min = Math.min(...chunk) * 20
            // const max = Math.max(...chunk) * 20
    
            canvasContext.fillRect(
                i * barWidth, // x-coordinate
                canvas.height - frequencyData[i], // y-coordinate
                barWidth - 1, // width
                frequencyData[i] //max + Math.abs(min) // height
            );
        }
    }

    draw();
}
// setInterval(() => {
//     canvasContext.clearRect(0,0,canvas.width, canvas.height)
//     //this method will update this array with real time frequency
//     analyser.getByteFrequencyData(frequencyData) //Here we are fetching the data only once we want to ftech the data every interval
//     // Loop through each chunk and draw a bar for each
//     console.log(frequencyData)
//     for (let i = 0; i < frequecyBufferLength; i++) {
//         // const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);

//         // const min = Math.min(...chunk) * 20
//         // const max = Math.max(...chunk) * 20

//         canvasContext.fillRect(
//             i * barWidth, // x-coordinate
//             canvas.height - frequencyData[i], // y-coordinate
//             barWidth, // width
//             frequencyData[i] //max + Math.abs(min) // height
//         );
//     }
// }, 50);

//numberOfChunks == frequency data.length == analyser.frequencyBinCount --->frequencyBufferLength

    