import path from "path";
import express from "express";
import "dotenv/config.js";

const __dirname = path.resolve();
const app = express();

app.use(express.static(__dirname + "/public"));

function logger(req, res, next) {
  console.log(`${req.ip} sent a ${req.method} request to ${req.path}`);
  next();
}
app.use(logger);

async function getRepoNames() {
  try {
    const result = await fetch("https://api.github.com/users/hbhutta/repos");
    if (!result.ok) {
      throw new Error(`Unable to get repoNames, status code: ${result.status}`);
    }
    const json = await result.json();
    let repoNamesJSON = {
      repoNames: json.map((element) => element["name"]),
    };
    return repoNamesJSON;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCommitCount(repoName) {
  try {
    const result = await fetch(
      `https://api.github.com/repos/hbhutta/${repoName}/commits`
    );
    if (!result.ok) {
      throw new Error(
        `Unable to get commitCount, status code: ${result.status}`
      );
    }
    const json = await result.json();
    let commitCountJSON = {
      commitCount: json.length,
    };
    return commitCountJSON;
  } catch (error) {
    console.error(error);
    return null;
  }
}

app.get("/", (req, res) => {
  let options = {
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile(__dirname + "/views/home/index.html", options);
});

app.get("/commitCount", async (req, res) => {
  let commitCountJSON = await getCommitCount(req.query.repoName);
  res.send(commitCountJSON);
});

app.get("/repoNames", async (req, res) => {
  let repoNamesJSON = await getRepoNames();
  res.send(repoNamesJSON);
});

// Development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
