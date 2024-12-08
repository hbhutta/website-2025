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

(async () => {
  repoNames = await requestRepoNames();
  let totalCommitCount = 0;
  console.log(repoNames);
  console.log("before");
  console.log(repoNames);
  for (let i = 0; i < repoNames.length; i++) {
    console.log(repoNames[i]);
    totalCommitCount += await requestCommitCount(repoNames[i]);
    console.log(totalCommitCount);
  }
  console.log("after");
  console.log(totalCommitCount);
})();

/*
window.onload = () => {
  if (document.getElementById("git-stats")) {
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has made ${-1} commits in ${repoNames} repositories since August, 2022`;
  }
}
*/
