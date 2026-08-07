let btn = document.getElementById("btn");

let students = [];

btn.onclick = function () {

    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;

    let physics = Number(document.getElementById("physics").value);
    let chemistry = Number(document.getElementById("chemistry").value);
    let maths = Number(document.getElementById("maths").value);

    let average = (physics + chemistry + maths) / 3;

    students.push({
        name: name,
        roll: roll,
        average: average
    });

    let topper = students[0];

    for (let i = 1; i < students.length; i++) {
        if (students[i].average > topper.average) {
            topper = students[i];
        }
    }

    let output = `
    <h2 id="head">Student Info :</h2>
    <h3>Topper : ${topper.name} (${topper.average.toFixed(2)})</h3>

    <table border="1" cellspacing="0" cellpadding="10">
        <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Average</th>
        </tr>
`;

    for (let i = 0; i < students.length; i++) {
        output += `
        <tr>
            <td>${students[i].name}</td>
            <td>${students[i].roll}</td>
            <td>${students[i].average.toFixed(2)}</td>
        </tr>
    `;
    }

    output += `</table>`;
    document.getElementById("result").innerHTML = output;
};