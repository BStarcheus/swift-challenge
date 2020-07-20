const form = document.getElementById("file_form");
form.addEventListener("submit", submitFile);

async function submitFile(event) {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", form.action); 
    xhr.onload = handleSwiftResp;
    var formData = new FormData(form);
    xhr.send(formData);
}


async function handleSwiftResp(event) { 
    try {
        respData = JSON.parse(event.target.response);
    } catch {
        if (event.target.response) {
            document.getElementById("resp-message").innerHTML = "<b>Response:</b> " + event.target.response;
        } else {
            document.getElementById("resp-message").innerHTML = "<b>Response:</b> Internal error.";
        }
        return;
    }
    
    document.getElementById("resp-message").innerHTML = "<b>Response:</b> " + respData.message;
    document.getElementById("resp-clue").innerHTML = "<b>Your Decoding:</b> " + respData.decodedClue;

    let userSortedArr = respData.userSortedArr;
    createArray(height = userSortedArr.length, width = userSortedArr[0].length);
    await animateRows(userSortedArr);
}



function animateRows(arr) {
    i = 0;
    return new Promise((resolve)=> {
        animate = setInterval(()=>{
            if (i === arr.length) {
                clearInterval(animate);
                return resolve();
            }

            for (let j = 0; j < arr[i].length; j++) {
                coordinate = `${i},${j}`;
                document.getElementById(coordinate).innerText = arr[i][j];
            }
            i++;
        }, 50);
    });
}



const dataArr = document.getElementById("arr-data");

function createArray(height=50, width=6) {
    dataArr.innerHTML = "<tr><th>Name</th><th>Base</th><th>Add-in</th><th>Add-in</th><th>Add-in</th><th>Rating</th></tr>";
    for (let row = 0; row < height; row++) {
        currentRow = document.createElement('tr');
        currentRow.id = `row${row}`;
        

        for (let col = 0; col < width; col++) {
            arrItem = document.createElement('td');
            arrItem.id = `${row},${col}`;
            currentRow.appendChild(arrItem);
        }
        dataArr.appendChild(currentRow);
    }
}


function sampleData() {
    dataArr.innerHTML = `<tr><th>Name</th><th>Base</th><th>Add-in</th><th>Add-in</th><th>Add-in</th><th>Rating</th></tr>
                        <tr id="row0"><td id="0,0">nil</td><td id="0,1">Black Bean</td><td id="0,2">Garlic</td><td id="0,3">Roasted Pepper</td><td id="0,4">Jalepeno</td><td id="0,5">67</td></tr>
                        <tr id="row1"><td id="1,0">nil</td><td id="1,1">Garlic</td><td id="1,2">nil</td><td id="1,3">Artichoke</td><td id="1,4">Pine Nuts</td><td id="1,5">108</td></tr>
                        <tr id="row2"><td id="2,0">nil</td><td id="2,1">Garlic</td><td id="2,2">Spices</td><td id="2,3">Garlic</td><td id="2,4">Pine Nuts</td><td id="2,5">117</td></tr>
                        <tr id="row3"><td id="3,0">nil</td><td id="3,1">Plain</td><td id="3,2">Chocolate</td><td id="3,3">nil</td><td id="3,4">Tahini</td><td id="3,5">101</td></tr>
                        <tr id="row4"><td id="4,0">nil</td><td id="4,1">Roasted Pepper</td><td id="4,2">Spices</td><td id="4,3">Garlic</td><td id="4,4">Roasted Pepper</td><td id="4,5">58</td></tr>
                        <tr id="row5"><td id="5,0">Hank</td><td id="5,1">Artichoke</td><td id="5,2">nil</td><td id="5,3">Spices</td><td id="5,4">Chocolate</td><td id="5,5">85</td></tr>
                        <tr id="row6"><td id="6,0">Hank</td><td id="6,1">Black Bean</td><td id="6,2">Garlic</td><td id="6,3">Garlic</td><td id="6,4">Chocolate</td><td id="6,5">82</td></tr>
                        <tr id="row7"><td id="7,0">Hank</td><td id="7,1">Garlic</td><td id="7,2">Tahini</td><td id="7,3">Artichoke</td><td id="7,4">Tahini</td><td id="7,5">67</td></tr>
                        <tr id="row8"><td id="8,0">Hannah</td><td id="8,1">Black Bean</td><td id="8,2">Tahini</td><td id="8,3">Jalepeno</td><td id="8,4">Chocolate</td><td id="8,5">72</td></tr>
                        <tr id="row9"><td id="9,0">Hannah</td><td id="9,1">Black Bean</td><td id="9,2">Tahini</td><td id="9,3">Oil</td><td id="9,4">Roasted Pepper</td><td id="9,5">69</td></tr>
                        <tr id="row10"><td id="10,0">Hannah</td><td id="10,1">Roasted Pepper</td><td id="10,2">nil</td><td id="10,3">Roasted Pepper</td><td id="10,4">Oil</td><td id="10,5">65</td></tr>
                        <tr id="row11"><td id="11,0">Hannah</td><td id="11,1">Roasted Pepper</td><td id="11,2">Chocolate</td><td id="11,3">Pine Nuts</td><td id="11,4">Jalepeno</td><td id="11,5">84</td></tr>
                        <tr id="row12"><td id="12,0">Hannah</td><td id="12,1">Roasted Pepper</td><td id="12,2">Jalepeno</td><td id="12,3">Jalepeno</td><td id="12,4">Artichoke</td><td id="12,5">73</td></tr>
                        <tr id="row13"><td id="13,0">Huckster</td><td id="13,1">Garlic</td><td id="13,2">Jalepeno</td><td id="13,3">Spices</td><td id="13,4">Tahini</td><td id="13,5">78</td></tr>
                        <tr id="row14"><td id="14,0">Hummus</td><td id="14,1">Black Bean</td><td id="14,2">Chocolate</td><td id="14,3">Pine Nuts</td><td id="14,4">Artichoke</td><td id="14,5">71</td></tr>
                        <tr id="row15"><td id="15,0">Hummus</td><td id="15,1">Black Bean</td><td id="15,2">Garlic</td><td id="15,3">Spices</td><td id="15,4">Spices</td><td id="15,5">50</td></tr>
                        <tr id="row16"><td id="16,0">Hummus</td><td id="16,1">Roasted Pepper</td><td id="16,2">Oil</td><td id="16,3">nil</td><td id="16,4">Roasted Pepper</td><td id="16,5">50</td></tr>
                        <tr id="row17"><td id="17,0">Jenna</td><td id="17,1">Artichoke</td><td id="17,2">Roasted Pepper</td><td id="17,3">Spices</td><td id="17,4">Spices</td><td id="17,5">51</td></tr>
                        <tr id="row18"><td id="18,0">Jenna</td><td id="18,1">Black Bean</td><td id="18,2">Tahini</td><td id="18,3">Artichoke</td><td id="18,4">Jalepeno</td><td id="18,5">835</td></tr>
                        <tr id="row19"><td id="19,0">Jenna</td><td id="19,1">Plain</td><td id="19,2">Spices</td><td id="19,3">Oil</td><td id="19,4">Oil</td><td id="19,5">748</td></tr>
                        <tr id="row20"><td id="20,0">John</td><td id="20,1">Plain</td><td id="20,2">Jalepeno</td><td id="20,3">Oil</td><td id="20,4">Roasted Pepper</td><td id="20,5">734</td></tr>
                        <tr id="row21"><td id="21,0">John</td><td id="21,1">Plain</td><td id="21,2">Pine Nuts</td><td id="21,3">Artichoke</td><td id="21,4">Artichoke</td><td id="21,5">923</td></tr>
                        <tr id="row22"><td id="22,0">Katie</td><td id="22,1">Artichoke</td><td id="22,2">Spices</td><td id="22,3">Spices</td><td id="22,4">Garlic</td><td id="22,5">86</td></tr>
                        <tr id="row23"><td id="23,0">Katie</td><td id="23,1">Black Bean</td><td id="23,2">Tahini</td><td id="23,3">Artichoke</td><td id="23,4">Garlic</td><td id="23,5">345</td></tr>
                        <tr id="row24"><td id="24,0">Katie</td><td id="24,1">Roasted Pepper</td><td id="24,2">Chocolate</td><td id="24,3">Garlic</td><td id="24,4">Artichoke</td><td id="24,5">242</td></tr>
                        <tr id="row25"><td id="25,0">Katie</td><td id="25,1">Roasted Pepper</td><td id="25,2">Garlic</td><td id="25,3">Artichoke</td><td id="25,4">Jalepeno</td><td id="25,5">887</td></tr>
                        <tr id="row26"><td id="26,0">Katie</td><td id="26,1">Roasted Pepper</td><td id="26,2">Tahini</td><td id="26,3">Roasted Pepper</td><td id="26,4">Jalepeno</td><td id="26,5">223</td></tr>
                        <tr id="row27"><td id="27,0">Megan</td><td id="27,1">nil</td><td id="27,2">Oil</td><td id="27,3">Roasted Pepper</td><td id="27,4">Chocolate</td><td id="27,5">147</td></tr>
                        <tr id="row28"><td id="28,0">Megan</td><td id="28,1">Artichoke</td><td id="28,2">nil</td><td id="28,3">Spices</td><td id="28,4">Artichoke</td><td id="28,5">326</td></tr>
                        <tr id="row29"><td id="29,0">Megan</td><td id="29,1">Black Bean</td><td id="29,2">Oil</td><td id="29,3">Jalepeno</td><td id="29,4">Jalepeno</td><td id="29,5">744</td></tr>
                        <tr id="row30"><td id="30,0">Megan</td><td id="30,1">Plain</td><td id="30,2">Roasted Pepper</td><td id="30,3">Chocolate</td><td id="30,4">Garlic</td><td id="30,5">419</td></tr>
                        <tr id="row31"><td id="31,0">Megan</td><td id="31,1">Roasted Pepper</td><td id="31,2">Oil</td><td id="31,3">Spices</td><td id="31,4">Artichoke</td><td id="31,5">64</td></tr>
                        <tr id="row32"><td id="32,0">Peter</td><td id="32,1">Black Bean</td><td id="32,2">Chocolate</td><td id="32,3">Pine Nuts</td><td id="32,4">Pine Nuts</td><td id="32,5">752</td></tr>
                        <tr id="row33"><td id="33,0">Peter</td><td id="33,1">Plain</td><td id="33,2">Jalepeno</td><td id="33,3">Tahini</td><td id="33,4">Tahini</td><td id="33,5">315</td></tr>
                        <tr id="row34"><td id="34,0">Ryan</td><td id="34,1">Artichoke</td><td id="34,2">Oil</td><td id="34,3">nil</td><td id="34,4">Tahini</td><td id="34,5">nil</td></tr>
                        <tr id="row35"><td id="35,0">Ryan</td><td id="35,1">Artichoke</td><td id="35,2">Tahini</td><td id="35,3">Oil</td><td id="35,4">Roasted Pepper</td><td id="35,5">372</td></tr>
                        <tr id="row36"><td id="36,0">Ryan</td><td id="36,1">Black Bean</td><td id="36,2">Spices</td><td id="36,3">Artichoke</td><td id="36,4">Garlic</td><td id="36,5">185</td></tr>
                        <tr id="row37"><td id="37,0">Stephen</td><td id="37,1">nil</td><td id="37,2">Chocolate</td><td id="37,3">Garlic</td><td id="37,4">Chocolate</td><td id="37,5">782</td></tr>
                        <tr id="row38"><td id="38,0">Stephen</td><td id="38,1">nil</td><td id="38,2">Pine Nuts</td><td id="38,3">Oil</td><td id="38,4">nil</td><td id="38,5">770</td></tr>
                        <tr id="row39"><td id="39,0">Stephen</td><td id="39,1">Artichoke</td><td id="39,2">Artichoke</td><td id="39,3">nil</td><td id="39,4">Artichoke</td><td id="39,5">37</td></tr>
                        <tr id="row40"><td id="40,0">Stephen</td><td id="40,1">Plain</td><td id="40,2">Jalepeno</td><td id="40,3">nil</td><td id="40,4">Spices</td><td id="40,5">83</td></tr>
                        <tr id="row41"><td id="41,0">Stephen</td><td id="41,1">Roasted Pepper</td><td id="41,2">Pine Nuts</td><td id="41,3">Chocolate</td><td id="41,4">Artichoke</td><td id="41,5">837</td></tr>
                        <tr id="row42"><td id="42,0">Stephen</td><td id="42,1">Roasted Pepper</td><td id="42,2">Spices</td><td id="42,3">Garlic</td><td id="42,4">Pine Nuts</td><td id="42,5">945</td></tr>
                        <tr id="row43"><td id="43,0">Sydney</td><td id="43,1">Plain</td><td id="43,2">Artichoke</td><td id="43,3">Artichoke</td><td id="43,4">Roasted Pepper</td><td id="43,5">532</td></tr>
                        <tr id="row44"><td id="44,0">Will</td><td id="44,1">Plain</td><td id="44,2">Jalepeno</td><td id="44,3">Pine Nuts</td><td id="44,4">Roasted Pepper</td><td id="44,5">67</td></tr>
                        <tr id="row45"><td id="45,0">Will</td><td id="45,1">Roasted Pepper</td><td id="45,2">Pine Nuts</td><td id="45,3">Garlic</td><td id="45,4">nil</td><td id="45,5">860</td></tr>
                        <tr id="row46"><td id="46,0">Zack</td><td id="46,1">Artichoke</td><td id="46,2">Oil</td><td id="46,3">Pine Nuts</td><td id="46,4">Spices</td><td id="46,5">715</td></tr>
                        <tr id="row47"><td id="47,0">Zack</td><td id="47,1">Black Bean</td><td id="47,2">nil</td><td id="47,3">Artichoke</td><td id="47,4">Jalepeno</td><td id="47,5">942</td></tr>
                        <tr id="row48"><td id="48,0">Zack</td><td id="48,1">Plain</td><td id="48,2">Garlic</td><td id="48,3">Roasted Pepper</td><td id="48,4">Roasted Pepper</td><td id="48,5">33</td></tr>
                        <tr id="row49"><td id="49,0">Zack</td><td id="49,1">Roasted Pepper</td><td id="49,2">Jalepeno</td><td id="49,3">Oil</td><td id="49,4">nil</td><td id="49,5">257</td></tr>`;
}

sampleData();