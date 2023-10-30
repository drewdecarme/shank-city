import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { resolve, dirname, join } from "path";
import fs from "fs-extra";
import findNodeModules from "find-node-modules";

import { fileURLToPath } from "url";
import type { InitOptions } from "./init.options.js";
import {
  initOptionProjectDescription,
  initOptionProjectLocation,
  initOptionProjectName,
} from "./init.options.js";
import { glob } from "glob";
import handlebars from "handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const commandInit = new Command("init").description(
  "Bootstrap a new FlareCity API project."
);

async function init(params: InitOptions) {
  const projectName =
    params?.name ||
    (await input({
      message: "What do you want to name your project?",
      default: "app-city",
    }));
  const projectDescription =
    params?.description ||
    (await input({
      message: "Please describe your project",
      default: "A serverless Cloudflare Workers API powered by FlareCity.",
    }));
  const projectLocation = !params?.location
    ? await input({
        message: "Where do you want to create your project?",
        default: resolve(process.cwd(), `./${projectName}`),
      })
    : join(process.cwd(), params.location, projectName);

  const template = await select({
    message: "Please select a template",
    choices: [
      {
        name: "with-sample-route",
        description:
          "A simple example that contains 1 route with 2 endpoints at `/sample`.",
        value: "with-sample-route",
      },
    ],
  });

  const nodeModulesDirs = findNodeModules({ cwd: __dirname });
  const packageDir = `@flare-city/example-${template}`;

  const srcDir = nodeModulesDirs.reduce((accum, nodeModuleDir) => {
    const fullNodeModuleDirPath = resolve(__dirname, nodeModuleDir);
    const packagePath = fullNodeModuleDirPath.concat(`/${packageDir}`);
    const doesPathExist = fs.existsSync(packagePath);

    if (doesPathExist) {
      return packagePath;
    }
    return accum;
  }, "");

  if (!srcDir) {
    throw new Error(`Cannot locate "${packageDir}"`);
  }

  const filesTs = resolve(srcDir, `./**/*.ts`);
  const filesLint = resolve(srcDir, `./.eslintrc.cjs`);
  const filesGit = resolve(srcDir, `./.gitignore`);
  const filesJson = resolve(srcDir, `./*.json`);
  const filesToml = resolve(srcDir, `./*.toml`);

  const outputDir = projectLocation;

  // 2. Process TS files
  const filesToProcess = glob.sync([
    filesTs,
    filesLint,
    filesGit,
    filesJson,
    filesToml,
  ]);

  console.log("Processing and transforming template...");
  filesToProcess.forEach((sourcePath) => {
    const filePath = sourcePath.split(template)[1]; // Extract relative file path from the source path
    const outputPath = `${outputDir}${filePath}`;

    let existingContent = fs.readFileSync(sourcePath, "utf-8");
    existingContent = existingContent.replace(
      new RegExp(`@flare-city/example-${template}`, "g"),
      `{{projectName}}`
    );
    existingContent = existingContent.replace(
      new RegExp(`example-${template}-project-name`, "g"),
      `{{projectName}}`
    );
    existingContent = existingContent.replace(
      new RegExp(`example-${template}-project-description`, "g"),
      `{{projectDescription}}`
    );
    existingContent = existingContent.replace(
      new RegExp(`workspace:`, "g"),
      `latest`
    );

    // Compile the Handlebars template if it exists
    const compiledTemplate = existingContent
      ? handlebars.compile(existingContent)
      : undefined;

    // Replace placeholders with actual values
    const replacedContent = compiledTemplate
      ? compiledTemplate({ projectName, projectDescription })
      : existingContent;

    // Write the new TypeScript file
    fs.ensureFileSync(outputPath);
    fs.writeFileSync(outputPath, replacedContent);
  });

  console.log("Processing and transforming template... done.");
  console.log(
    filesToProcess.length.toString().concat(" files successfully processed.")
  );
  console.log(`
${projectName} successfully bootstrapped!

Location: ${projectLocation}

Change into the directory and run \`yarn install && yarn dev\``);
}

commandInit
  .addOption(initOptionProjectName)
  .addOption(initOptionProjectDescription)
  .addOption(initOptionProjectLocation)
  .action(init);
