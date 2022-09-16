// var arr = [];
// var canvas = document.getElementById('canvas');
// var context = canvas.getContext('2d');
// var width;
// var height;
// var real_time = false;
// var running = false;
//
// function initialize(){
//     // Start listening to events
//     // Register an event listener to call the resizeCanvas() function
//     // each time the window is resized
//     window.addEventListener('resize', resizeCanvas, false);
//     window.addEventListener('resize', recalculate_width_height, false)
//
//     // event listeners for array size
//     document.getElementById('arrRange').addEventListener('input', reprint, false);
//     document.getElementById('arrRange').addEventListener('input', makeArray, false);
//     document.getElementById('arrRange').addEventListener('input', redraw, false);
//
//     // event listener for algorithm selection in the run button
//     document.getElementById('alg_select').addEventListener('change', reselect, false);
//
//     // event listener for algorithm speed
//     document.getElementById('speed').addEventListener('input', reprint, false);
//
//     // set default size and speed values
//     document.getElementById('size').textContent = document.getElementById('arrRange').value;
//     document.getElementById('alg_speed').textContent = document.getElementById('speed').value + "%";
//
//     // set button algorithm name
//     document.getElementById("run").innerText = "Run " + document.getElementById("alg_select").value + " algorithm";
//
//     // Draw rects for the first time.
//     resizeCanvas();
//
//     // array of random numbers
//     makeArray()
//
//     // redraw the array columns
//     redraw();
// }
//
//
// // TODO: ARRAY FUNCTIONS
//
// // generate an array
// function makeArray(){
//     // clear the array
//     arr.length = 0;
//     // create a new array
//     for(let i = 0; i < document.getElementById("arrRange").value; i++){
//         // TODO: fix here there will not be two same values that are the same
//         //arr.push(Math.floor(Math.random() * (- canvas.height)));
//         arr.push((-i * height) - height);
//         shuffle();
//     }
// }
//
// // shuffle the array
// function shuffle(){
//     let currentIndex = arr.length,  randomIndex;
//
//     // While there remain elements to shuffle.
//     while (currentIndex !== 0) {
//         // Pick a remaining element.
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex--;
//
//         // And swap it with the current element.
//         [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
//     }
// }
//
//
//
// // TODO: MISCELLANEOUS FUNCTIONS
// // recalculates the column width and height
// function recalculate_width_height(){
//     width = canvas.width / document.getElementById("arrRange").value;
//     height = canvas.height / document.getElementById("arrRange").value;
// }
//
// // sets the real time attribute to true
// function set_real_time(){
//     document.getElementById("alg_speed").textContent = "Real Time"
//     real_time = true;
// }
//
//
//
// // TODO: UI FUNCTIONS
// // Runs each time the DOM window resize event fires.
// // Resets the canvas dimensions to match window,
// // then draws the new borders accordingly.
// function resizeCanvas() {
//     canvas.width = window.innerWidth - 40;
//     canvas.height = window.innerHeight - 55;
//     //document.getElementById("arrRange").setAttribute("max", (canvas.height / 10).toString()); // allows to change the
//     recalculate_width_height()
//     redraw();
// }
//
// // reprints alg speed and arr range on slider input
// function reprint(){
//     document.getElementById('size').textContent = document.getElementById('arrRange').value;
//     recalculate_width_height();
//     document.getElementById('alg_speed').textContent = document.getElementById('speed').value + "%";
//     real_time = false;
// }
//
// // prints the selected algorithm in the button text
// function reselect(){
//     document.getElementById("run").innerText = "Run " + document.getElementById("alg_select").value + " algorithm";
// }
//
//
//
//
// // TODO: DRAW FUNCTIONS:
// // Display custom canvas. In this case it's a blue, 5 pixel
// // border that resizes along with the browser window.
// // TODO: make the column sizes even
// function redraw() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//
//     for(let i = 0; i <= document.getElementById("arrRange").value; i++){
//         context.fillStyle = "rgb(90, 90, 90)";
//         //context.fillRect(i * width, canvas.height, width, arr[i]);
//         context.fillRect((canvas.width - width) - (i * width), canvas.height, width, arr[i])
//     }
// }
//
// async function complete(){
//     //context.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas
//     for(let i = 0; i <= document.getElementById("arrRange").value; i++){
//         if (real_time)
//             await sleep(10);
//         else
//             await sleep(15);
//         context.fillStyle = "rgb(150, 10, 10)";
//         //context.fillRect(i * width, canvas.height, width, arr[i]);
//         context.fillRect(i * width, canvas.height, width, arr[arr.length  - 1 - i])
//     }
// }
//
//
//
//
// // TODO: SORTING ALGORITHMS
// // check which algorithm to run
// async function check_run(){
//     const alg = document.getElementById("alg_select").value;
//
//     switch (alg){
//         case "Bubble sort":
//             if(!running){
//                 running = true;
//                 bubble_sort();
//             }
//             break;
//
//         case "Merge sort":
//             if(!running){
//                 running = true;
//                 await merge_sort(0, arr.length -1);
//             }
//             complete();
//             break;
//     }
// }
//
// // classic bubble sort algorithm
// // TODO: find better way to control the speed of execution
// // TODO: add the colored column that makes the swaps
// async function bubble_sort(){
//     let temp;
//     for(let i = arr.length - 1; i > 0; i -- ){
//         for(let j = arr.length - 1; j >= 0; j --){
//             if(arr[j] > arr[j + 1]){
//                 if(real_time){
//                     swap(i, j)
//                 }
//                 else {
//                     //await sleep(100 - document.getElementById("speed").value);
//                     await sleep(Math.pow(100 - document.getElementById("speed").value, 1.005)); // looks like this approach is better...
//                     swap(i, j)
//                     redraw()
//                 }
//             }
//         }
//     }
//     redraw();
//     running = false;
//     await complete();
// }
//
// // swap between 2 indexes of the array
// function swap(i, j){
//     let temp;
//     temp = arr[j];
//     arr[j] = arr[j+1];
//     arr[j + 1] = temp;
// }
//
// const sleep = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }
//
// async function merge(left, mid, right){
//     var delay = Math.pow(100 - document.getElementById("speed").value, 1.00009);
//     //console.log(Math.pow(100 - document.getElementById("speed").value, 1.00001));
//     var num1 = mid - left + 1;
//     var num2 = right - mid;
//
//     var left_arr = new Array(num1);
//     var right_arr = new Array(num2);
//
//     for(var i = 0; i < num1; i++){
//         if(!real_time){
//             await sleep(delay);
//         }
//         left_arr[i] = arr[left + i];
//         redraw()
//     }
//     for(var j = 0; j < num2; j++){
//         if(!real_time){
//             await sleep(delay);
//         }
//         right_arr[j] = arr[mid + 1 + j];
//     }
//
//     var i = 0;
//     var j = 0
//     var k = left;
//
//     while(i < num1 && j < num2){
//         if(left_arr[i] <= right_arr[j]){
//             if(!real_time){
//                 await sleep(delay);
//             }
//             arr[k] = left_arr[i];
//             i++;
//             redraw();
//         }
//         else {
//             if(!real_time){
//                 await sleep(delay);
//             }
//             arr[k] = right_arr[j];
//             j++;
//             redraw();
//         }
//         k++
//     }
//
//     while(i < num1){
//         if(!real_time){
//             await sleep(delay);
//         }
//         arr[k] = left_arr[i];
//         i++;
//         k++;
//         redraw();
//     }
//
//     while(j < num2){
//         if(!real_time){
//             await sleep(delay);
//         }
//         arr[k] = right_arr[j];
//         j++;
//         k++;
//         redraw();
//     }
// }
//
// async function merge_sort(left,right){
//     if (left >= right){
//         return;
//     }
//     var mid = left + parseInt((right - left) / 2);
//
//     await merge_sort(left, mid);
//     await merge_sort(mid + 1, right);
//     await merge(left, mid, right);
//     await redraw();
//     running = false;
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
// // TODO: add cancellation function;
//
//
//
//
// // OTHER TO.DO
// // TODO: make a better font
// // TODO: improve UI
