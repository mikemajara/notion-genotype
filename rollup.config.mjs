import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import rollupJson from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  external: ["fs", "@notionhq/client"],
  plugins: [typescript(), commonjs(), resolve(), rollupJson()],
};
