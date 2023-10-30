#! /usr/bin/env node
import { program } from "commander";
import { commandTest } from "./command.test.js";
import { commandInit } from "./init/init.command.js";

// add the commands
program.name("flare-city");
program.addCommand(commandTest);
program.addCommand(commandInit);

program.parseAsync(process.argv);
