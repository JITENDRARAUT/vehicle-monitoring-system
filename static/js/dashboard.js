const ws =
new WebSocket("ws://localhost:8000/ws");

const speed =
document.getElementById("speed");

const fuel =
document.getElementById("fuel");

const engine =
document.getElementById("engine");

const temp =
document.getElementById("temp");

const alertList =
document.getElementById("alertList");

const map =
L.map("map")
.setView([27.7172,85.3240],13);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let marker =
L.marker([27.7172,85.3240])
.addTo(map);

const labels = [];
const speedData = [];

const chart =
new Chart(
document.getElementById("speedChart"),
{
type:"line",

data:{
labels:labels,

datasets:[{
label:"Vehicle Speed",
data:speedData,
borderWidth:3
}]
},

options:{
responsive:true
}
}
);

ws.onmessage = (event)=>{

const data =
JSON.parse(event.data);

speed.innerText =
data.speed + " km/h";

fuel.innerText =
data.fuel + "%";

engine.innerText =
data.engine;

temp.innerText =
data.temperature + "°C";

marker.setLatLng(
[data.latitude,data.longitude]
);

map.panTo(
[data.latitude,data.longitude]
);

labels.push(data.time);

speedData.push(data.speed);

if(labels.length > 20){

labels.shift();
speedData.shift();

}

chart.update();

if(data.speed > 100){

let li =
document.createElement("li");

li.innerText =
`Overspeed Alert: ${data.speed} km/h`;

alertList.prepend(li);

}

};