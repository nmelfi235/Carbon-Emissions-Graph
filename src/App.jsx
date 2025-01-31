import { useEffect, useState } from "react";
import "./App.css";
import LineGraph from "./components/LineGraph";

const scaleFactors = {
  "": 1,
  Refuse: 0.02638,
  Wood: 0.01946,
  Coal: 0.01733,
  Oil: 0.01478,
  "Landfill Gas": 0.01327,
  "Natural Gas": 0.00656,
};

const fetchData = async (username, pswd) => {
  const url =
    "https://webservices.iso-ne.com/api/v1.1/genfuelmix/day/20250129.json";
  const headers = new Headers();
  headers.append("Authorization", `Basic ${btoa(`${username}:${pswd}`)}`);

  return await fetch(url, {
    headers: headers,
  }).then((res) => res.json());
};

function App() {
  const [data, setData] = useState([
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
    [{ Date: "0", FuelCategory: "Refuse", Emissions: "0" }],
  ]); // Data will be an array of objects
  const [username, setUsername] = useState("");
  const [pswd, setPswd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(username, pswd)
      .then((d) => d["GenFuelMixes"]["GenFuelMix"])
      .then((d) =>
        d.map((datum) => {
          return {
            Date: datum["BeginDate"],
            FuelCategory: datum["FuelCategory"],
            Emissions: (
              datum["GenMw"] * scaleFactors[datum["FuelCategory"]]
            ).toFixed(2),
          };
        })
      )
      .then((d) => [
        d.filter((datum) => datum["FuelCategory"] === "Refuse"),
        d.filter((datum) => datum["FuelCategory"] === "Wood"),
        d.filter((datum) => datum["FuelCategory"] === "Coal"),
        d.filter((datum) => datum["FuelCategory"] === "Oil"),
        d.filter((datum) => datum["FuelCategory"] === "Landfill Gas"),
        d.filter((datum) => datum["FuelCategory"] === "Natural Gas"),
      ])
      .then((d) => {
        const totalArr = [];
        for (let i = 0; i < d[0].length; i++) {
          let sum = 0;
          for (let j = 0; j < d.length; j++) {
            sum += parseFloat(d[j][i]["Emissions"]);
          }
          totalArr.push({
            Date: d[0][i]["Date"],
            FuelCategory: "Total",
            Emissions: sum,
          });
        }
        d.push(totalArr);
        return d;
      })
      .then((d) => setData(d))
      .then((d) => console.log(data));
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
      <LineGraph data={data} height={800} />
    </>
  );
}

export default App;
