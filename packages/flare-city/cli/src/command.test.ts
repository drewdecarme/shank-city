import { Command } from "commander";
import { dirname } from "path";

import { fileURLToPath } from "url";

export const commandTest = new Command("test").description(
  "Run the flare city testing module to execute integration tests"
);

const __dirname = dirname(fileURLToPath(import.meta.url));

commandTest
  //   .addCommand(commandTestReset)
  // adding options sequentially like this will enable them for commands added
  // below it. In this case, get and seed will be able to access the options
  // added after this comment
  //   .addOption(optionEnv)
  //   .action((args) => {
  //     validateOptionEnv(args);
  //   })
  .parseAsync(process.argv);
