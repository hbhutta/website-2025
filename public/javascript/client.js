async function requestRepoNames() {
  let response = await fetch("http://localhost:3000/repoNames");
  let value = await response.json();
  return value.map((repo) => repo["name"]);
}

async function requestCommitCount(repoName) {
  let response = await fetch(
    `http://localhost:3000/commitCount?repoName=${repoName}`
  );
  if (response == null) {
    return 0;
  }
  let value = await response.json();
  return value["data"].length;
}

var count = 0;
var nRepos = 0;

requestRepoNames().then(async (repoNames) => {
  nRepos = repoNames.length;
  for (let i = 0; i < repoNames.length; i++) {
    console.log(repoNames[i]);
    count += await requestCommitCount(repoNames[i]);
    console.log(count);
  }

  /**
   * This statement should already be loaded,
   * the only thing we should wait for is count and nRepos
   *
   * e.g.
   *
   * While we are still waiting for count and nRepos,
   * the message should be:
   *
   * Haad has made 0 commits in 0 repositories since August, 2022.
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
    ).innerHTML = `Haad has made ${count} commits in ${nRepos} repositories since August, 2022`;
  }
});
