import path from "path";

import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

import packageJson from "./package.json";

const isDevelopment = process.env.NODE_ENV === "development",
  isProduction = process.env.NODE_ENV === "production",
  sourcemap = isDevelopment ? "inline" : false,
  extensions = [".js", ".jsx", ".es6", ".es", ".mjs", ".ts"],
  projectRootDir = path.resolve(__dirname);

const input = "src/index.ts";
const umdOutput = [
    {
      file: packageJson.browser,
      format: "umd",
      name: 'zUtils',
      sourcemap,
      banner: "/*! zUtils version " + packageJson.version + " */",
      footer: "/*! Author: " + packageJson.author.name + " */",
    },
  ],
  cjsOutput = {
    file: packageJson.main,
    format: "cjs",
    exports: "auto",
    sourcemap,
    banner: "/*! zUtils version " + packageJson.version + " */",
    footer: "/*! Author: " + packageJson.author.name + " */",
  },
  esOutput = {
    file: packageJson.module,
    format: "es",
    exports: "auto",
    sourcemap,
    banner: "/*! zUtils version " + packageJson.version + " */",
    footer: "/*! Author: " + packageJson.author.name + " */",
  };

const babelPlugin = babel({
  extensions,
  babelHelpers: "runtime",
  exclude: "**/node_modules/**",
});

const plugins = [
  json(),
  commonjs(),
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
    terser({
      output: {
        comments: /^!/,
      },
    }),
];

export default [
  {
    input,
    output: umdOutput,
    plugins: plugins.concat(babelPlugin),
  },
  {
    input,
    output: cjsOutput,
    plugins: plugins.concat(babelPlugin),
  },
  {
    input,
    output: esOutput,
    plugins: plugins.concat(typescript({
      tsconfig: './tsconfig.json'
    })),
  },
];
