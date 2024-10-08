import { SezameAwsCdkAppTs } from "@joinsezame/awscdk-app-ts";
const project = new SezameAwsCdkAppTs({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  devDeps: ["@joinsezame/awscdk-app-ts", "@joinsezame/constructs"],
  name: "back",
  projenrcTs: true,
  projenVersion: "0.86.0",
  gitignore: ["*/node_modules"]

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();