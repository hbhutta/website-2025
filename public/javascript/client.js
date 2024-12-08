async function requestRepoNames() {
  const result = await fetch("http://localhost:3000/repoName");
  if (!result.ok) {
    return null;
  }
  const json = await result.json();
  return json;
}

async function requestCommitCount(repoName) {
  const result = await fetch(`http://localhost:3000/commitCount?repoName=${repoName}`);
  if (!result.ok) {
    return null;
  }
  const json = await result.json();
  return json;
}

let repoNames = null;
(async () => {
  let repoNamesResolution = await requestRepoNames(); // Wait for the promise to resolve
  repoNames = JSON.parse(repoNamesResolution); // Parse the resolved promise
});
console.log(repoNames)




// let commitCountResult = requestCommitCount();
// let commitCount = JSON.parse(commitCountResult);

window.onload = () => {
  if (document.getElementById("git-stats"))
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has made ${-1} commits in ${repoNames.length} repositories since August, 2022`;
};
