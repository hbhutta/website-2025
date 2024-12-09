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

// var count = 0;
// var nRepos = 0;

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

  /*
   * This statement should already be loaded,
   * the only thing we should wait for is count and nRepos
   *
   * e.g.
   *
   * While we are still waiting for count and nRepos,
   * the message should be:
   *
   * Haad has made written X lines of code over Y commits in Z repositories since August, 2022.
   *
   * But the moment count and nRepos have values,
   * this message should be updated.
   *
   * https://stackoverflow.com/questions/11528132/determining-whether-the-window-has-loaded-without-using-any-global-variables
   * There is still the possibility that
   * even though count and nRepos have been set,
   * the page still has not loaded (for whatever reason),
   * so it would still be safest to first make sure
   * that the page has been set before
   * trying to get an element by id (since
   * if the page has not loaded, this element will not yet exist)
   */
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has written ${insertionCount} lines of code over ${commitCount} commits in ${repoCount} repositories since August, 2022`;
  }
});
