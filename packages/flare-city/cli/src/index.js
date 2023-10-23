#! /usr/bin/env node
import { program } from "commander";
import { commandTest } from "./command.test.js";
// add the commands
program.name("flare-city");
program.addCommand(commandTest);
program.parseAsync(process.argv);
