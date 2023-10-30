import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { resolve } from "path";
// import { dirname } from "path";

// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));

export const commandInit = new Command("init").description(
  "Bootstrap a new FlareCity API project."
);

async function init() {
  console.log("Create a new project!");
  const projectName = await input({
    message: "What do you want to name your project?",
    default: "app-city",
  });
  const projectDescription = await input({
    message: "Please describe your project",
    default: "A serverless Cloudflare Workers API powered by FlareCity.",
  });
  const projectLocation = await input({
    message: "Where do you want to create your project?",
    default: resolve(process.cwd(), `./${projectName}`),
  });
  const template = await select({
    message: "Please select a template",
    choices: [
      {
        name: "with-sample-route",
        description:
          "A simple example that contains 1 route with 2 endpoints at `/sample`.",
        value: "with-sample-route",
      },
      {
        name: "with-prisma",
        description:
          "A simple example that contains 1 route with 2 endpoints at `/sample` and integrates / bootstraps prisma",
        value: "with-prisma",
      },
    ],
  });
}

commandInit
  //   .addOption(optionEnv)
  .action(init);
