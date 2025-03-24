#!/usr/bin/env node

import GHAArgsParser from "@bp/service/args/gha/gha-args-parser.js";
import Runner from "@bp/service/runner/runner.js";

// create CLI arguments parser
const parser = new GHAArgsParser();

// create runner
const runner = new Runner(parser);

runner.run();