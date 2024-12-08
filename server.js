import path from "path";
import express from "express";
import "dotenv/config.js";
import { Octokit } from "octokit";

const __dirname = path.resolve();
const app = express();

const octokit = new Octokit({
  auth: process.env.GHP,
});

app.use(express.static(__dirname + "/public"));

function logger(req, res, next) {
  console.log(`${req.ip} sent a ${req.method} request to ${req.path}`);
  next();
}
app.use(logger);

async function getSomething(URL) {
  let response = await fetch(URL);
  let value = await response.json();
  return value;
}

async function getRepoNames() {
  return getSomething("https://api.github.com/users/hbhutta/repos");
}

async function getCommitCount(repoName) {
  console.log(repoName);
  let response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: "hbhutta",
    repo: repoName,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return response;
}

app.get("/", (req, res) => {
  let options = {
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile(__dirname + "/views/home/index.html", options);
});

app.get("/repoNames", async (req, res) => {
  let repoNamesJSON = await getRepoNames();
  console.log(repoNamesJSON);
  res.send(repoNamesJSON);
});

app.get("/commitCount", async (req, res) => {
  let commitCountJSON = await getCommitCount(req.query.repoName);
  console.log(commitCountJSON);
  console.log(req.query.repoName);

  if (commitCountJSON == null) {
    res.send(null);
  }
  res.send(commitCountJSON);
});

// Development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
