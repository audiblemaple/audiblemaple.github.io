// declare global variables
var arr = [];
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width;
var height;
var cancel = false, real_time = false, running = false, sorted = false;

function initialize(){
    // Start listening to events
    // Register an event listener to call the resizeCanvas() function
    // each time the window is resized
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('resize', recalculate_width_height, false);


    // listen for changes in algorithm speed
    document.getElementById('speed').addEventListener('input', e =>{
        document.getElementById('alg_speed').textContent = document.getElementById('speed').value + "%";
    }, false);


    // listen for changes in array size
    document.getElementById('arrRange').addEventListener('input', e => {
        document.getElementById('size').textContent = document.getElementById('arrRange').value;
        recalculate_width_height();
        makeArray();
        redraw();
    }, false);


    // event listener for algorithm selection in the run button
    document.addEventListener('click', e =>{
        const isDropdownButton = e.target.matches("[data-dropdown-button]")
        if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return;

        let current_dropdown;
        if(isDropdownButton){
            current_dropdown = e.target.closest('[data-dropdown]');
            current_dropdown.classList.toggle("active");
        }
        document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
            if(dropdown === current_dropdown) return
            dropdown.classList.remove("active")
        });
    });


    // adds event listener for all the dropdown menu elements
    var elements = document.getElementsByClassName("alg");
    document.getElementById('alg-txt').innerText = elements[1].innerText;

    for(var i = 1; i < elements.length; i++){
        elements[i] .addEventListener('click', evt =>{
            document.getElementById('alg-txt').innerText = evt.target.innerText;
        }, false);
    }

    // Draw rects for the first time.
    resizeCanvas();

    // array of random numbers
    makeArray();

    // redraw the array columns
    redraw();
}

// ARRAY FUNCTIONS
// generate an array
function makeArray(){
    // clear the array
    arr.length = 0;
    // create a new array
    for(let i = 0; i < document.getElementById("arrRange").value; i++){
        arr.push(Math.floor( canvas.height - (i * height)));
        shuffle();
    }
    sorted = false;
}

// shuffle the array
function shuffle(){
    let currentIndex = arr.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
}


// MISC FUNCTIONS
// TODO: improve the width calculation
// recalculates the column width and height
function recalculate_width_height(){
    width = canvas.width / document.getElementById("arrRange").value;
    height = canvas.height / document.getElementById("arrRange").value;
}

// sets the real time attribute to true
function set_real_time(){
    real_time = !real_time;
    console.log(real_time);
    if(real_time){
        document.getElementById("alg_speed").textContent = "Real Time"
        return
    }
    document.getElementById('alg_speed').textContent = document.getElementById('speed').value + "%";
}


// cancels the run of an algorithm
function cancel_run(){
    if (running)
        cancel = true;
    document.getElementById("run").disabled = false;
    document.getElementById("arrRange").disabled = false;
    document.getElementById("recreate_array").disabled = false;
}

// disables and enables the buttons
function flip_functions(){
    document.getElementById("run").disabled = !document.getElementById("run").disabled;
    document.getElementById("arrRange").disabled = !document.getElementById("arrRange").disabled;
    document.getElementById("recreate_array").disabled = !document.getElementById("recreate_array").disabled;
}


// UI FUNCTIONS
// Runs each time the window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 55;
    recalculate_width_height()
    redraw();
}

// prints the selected algorithm in the button text
function alg_select(algo){
    document.getElementById("run").innerText = "run " + algo.innerText + " algorithm";
}


// DRAW FUNCTIONS
// Display custom canvas. In this case it's a blue, 5 pixel
// border that resizes along with the browser window.
// TODO: make the column sizes even
function redraw(val1, val2) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i <= document.getElementById("arrRange").value; i++){
        context.fillStyle = "rgb(94,94,94)";
        if(arr[i] === val1 || arr[i] === val2){
            context.fillStyle = "rgb(255,0,45)";
        }
        //context.fillRect((canvas.width - width) - (i * width), canvas.height, width, arr[i]);
        context.fillRect(i * width, canvas.height, width, -arr[i]);
        context.fillStyle = "rgb(14,3,3)";
        context.font = "bold 21px Arial";
        draw_text(arr[i], i);
    }
}

function complete(){
    for(let i = 0; i <= document.getElementById("arrRange").value; i++){
        sleep(1);
        context.fillStyle = "rgb(49,197,0)";
        //context.fillRect(i * width, canvas.height, width, arr[arr.length  - 1 - i])
        context.fillRect(i * width, canvas.height, width, -arr[i])
        context.fillStyle = "rgb(14,3,3)";
        context.font = "bold 21px Arial";
        draw_text(arr[i], i);
    }
}

function draw_text(num, i){
    if(canvas.height - num !== 0){
        context.fillText(num, (i * width) + (width / 2) - 17, canvas.height - num - 2);
        return
    }
    context.fillText(num, (i * width) + (width / 2) - 17, canvas.height - num + 20);
}

// SORTING ALGORITHMS
// check which algorithm to run
async function check_run(){
    const alg = document.getElementById("alg-txt").innerText;
    console.log(alg);
    if(sorted || running){
        return;
    }

    running = true;
    flip_functions();

    switch (alg){
        case "Bubble sort":
            await bubble_sort();
            break;

        case "Merge sort":
            await merge_sort(0, arr.length -1);
            break;

        case "Insertion sort":
            await insertion_sort();
            break;

        case "Bucket sort":
            await bucket_sort();
            break;
    }

    if(cancel){
        cancel = false;
        running = false;
        await redraw();
        return;
    }
    await redraw();
    sorted = true;
    await complete();
    flip_functions();
    running = false;
}


// sleep functionality
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// classic bubble sort algorithm
//      * if running and cancel are active quit the function run.
async function bubble_sort(){
    for(let i = 0 - 1; i < arr.length - 1; i ++ ){
        for(let j = 0 - 1; j <= arr.length - 1; j ++){
            if(cancel)
                return;

            if(arr[j] > arr[j + 1]){
                if(real_time){
                    await swap(j);
                    continue;
                }
                await swap(j);
                await redraw(arr[j + 1]);
                await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25)); // looks like this approach is better...
            }
            await redraw(arr[j + 1]);
            await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25)); // looks like this approach is better...
        }
    }
}

// swap between 2 indexes of the array
function swap(j){
    let temp;
    temp = arr[j];
    arr[j] = arr[j+1];
    arr[j + 1] = temp;
}

// merge function
// TODO: change the realtime with continue control flow   <========= ???
async function merge(left, mid, right){
    if (cancel)
        return;
    var delay = Math.pow(100 - document.getElementById("speed").value, 1.5);
    var num1 = mid - left + 1;
    var num2 = right - mid;

    var left_arr = new Array(num1);
    var right_arr = new Array(num2);

    for(var i = 0; i < num1; i++){
        if (cancel)
            return;
        if(!real_time){
            left_arr[i] = arr[left + i];
            await redraw(arr[left + i], arr[mid + 1 + j]);
            await sleep(delay);
        }
        else {
            left_arr[i] = arr[left + i];
        }
    }
    for(var j = 0; j < num2; j++){
        if (cancel)
            return;
        if(!real_time){
            right_arr[j] = arr[mid + 1 + j];
            await redraw(arr[mid + 1 + j], arr[left + i]);
            await sleep(delay);
        }
        else {
            right_arr[j] = arr[mid + 1 + j];
        }
    }

    i = 0;
    j = 0
    var k = left;

    while(i < num1 && j < num2){
        if (cancel)
            return;
        if(left_arr[i] <= right_arr[j]){
            if(!real_time){
                arr[k] = left_arr[i];
                i++;
                await redraw(arr[k], right_arr[j]);
                await sleep(delay);
            }
            else {
                arr[k] = left_arr[i];
                i++;
            }
        }
        else {
            if(!real_time){
                arr[k] = right_arr[j];
                j++;
                await redraw(arr[k], left_arr[i]);
                await sleep(delay);
            }
            else {
                arr[k] = right_arr[j];
                j++;
            }
        }
        k++
    }

    while(i < num1){
        if (cancel)
            return;
        if(!real_time){
            arr[k] = left_arr[i];
            i++;
            k++;
            await redraw(left_arr[i], right_arr[j]);
            await sleep(delay);
        }
        else {
            arr[k] = left_arr[i];
            i++;
            k++;
        }
    }

    while(j < num2){
        if (cancel)
            return;
        if(!real_time){
            arr[k] = right_arr[j];
            j++;
            k++;
            await redraw(right_arr[j], left_arr[i]);
            await sleep(delay);
        }
        else {
            arr[k] = right_arr[j];
            j++;
            k++;
        }
    }
}

// merge sort
async function merge_sort(left,right){
    if (cancel)
        return;
    if (left >= right){
        redraw(arr[left], arr[right]);
        return;
    }
    var mid = left + parseInt((right - left) / 2 + "");
    await merge_sort(left, mid);
    await merge_sort(mid + 1, right);
    await merge(left, mid, right);
    await redraw(arr[left], arr[right]);
}


// insertion sort
async function insertion_sort(){
    let i, j, num;

    for(i = 1; i < arr.length; i ++){
        if(cancel)
            return;
        if(real_time){
            num = arr[i];
            j = i - 1;
        }
        else {
            num = arr[i];
            j = i - 1;
            redraw(arr[i]);
            await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25));
        }
        while (j >= 0 && arr[j] > num){
            if(cancel)
                return;
            if(real_time){
                arr[j + 1] = arr[j];
                j -= 1;
                continue;
            }
            redraw(arr[j], arr[i]);
            await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25));
            arr[j + 1] = arr[j];
            j -= 1;
        }
        if (real_time){
            arr[j + 1] = num;
            continue;
        }
        arr[j + 1] = num;
        redraw(arr[j + 1]);
        await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25));
    }
}

// bucket sort
// TODO: fix the printing or create my own visualization....
async function bucket_sort(){
    if(arr.length <= 0)
        return;
        let len = arr.length;
        let arrays = new Array(len);
        let index = 0;

        for(let i = 0; i < len; i++)
            arrays[i] = [];

        for(let i = 0; i < len; i++){
            let idx = Math.floor(arr[i] / len);
            if(arrays[idx] === undefined){
                arrays[idx] = [];
            }
            arrays[idx].push(arr[i]);
        }

        for(let i = 0; i < len; i++){
            await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25));
            redraw(arr[i])
            arrays[i].sort((a,b) => a-b);
        }

        for(let i = 0; i < len; i++){
            for(let j = 0; j < arrays[i].length; j++){
                await sleep(Math.pow(100 - document.getElementById("speed").value, 1.25));
                redraw(arr[index]);
                arr[index++] = arrays[i][j];
            }
        }
}


////////////////////////////////////////////////////////////////////////
// TODO: refactor all the code !!!!!!!!!!!!!!!
// TODO: implement cancel in a better way.
// TODO: consider removing the real time completely
// TODO: improve waiting times
////////////////////////////////////////////////////////////////////////


// OTHER TO,DO
// TODO: make a better font
// TODO: improve UI

