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

async function getRepoNames() {
  let response = await fetch("https://api.github.com/users/hbhutta/repos");
  let value = await response.json()
  return value;
}

async function getCommits(repoName) {
  let response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: "hbhutta",
    repo: repoName,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return response;
}

async function getInsertionCount(repoName, commitRef) {
  let response = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: "hbhutta",
      repo: repoName,
      ref: commitRef,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
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
  res.send(repoNamesJSON);
});

app.get("/commits", async (req, res) => {
  let commitsJSON = await getCommits(req.query.repoName);
  res.send(commitsJSON);
});

app.get("/insertionCount", async (req, res) => {
  let insertionCountJSON = await getInsertionCount(
    req.query.repoName,
    req.query.commitRef
  );
  res.send(insertionCountJSON);
});

// Development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
