const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      repository: core.getInput("repository"),
      issueNumber: core.getInput("issue-number"),
      commentAuthor: core.getInput("comment-author"),
      bodyIncludes: core.getInput("body-includes"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const repository = inputs.repository
      ? inputs.repository
      : process.env.GITHUB_REPOSITORY;
    const [owner, repo] = repository.split("/");
    core.debug(`repository: ${repository}`);

    const octokit = github.getOctokit(inputs.token);
    
    let results = await octokit.search.issues({
       q: `${inputs.bodyIncludes}+repo:${owner}/${repo}`,
       per_page: 1
    }); 
   
    core.debug('Teste: Teste');
    core.debug(`results: ${inspect(results)}`);
    
    if (results.data.items[0].title == inputs.bodyIncludes){
          core.setOutput("issue-id", results.data.items[0].number)
       }else{
          core.setOutput("issue-id", "")
       } 
}

run();
