// Request the server to get the repoCount

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestRepoCount() {
  const result = await fetch("http://localhost:3000/repoCount");
  if (!result.ok) {
    if (!localStorage.getItem("repoCount")) {
      return null;
    }
  } else {
    const json = await result.json();
    localStorage.setItem("repoCount", JSON.stringify(json["repoCount"]));
    localStorage.setItem("repoNames", JSON.stringify(json["repoNames"]));
  }
}

async function requestCommitCount(repoName) {
  const result = await fetch(
    `http://localhost:3000/commitCount?repoName=${repoName}`
  );
  if (!result.ok) {
    if (!localStorage.getItem("commitCount")) {
      return null;
    }
  } else {
    const json = await result.json();
    localStorage.setItem("commitCount", JSON.stringify(json["commitCount"]));
  }
  return Number(JSON.parse(localStorage.getItem("commitCount")));
}

requestRepoCount();
/*
const repoNames = JSON.parse(localStorage.getItem("repoNames"));
let commitCounts = [];

async function storeCommitCount(repoName) {
  try {
    let commitCount = await requestCommitCount(repoName);
    if (repoName == "undefined") {
      throw new Error("repoName is undefined");
    }
  } catch (error) {
    console.error(error);
  }
  commitCounts.push(commitCount);
}

for (let i = 0; i < repoNames.length; i++) {
  storeCommitCount(repoNames[i]);
}

console.log(commitCounts);
localStorage.setItem(
  "totalCommitCount",
  JSON.stringify(
    commitCounts.reduce((acc, next) => {
      return acc + next;
    }, 0)
  )
);
*/
console.log(`repo count: ${JSON.parse(localStorage.getItem("repoCount"))}`);

// When the window has loaded,...
window.onload = () => {
  let repoCount = Number(JSON.parse(localStorage.getItem("repoCount")));
  let totalCommitCount = Number(JSON.parse(localStorage.getItem("totalCommitCount")));
  
  if (document.getElementById("git-stats")) {
    document.getElementById(
      "git-stats"
    ).innerHTML = `Haad has made ${totalCommitCount} commits in ${repoCount} repositories since August, 2022`;
  }
};

// document.getElementById("git").innerHTML = `Haad has made X commits in ${repoCount} repositories since August, 2022`
