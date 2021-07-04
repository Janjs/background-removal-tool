import './App.css';
import React, { useState } from "react";
import Base64 from "./Base64";
import { isEmpty } from './Utils';

function App() {
  const [picture, setPicture] = useState({});
  const [picturePreview, setPicturePreview] = useState({});
  const [pictureBGRemoved, setPictureBGRemoved] = useState({});
  const [pictureBGMask, setPictureBGMask] = useState({});
  const [loading, setLoading] = useState(false);

  const uploadPicture = (e) => {
    setPicture(e.target.files[0])
    setPicturePreview(URL.createObjectURL(e.target.files[0]))
  };

  async function onRemoveBackground() {
    setLoading(true)
    var formData = new FormData()
    formData.append('data', picture);

    const resp = await fetch("/removebg", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      console.log("> converting...");
      const buffer = await res.arrayBuffer();
      const base64Flag = "data:image/png;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    });

    const mask = await fetch("/removebgmask", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      console.log("> converting...");
      const buffer = await res.arrayBuffer();
      const base64Flag = "data:image/png;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    });

    setPictureBGRemoved(resp)
    setPictureBGMask(mask)
    setLoading(false)
  };

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return Base64.btoa(binary);
  }

  return (
    <div className="App">
      <h1>Background Removal Tool</h1>
      <br/>
      <input type="file" name="image" onChange={uploadPicture} />
      <br />
      {!isEmpty(picturePreview) && <img src={picturePreview} width="auto" height="300" alt="preview"></img>}
      <br />
      {!isEmpty(picturePreview) && <button onClick={onRemoveBackground}>Remove Background</button>}
      <br />
      {loading && <p>Removing background...</p>}
      {!isEmpty(pictureBGMask) && <img src={pictureBGMask} width="auto" height="300" alt="output"></img>}
      {!isEmpty(pictureBGRemoved) && <img src={pictureBGRemoved} width="auto" height="300" alt="output"></img>}
    </div>
  );
}

export default App;
