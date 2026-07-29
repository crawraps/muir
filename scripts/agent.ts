import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const agentsDir = path.join(repoRoot, '..', 'cuil-agents')
const namePattern = /^[a-z0-9][a-z0-9-]*$/
const portRangeStart = 3100
const portRangeEnd = 3999

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function isPortFree(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer()
    server.once('error', () => {
      server.close()
      resolve(false)
    })
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port, '127.0.0.1')
  })
}

async function findFreePort(name: string, exclude: Set<number> = new Set()): Promise<number> {
  const base = portRangeStart + (hashString(name) % (portRangeEnd - portRangeStart))
  const usedPorts = await collectUsedPorts()

  for (let offset = 0; offset < portRangeEnd - portRangeStart; offset++) {
    const port = portRangeStart + ((base - portRangeStart + offset) % (portRangeEnd - portRangeStart))
    if (exclude.has(port)) continue
    if (usedPorts.has(port)) continue
    if (await isPortFree(port)) return port
  }

  for (let port = portRangeStart; port <= portRangeEnd; port++) {
    if (exclude.has(port) || usedPorts.has(port)) continue
    if (await isPortFree(port)) return port
  }

  throw new Error(`No free port available in range ${portRangeStart}-${portRangeEnd}`)
}

async function collectUsedPorts(): Promise<Set<number>> {
  const ports = new Set<number>()
  const metaFiles = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter(f => f.endsWith('.json')) : []

  for (const file of metaFiles) {
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf-8'))
      if (meta.port && Number.isInteger(meta.port)) ports.add(meta.port)
    } catch {
      // ignore invalid meta files
    }
  }

  return ports
}

type RunOptions = { cwd?: string; stdio?: 'pipe' | 'inherit' }
type RunResult = { exitCode: number; stdout: string; stderr: string }

const help = `Agent worktree CLI

Usage:
  bun run agent:create <name> [--base <branch>]
  bun run agent:remove <name> [-f]
  bun run agent:list
  bun run agent:run <name> -- <command...>
  bun run agent:sync <name> [--from <branch>]

Worktrees are created at: ../cuil-agents/feature-<name>
Branches use the form: feature/<name>`

function run(cmd: string, args: string[], opts: RunOptions = {}): RunResult {
  const res = spawnSync(cmd, args, { cwd: opts.cwd, stdio: opts.stdio ?? 'pipe', encoding: 'utf-8' })
  return { exitCode: res.status ?? 1, stdout: res.stdout ?? '', stderr: res.stderr ?? '' }
}

function git(args: string[], opts: RunOptions = {}): RunResult {
  return run('git', args, opts)
}

function fail(message: string): never {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function worktreePath(name: string): string {
  return path.join(agentsDir, `feature-${name}`)
}

function branchName(name: string): string {
  return `feature/${name}`
}

function metaPath(name: string): string {
  return path.join(agentsDir, `feature-${name}.json`)
}

function validateName(name: string): void {
  if (!namePattern.test(name)) {
    fail(`Invalid name "${name}". Use lowercase letters, digits, and hyphens.`)
  }
}

function currentBranch(): string | undefined {
  const res = git(['branch', '--show-current'], { cwd: repoRoot })
  const branch = res.stdout.trim()
  return branch || undefined
}

function branchExists(branch: string): boolean {
  return git(['show-ref', '--verify', '--quiet', `refs/heads/${branch}`], { cwd: repoRoot }).exitCode === 0
}

function isDirty(cwd: string): boolean {
  const res = git(['status', '--porcelain'], { cwd })
  return res.stdout.trim().length > 0
}

function shortHead(cwd: string): string {
  const res = git(['rev-parse', '--short', 'HEAD'], { cwd })
  return res.stdout.trim() || '-'
}

function ensureAgentsDir(): void {
  fs.mkdirSync(agentsDir, { recursive: true })
}

function isValidWorktree(cwd: string): boolean {
  return git(['rev-parse', '--is-inside-work-tree'], { cwd }).stdout.trim() === 'true'
}

function writeMeta(name: string, base: string, port?: number): void {
  const meta = {
    name,
    branch: branchName(name),
    base,
    port,
    path: worktreePath(name),
    createdAt: new Date().toISOString(),
  }
  fs.writeFileSync(metaPath(name), `${JSON.stringify(meta, null, 2)}\n`)
}

function readMeta(name: string): { name: string; branch: string; base: string; port?: number; path: string; createdAt: string } | undefined {
  const file = metaPath(name)
  if (!fs.existsSync(file)) return undefined
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return undefined
  }
}

function deleteMeta(name: string): void {
  const file = metaPath(name)
  if (fs.existsSync(file)) fs.rmSync(file)
}

function installDeps(wt: string): void {
  console.log('Running bun install...')
  const res = run('bun', ['install'], { cwd: wt, stdio: 'inherit' })
  if (res.exitCode !== 0) {
    console.warn(`Warning: bun install exited with code ${res.exitCode}`)
  }
}

async function createWorktree(name: string, base?: string): Promise<void> {
  validateName(name)
  const wt = worktreePath(name)
  const branch = branchName(name)

  if (branchExists(branch)) fail(`Branch "${branch}" already exists. Remove it first or pick another name.`)
  if (fs.existsSync(wt)) fail(`Worktree path already exists: ${wt}`)

  const baseBranch = base ?? currentBranch()
  if (!baseBranch) fail('Could not determine base branch. HEAD is detached. Use --base <branch>.')

  ensureAgentsDir()

  const res = git(['worktree', 'add', '-b', branch, wt, baseBranch], { cwd: repoRoot })
  if (res.exitCode !== 0) fail(res.stderr.trim() || `Failed to create worktree at ${wt}`)

  installDeps(wt)
  const port = await findFreePort(name)
  writeMeta(name, baseBranch, port)

  console.log(`Created worktree for agent "${name}"`)
  console.log(`  path:   ${wt}`)
  console.log(`  branch: ${branch}`)
  console.log(`  base:   ${baseBranch}`)
  console.log(`  port:   ${port}`)
}

async function ensureWorktree(name: string): Promise<void> {
  validateName(name)
  const wt = worktreePath(name)
  if (fs.existsSync(wt) && isValidWorktree(wt)) {
    const meta = readMeta(name)
    if (!meta?.port) {
      const port = await findFreePort(name)
      writeMeta(name, meta?.base ?? currentBranch() ?? 'main', port)
    }
    return
  }
  if (fs.existsSync(wt)) fail(`Path exists but is not a worktree: ${wt}`)

  const branch = branchName(name)
  ensureAgentsDir()

  if (branchExists(branch)) {
    const res = git(['worktree', 'add', wt, branch], { cwd: repoRoot })
    if (res.exitCode !== 0) fail(res.stderr.trim() || `Failed to add worktree for existing branch ${branch}`)
  } else {
    const base = currentBranch()
    if (!base) fail('Could not determine base branch. HEAD is detached.')
    const res = git(['worktree', 'add', '-b', branch, wt, base], { cwd: repoRoot })
    if (res.exitCode !== 0) fail(res.stderr.trim() || `Failed to create worktree at ${wt}`)
    writeMeta(name, base)
  }

  installDeps(wt)
  const port = await findFreePort(name)
  writeMeta(name, currentBranch() ?? 'main', port)
}

function removeWorktree(name: string, force: boolean): void {
  validateName(name)
  const wt = worktreePath(name)
  const branch = branchName(name)

  if (!fs.existsSync(wt) && !branchExists(branch)) fail(`No worktree or branch found for "${name}".`)

  if (fs.existsSync(wt)) {
    if (isDirty(wt) && !force) fail(`Worktree is dirty. Use -f to remove anyway: ${wt}`)
    const args = ['worktree', 'remove']
    if (force) args.push('-f')
    args.push(wt)
    const res = git(args, { cwd: repoRoot })
    if (res.exitCode !== 0) fail(res.stderr.trim() || `Failed to remove worktree at ${wt}`)
  }

  if (branchExists(branch)) {
    const res = git(['branch', force ? '-D' : '-d', branch], { cwd: repoRoot })
    if (res.exitCode !== 0) {
      console.warn(`Warning: could not delete branch "${branch}". It may have unmerged commits. Use -f to force.`)
    }
  }

  git(['worktree', 'prune'], { cwd: repoRoot })
  deleteMeta(name)

  console.log(`Removed worktree and branch for "${name}"`)
}

function listWorktrees(): void {
  const res = git(['worktree', 'list', '--porcelain'], { cwd: repoRoot })
  if (res.exitCode !== 0) fail(res.stderr.trim() || 'Failed to list worktrees')

  const blocks = res.stdout
    .split('\n\n')
    .map(b => b.trim())
    .filter(Boolean)
  const rows: { name: string; branch: string; base: string; port: string; path: string; status: string; head: string }[] = []

  for (const block of blocks) {
    const lines = block.split('\n')
    const wtLine = lines.find(l => l.startsWith('worktree '))
    if (!wtLine) continue
    const wtPath = wtLine.slice('worktree '.length)
    if (!wtPath.startsWith(`${agentsDir}${path.sep}`)) continue

    const branchLine = lines.find(l => l.startsWith('branch '))
    const branch = branchLine ? branchLine.slice('branch '.length).replace('refs/heads/', '') : '(detached)'
    const name = path.basename(wtPath).replace(/^feature-/, '')
    const dirty = isDirty(wtPath)
    const head = shortHead(wtPath)
    const meta = readMeta(name)
    rows.push({ name, branch, base: meta?.base ?? '?', port: meta?.port?.toString() ?? '-', path: wtPath, status: dirty ? 'dirty' : 'clean', head })
  }

  if (rows.length === 0) {
    console.log('No agent worktrees found.')
    return
  }

  const nameW = Math.max(4, ...rows.map(r => r.name.length))
  const branchW = Math.max(6, ...rows.map(r => r.branch.length))
  const baseW = Math.max(4, ...rows.map(r => r.base.length))
  const portW = Math.max(4, ...rows.map(r => r.port.length))
  const statusW = 6
  const headW = 7

  const header = `${'name'.padEnd(nameW)}  ${'branch'.padEnd(branchW)}  ${'base'.padEnd(baseW)}  ${'port'.padEnd(portW)}  ${'status'.padEnd(statusW)}  ${'head'.padEnd(headW)}  path`
  console.log(header)
  console.log('-'.repeat(header.length))
  for (const r of rows) {
    console.log(
      `${r.name.padEnd(nameW)}  ${r.branch.padEnd(branchW)}  ${r.base.padEnd(baseW)}  ${r.port.padEnd(portW)}  ${r.status.padEnd(statusW)}  ${r.head.padEnd(headW)}  ${r.path}`,
    )
  }
}

function syncWorktree(name: string, from?: string): void {
  validateName(name)
  const wt = worktreePath(name)
  if (!fs.existsSync(wt)) fail(`Worktree does not exist: ${wt}`)

  const meta = readMeta(name)
  const base = from ?? meta?.base
  if (!base) fail('Unknown base branch. Use --from <branch>.')

  console.log(`Rebasing onto ${base}...`)
  const res = git(['rebase', base], { cwd: wt, stdio: 'inherit' })
  if (res.exitCode !== 0) {
    console.error('Rebase failed. Resolve conflicts and run: git rebase --continue')
    console.error('Or abort with: git rebase --abort')
    process.exit(res.exitCode)
  }

  console.log(`Synced "${name}" onto ${base}`)
}

async function runAgent(name: string, command: string[]): Promise<void> {
  if (command.length === 0) fail('No command provided after --')
  if (process.cwd().startsWith(`${agentsDir}${path.sep}`)) {
    fail('Refusing to run from inside an agent worktree. Run from the main repository.')
  }

  await ensureWorktree(name)
  const wt = worktreePath(name)
  const meta = readMeta(name)

  const env = { ...process.env }
  if (meta?.port) {
    env.PORT = meta.port.toString()
  }

  console.log(`Running in ${wt}: ${command.join(' ')}`)
  const res = spawnSync(command[0], command.slice(1), { cwd: wt, stdio: 'inherit', env })
  const exitCode = res.status ?? 1

  console.log()
  console.log(`Command exited with code ${exitCode}`)
  console.log(`  worktree: ${wt}`)
  console.log(`  branch:   ${branchName(name)}`)
  console.log(`  port:     ${meta?.port ?? '-'}`)
  console.log(`  head:     ${shortHead(wt)}`)
  console.log(`  status:   ${isDirty(wt) ? 'dirty' : 'clean'}`)

  process.exit(exitCode)
}

function parseFlags(args: string[]): { values: string[]; flags: Record<string, string | boolean> } {
  const values: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--base' || arg === '--from') {
      const next = args[i + 1]
      if (typeof next === 'undefined') fail(`Missing value for ${arg}`)
      flags[arg.slice(2)] = next
      i++
    } else if (arg === '-f') {
      flags.force = true
    } else if (arg.startsWith('--')) {
      flags[arg.slice(2)] = true
    } else {
      values.push(arg)
    }
  }

  return { values, flags }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const command = argv[0]

  if (!command || command === '--help' || command === '-h') {
    console.log(help)
    process.exit(0)
  }

  const rest = argv.slice(1)

  switch (command) {
    case 'create': {
      const { values, flags } = parseFlags(rest)
      if (values.length !== 1) fail('Usage: agent:create <name> [--base <branch>]')
      await createWorktree(values[0], typeof flags.base === 'string' ? flags.base : undefined)
      break
    }
    case 'remove': {
      const { values, flags } = parseFlags(rest)
      if (values.length !== 1) fail('Usage: agent:remove <name> [-f]')
      removeWorktree(values[0], flags.force === true)
      break
    }
    case 'list': {
      listWorktrees()
      break
    }
    case 'run': {
      const dashIndex = rest.indexOf('--')
      if (dashIndex === -1) fail('Usage: agent:run <name> -- <command...>')
      const name = rest.slice(0, dashIndex)[0]
      const commandArgs = rest.slice(dashIndex + 1)
      if (!name) fail('Missing agent name')
      await runAgent(name, commandArgs)
      break
    }
    case 'sync': {
      const { values, flags } = parseFlags(rest)
      if (values.length !== 1) fail('Usage: agent:sync <name> [--from <branch>]')
      syncWorktree(values[0], typeof flags.from === 'string' ? flags.from : undefined)
      break
    }
    default: {
      fail(`Unknown command "${command}". Run with --help for usage.`)
    }
  }
}

main()
