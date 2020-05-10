import * as execa from "execa";
import { CommandOptions, CommandResult, Configuration } from "./types";
import { debug, error, info } from "./feedback";

const SIGTERM = "SIGTERM";

export async function executeCommand(
  config: Configuration,
  command: CommandOptions
): Promise<CommandResult> {
  const cmd = `${config.command} run ${command.script}`;
  info(`Executing "${cmd}"`);
  const subprocess = execa(config.command, ["run", command.script]);
  if (!subprocess) {
    error(`Could not start "${cmd}"`);
    return { success: false };
  }
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);
  const kill = (): void => {
    debug(`Killed command ${SIGTERM}: "${cmd}"`);
    subprocess.kill(SIGTERM, {
      forceKillAfterTimeout: 2000,
    });
  };
  process.on(SIGTERM, kill);
  try {
    const result = await subprocess;
    info(`Completed successfully: "${cmd}"`);
    return { success: true, exitCode: result.exitCode };
  } catch (e) {
    if (e.code) {
      error(`Terminated with error ${e.code}: "${cmd}"`);
      return { success: false };
    } else {
      error(`Terminated with error: "${cmd}"`);
      return { success: false, exitCode: e.code };
    }
  } finally {
    process.off(SIGTERM, kill);
  }
}
