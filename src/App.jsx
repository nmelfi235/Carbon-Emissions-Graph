import { useEffect, useState } from "react";
import "./App.css";
import LineGraph from "./components/LineGraph";

const fetchData = async (username, pswd) => {
  console.log(username, pswd);
  const url =
    "https://webservices.iso-ne.com/api/v1.1/genfuelmix/day/20250129.json";
  const headers = new Headers();
  headers.append("Authorization", `Basic ${btoa(`${username}:${pswd}`)}`);

  return await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: headers,
  });
};

function App() {
  const [data, setData] = useState([]); // Data will be an array of objects
  const [username, setUsername] = useState("");
  const [pswd, setPswd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(username, pswd).then((d) => console.log(d));
  };

  return (
    <>
      <label htmlFor="username-input">Username:</label>
      <input
        type="text"
        id="username-input"
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password-input">Password:</label>
      <input
        type="password"
        id="password-input"
        onChange={(e) => setPswd(e.target.value)}
      />
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
      <LineGraph data={data} />
    </>
  );
}

export default App;
