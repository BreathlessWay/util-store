import path from "path";

import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";

import packageJson from "./package.json";

const isDevelopment = process.env.NODE_ENV === "development",
  isProduction = process.env.NODE_ENV === "production",
  sourcemap = isDevelopment ? "inline" : false,
  extensions = [".js", ".jsx", ".es6", ".es", ".mjs", ".ts"],
  projectRootDir = path.resolve(__dirname);

const commonOutput = [
    {
      file: packageJson.browser,
      format: "iife",
      sourcemap,
      name: "zUtils",
      banner: "/*! zUtils version " + packageJson.version + " */",
      footer: "/*! Author: " + packageJson.author.name + " */",
    },
  ],
  buildOutput = [
    {
      file: packageJson.main,
      format: "cjs",
      exports: 'auto',
      sourcemap,
      banner: "/*! zUtils version " + packageJson.version + " */",
      footer: "/*! Author: " + packageJson.author.name + " */",
    },
    {
      file: packageJson.module,
      format: "es",
      exports: 'auto',
      sourcemap,
      banner: "/*! zUtils version " + packageJson.version + " */",
      footer: "/*! Author: " + packageJson.author.name + " */",
    },
  ],
  output = isProduction ? buildOutput.concat(commonOutput) : commonOutput;

export default async () => {
  return {
    input: "src/index.ts",
    output,
    plugins: [
      json(),
      commonjs(),
      babel({
        extensions,
        babelHelpers: "runtime",
        exclude: "**/node_modules/**",
      }),
      alias({
        entries: [
          {
            find: "src",
            replacement: path.resolve(projectRootDir, "src"),
          },
          {
            find: "utils",
            replacement: path.resolve(projectRootDir, "src/utils"),
          },
          {
            find: "EventSource",
            replacement: path.resolve(projectRootDir, "src/EventSource"),
          },
          {
            find: "type",
            replacement: path.resolve(projectRootDir, "src/type"),
          },
        ],
      }),
      resolve({
        extensions,
        mainFields: ["jsnext:main"],
      }),
      isProduction &&
        (await import("rollup-plugin-terser")).terser({
          output: {
            comments: /^!/,
          },
        }),
    ],
  };
};
