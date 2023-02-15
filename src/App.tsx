import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Dropzone from "./Dropzone";

const API_BASE_URL =
  "https://tfje65qvs2.execute-api.us-east-1.amazonaws.com/dev";

const uploadFile = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  const r = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await r.json();
  return data.filename;
};

const generateThumbnails = async (filename: string, seconds: number) =>
  fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    body: JSON.stringify({
      filename,
      seconds,
    }),
  });

const getThumbnails = async (filename: string) => {
  const r = await fetch(`${API_BASE_URL}/thumbnails/${filename}`, {
    method: "GET",
  });
  const data = await r.json();
  return data;
};

function App() {
  const [images, setImages] = useState([]);
  const [seconds, setSeconds] = useState(5);
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await generateThumbnails(filename, seconds);

      const thumbnailsData = await getThumbnails(filename);
      setImages(thumbnailsData);
      setIsLoading(false);
    };

    if (filename) {
      init();
    }
  }, [filename, seconds]);

  const onDrop = useCallback(async (acceptedFiles) => {
    // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
    if (!acceptedFiles[0]) {
      return;
    }

    try {
      setIsLoading(true);
      const filename = await uploadFile(acceptedFiles[0]);
      setIsLoading(false);
      setFilename(filename);
    } catch (error) {}
  }, []);

  return (
    <div className="App">
      <h1>Welcome To Thumbnailer</h1>
      <div>
        <label>
          Generate Every X Seconds:
          <input
            style={{ marginBottom: 10 }}
            type="number"
            value={seconds}
            onChange={(event) => {
              const v = event.target.value;
              setSeconds(parseInt(v));
            }}
          />
          default is 5
        </label>

        <Dropzone onDrop={onDrop} accept={{ "video/*": [] }} />

        {isLoading ? (
          <h1>Loading</h1>
        ) : (
          <ul style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
            {images.map((i, k) => (
              <li>
                <img src={i.url} alt={`${k}`} key={k} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
