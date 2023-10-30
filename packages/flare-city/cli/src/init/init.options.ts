import { Option } from "commander";

export type InitOptions = {
  name?: string;
  description?: string;
  location?: string;
};

export const initOptionProjectName = new Option(
  "-n, --name <name>",
  "The Flare City project name"
);

export const initOptionProjectDescription = new Option(
  "-d, --description <description>",
  "The Flare City project description"
);

export const initOptionProjectLocation = new Option(
  "-l, --location <location>",
  "The relative location to the current working directory where the project will be bootstrapped"
);
