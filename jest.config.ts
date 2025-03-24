import type { Config } from "@jest/types";
// Sync object
const jestConfig: Config.InitialOptions = {
  verbose: true,
  transform: {
    "\\.tsx?$": [
      "ts-jest",
      {
        "useESM": true
      }
    ],
    '\\.jsx?$': ['babel-jest', {plugins: ['@babel/plugin-transform-modules-commonjs'], "useESM": true}]
  },
  moduleNameMapper: {
    "^@bp/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  resetMocks: true,
  modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/dist/"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/test/", "<rootDir>/build/", "<rootDir>/dist/"]
};
export default jestConfig;
