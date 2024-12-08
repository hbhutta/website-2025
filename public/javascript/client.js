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

// (async () => {
//   repoNames = await requestRepoNames();
//   let totalCommitCount = 0;
//   console.log(repoNames);
//   console.log("before");
//   console.log(repoNames);
//   for (let i = 0; i < repoNames.length; i++) {
//     console.log(repoNames[i]);
//     totalCommitCount += await requestCommitCount(repoNames[i]);
//     console.log(totalCommitCount);
//   }
//   console.log("after");
//   console.log(totalCommitCount);
// })();

/*
function setOnLoad(count, names) {
  console.log("Setting window.onload()...");
  window.onload = () => {
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has made ${count} commits in ${names.length} repositories since August, 2022`;
  };
}
*/

var count = 0;
var nRepos = 0;

requestRepoNames().then(async (repoNames) => {
  nRepos = repoNames.length;
  // totalCommitCount = 0;
  for (let i = 0; i < repoNames.length; i++) {
    console.log(repoNames[i]);
    count += await requestCommitCount(repoNames[i]);
    // console.log(totalCommitCount);
    console.log(count);
  }
  document.getElementById(
    "git-stats"
  ).innerHTML = `Haad has made ${count} commits in ${nRepos} repositories since August, 2022`;
});

// console.log(count);
// console.log(nRepos);
/*
window.onload = () => {
  // console.log(123);
  document.getElementById(
    "git-stats"
  ).innerHTML = `Haad has made ${count} commits in ${nRepos} repositories since August, 2022`;
};
*/
