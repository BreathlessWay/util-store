import chalk from "chalk";

export const log = function (...text: unknown[]) {
  console.log(chalk.blue(text));
};

export const error = function (error: Error) {
  console.log(chalk.red(error.stack));
};

export const warn = function (...text: unknown[]) {
  console.log(chalk.yellow(text));
};
