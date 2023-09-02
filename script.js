const devicesListContainer = document.getElementById("devices-list");
const devicesList = document.getElementsByClassName("device-info");
const actionBtnsList = document.getElementById("action-btns");
const videoEl = document.getElementById("video");
const imageEL = document.getElementById("image");
const canvasEL = document.getElementById("canvas");
const btnStop = document.getElementById("stop-btn");



let activeScannerID = "";
let streamObj = null;
let imageData = null;

const width = 1023;
const height = 510;

const scanDevices = async () => {
  try {
    const mdi = await navigator.mediaDevices.enumerateDevices();
    console.log(mdi);
    listDevices(mdi.filter((input) => input.kind === "videoinput"));
  } catch (e) {
    console.error(e);
  } finally {
    console.log("Done Scanning");
  }
};

const listDevices = (devices = []) => {
  devicesListContainer.replaceChildren();

  for (const device of devices) {
    const li = document.createElement("li");
    li.classList.add("device-info");
    li.onclick = ()=> setActiveScannerId(device.deviceId, li);
    li.innerText = device.label;
    devicesListContainer.appendChild(li);
  }
};



const setActiveScannerId = (id = "", iEl) => {
  iEl.classList.add("active-list");
  activeScannerID = id;
};

const scanImage = async () => {
  if (!activeScannerID) {
    alert("Please Select A Device To Scan");
    return;
  }

  try {
    const stopBtn = document.getElementById("stop-btn");
    if(stopBtn === null){
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: activeScannerID,
        width,
        height,
      },
    });
    createStopBtn();
    videoEl.classList.remove("display-none");
    imageEL.classList.add("display-none");
    streamObj = stream;
    videoEl.srcObject = stream;
    videoEl.play();}

  } catch (e) {
    alert("Sorry Scan Fails");
    console.error(e);
  } finally {
    console.log("Scanning Done");
  }
};

const createStopBtn = () => {
  const stopBtn = document.createElement("div");
  stopBtn.classList.add("buttonStop");
  stopBtn.id = "stop-btn";
  stopBtn.innerText = "Stop Scanning";

  stopBtn.addEventListener("click", () => {
    stopScanning();
  });

  actionBtnsList.appendChild(stopBtn);
};

const stopScanning = () => {
  takePicture();

  const tracks = streamObj.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  alert("Scanning Has Stop");

  const stopBtn = document.getElementById("stop-btn");
  actionBtnsList.removeChild(stopBtn);
};

const takePicture = () => {
  const context = canvasEL.getContext("2d");
  canvasEL.width = width;
  canvasEL.height = height;
  context.drawImage(videoEl, 0, 0, width, height);

  const data = canvasEL.toDataURL("image/png");
  imageEL.setAttribute("src", data);

  imageData = data;

  displayImage();
};

const displayImage = () => {
  videoEl.classList.add("display-none");
  imageEL.classList.remove("display-none");
};

const downloadImage = async() => {
  var MIME_TYPE = "image/png";
  var dlLink = document.createElement("a");
  dlLink.download = "scanner";
  dlLink.href = imageData;
  dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(
    ":"
  );

  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
  alert('downloaded successfully')
};
