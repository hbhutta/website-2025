import path from "path";
import express from "express";
import "dotenv/config.js";
import { Octokit } from "octokit";
const __dirname = path.resolve();
const app = express();

const octokit = new Octokit({
  userAgent: "hbhutta",
  auth: process.env.TOKEN,
});

app.use(express.static(__dirname + "/public"));

function logger(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}
app.use(logger);

/**
 * Use sessionStorage to store JSON payload for big API calls
 * to avoid making redundant calls and getting the same information.
 *
 * Have a function that runs only once when the server starts,
 * and retrieves the necessary information.
 *
 * This was we only make API calls when necessary
 *
 * Chain fetch() calls by passing response from the previous call to the next call
 *
 * https://api.github.com/users/hbutta/repos
 * https://api.github.com/repos/hbhutta/xe-mri/commits
 */

/**
 * We need to retrieve repo names on refresh since
 * a new repo could be made at any time.
 *
 * We also need to recount the number of commits in
 * all repos upon refresh as this can change any time.
 *
 *
 * With the above scheme, we make R + 1 API calls
 * every time the user refreshes the index view,
 * where R is the number of repositories
 *
 * But what about live reload?
 *
 * How about we add some kind of listener
 * to our chosen web entities (the API URLS)
 * and if there is any change in their content,
 * we update displayed commit count, regardless
 * of whether or not the user refreshes the website.
 *
 * This is how it should be... because the user
 * may not refresh the website for, say,
 * five whole minutes, and in that span,
 * there could be ten new commits to any
 * repository.
 *
 * How does client-side and server-side rendering relate to this?
 */
// https://api.github.com/users/hbhutta/repos
async function getRepoCount() {
  try {
    const result = await fetch("https://api.github.com/users/hbhutta/repos", {
      method: "GET",
    });
    const json = await result.json();
    console.log(json);
    let repoCountJSON = {
      repoCount: json.length,
      repoNames: json.map((element) => element["name"]),
    };
    return repoCountJSON;
  } catch (error) {
    console.error(`Unable to get repoCount`);
    return null;
  }
}

// async function getRepoCount() {
//   try {
//     const result = await octokit.request("GET /re", {
//       owner: "hbhutta",
//       headers: {
//         'X-GitHub-Api-Version': '2022-11-28'
//       }
//     })
//     const json = await result.json();
//     console.log(json);
//     let repoCountJSON = {
//       repoCount: json.length,
//       repoNames: json.map((element) => element["name"]),
//     };
//     return repoCountJSON;
//   } catch (error) {
//     console.error(`Unable to get repoCount`);
//     return null;
//   }
// }
//

async function getCommitCount(repoName) {
  try {
    console.log(`Counting commits in ${repoName}...`);

    const response = await fetch(
      `https://api.github.com/repos/hbhutta/${repoName}/commits`
    );

    const json = await response.json();
    let commitCountJSON = {
      commitCount: json.length,
    };
    console.log(`${repoName} has ${commitCountJSON["commitCount"]} commits`);
    return commitCountJSON;
  } catch (error) {
    console.error(`Unable to get commitCount`);
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

app.get(
  "/commitCount",
  async (req, res, next) => {
    const repoName = req.query.repoName;
    let commitCountJSON = await getCommitCount(repoName);
    res.locals.commitCountJSON = commitCountJSON;
    next();
  },
  (req, res) => {
    res.send(res.locals.commitCountJSON);
  }
);

app.get(
  "/repoCount",
  async (req, res, next) => {
    let repoCountJSON = await getRepoCount();
    res.locals.repoCountJSON = repoCountJSON;
    next();
  },
  (req, res) => {
    res.send(res.locals.repoCountJSON);
  }
);

// Development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
