#!/usr/bin/env node

import CLIArgsParser from "@bp/service/args/cli/cli-args-parser.js";
import Runner from "@bp/service/runner/runner.js";

// create CLI arguments parser
const parser = new CLIArgsParser();

// create runner
const runner = new Runner(parser);

runner.run();