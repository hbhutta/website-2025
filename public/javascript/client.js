async function requestSomething(URL, callback) {
  let response = await fetch(URL);
  let value = await response.json();
  return callback(value);
}

async function requestRepoNames() {
  return requestSomething(`http://localhost:3000/repoNames`, (value) => {
    return value.map((repo) => repo["name"]);
  });
}

async function requestCommits(repoName) {
  return requestSomething(
    `http://localhost:3000/commits?repoName=${repoName}`,
    (value) => {
      return value["data"].map((element) => element["sha"]);
    }
  );
}

async function requestInsertionCount(repoName, commitRef) {
  return requestSomething(
    `http://localhost:3000/insertionCount?repoName=${repoName}&commitRef=${commitRef}`,
    (value) => {
      return value["data"]["stats"]["total"];
    }
  );
}

requestRepoNames().then(async (repoNames) => {
  let repoCount = repoNames.length;
  let commitCount = 0;
  let insertionCount = 0;

  for (let i = 0; i < repoCount; i++) {
    console.log(`Repository: ${repoNames[i]}`);
    let refs = await requestCommits(repoNames[i]);
    console.log(`Current commit count: ${commitCount}`);
    commitCount += refs.length;

    for (let j = 0; j < refs.length; j++) {
      console.log(`Commit: ${refs[j]}`);
      console.log(`Current insertion count: ${insertionCount}`);
      insertionCount += await requestInsertionCount(repoNames[i], refs[j]);
    }
  }
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has written ${insertionCount} lines of code across ${commitCount} commits in ${repoCount} repositories since August, 2022`;
  }
});
