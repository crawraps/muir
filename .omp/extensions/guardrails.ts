import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.setLabel("muir Guardrails");

  // Block direct build/dev commands — must use turbo
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "bash") return;
    const cmd = String(event.input.command ?? "");

    // Block direct bun build/dev in monorepo
    if (/\bbun\s+(run\s+)?(build|dev)\b/.test(cmd) && !cmd.includes("turbo")) {
      return {
        block: true,
        reason: "Use `turbo run build` / `turbo run dev` instead of `bun run build/dev`. See rule://build-commands.",
      };
    }

    // Block rm -rf without confirmation
    if (cmd.includes("rm -rf") && !cmd.includes("node_modules")) {
      if (!pi.hasUI) return { block: true, reason: "rm -rf blocked (no UI for confirmation)" };
    }
  });

  // Notify on session start with rule reminders
  pi.on("session_start", async (_event, ctx) => {
    if (ctx.hasUI) {
      ctx.ui.notify("muir guardrails active — read rule://* for project conventions", "info");
    }
  });
}