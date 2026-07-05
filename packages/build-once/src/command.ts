import { CommandOptions } from "./types";
import { error } from "./feedback";

export async function getCommand(): Promise<CommandOptions> {
  const { program } = await import("commander");
  program.requiredOption(
    "-n, --script <script>",
    "name of the script configuration",
  );
  program.option("-d, --debug", "outputs debugging information");
  program.parse(process.argv);
  const opts = program.opts();
  const script = `${opts.script}`;
  const debug: boolean = opts.debug === true;
  if (!script) {
    error(`Missing --script parameter`);
  }
  return { script, debug };
}
