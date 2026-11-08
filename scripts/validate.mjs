import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const hubFile = '1.html'

function fail(message) {
  errors.push(message)
}

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function htmlFiles() {
  const games = readdirSync(join(root, 'games'))
    .filter((name) => name.endsWith('.html'))
    .sort()
    .map((name) => 'games/' + name)
  return [hubFile, ...games]
}

function inlineScripts(html) {
  const scripts = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let match
  while ((match = re.exec(html))) {
    if (/\bsrc\s*=/i.test(match[1])) continue
    scripts.push(match[2])
  }
  return scripts
}

function uniqueMatches(regex, text) {
  return [...new Set([...text.matchAll(regex)].map((m) => Number(m[1])))]
}

function checkGameEntries(hub) {
  const gameBlock = hub.match(/var GAMES\s*=\s*\[([\s\S]*?)\];/)
  if (!gameBlock) {
    fail('1.html: 未找到 GAMES 游戏入口列表')
    return
  }
  const declared = uniqueMatches(/\bid\s*:\s*(\d+)/g, gameBlock[1])
  const defined = uniqueMatches(/gameFns\[(\d+)\]\s*=/g, hub)

  for (let id = 1; id <= 20; id++) {
    if (!declared.includes(id)) fail(`1.html: GAMES 缺少第 ${id} 个游戏入口`)
    if (!defined.includes(id)) fail(`1.html: 缺少 gameFns[${id}] 实现`)
  }
  if (declared.length !== 20) fail(`1.html: 游戏入口数量应为 20，实际 ${declared.length}`)
  if (defined.length !== 20) fail(`1.html: 游戏实现数量应为 20，实际 ${defined.length}`)
}

function checkSyntax(files) {
  for (const file of files) {
    const scripts = inlineScripts(read(file))
    if (scripts.length === 0) fail(`${file}: 未找到内联脚本`)
    scripts.forEach((code, index) => {
      try {
        new vm.Script(code, { filename: `${file}#inline-${index + 1}` })
      } catch (error) {
        fail(`${file}: 内联脚本语法错误 - ${error.message}`)
      }
    })
  }
}

function checkDomIds(files) {
  const required = {
    '1.html': ['gameGrid', 'gamePanel', 'gc', 'backBtn']
  }
  for (const file of files) {
    const html = read(file)
    const declared = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]))
    const used = new Set([...html.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]))
    for (const id of used) {
      if (!declared.has(id)) fail(`${file}: getElementById("${id}") 找不到对应 id`)
    }
    for (const id of required[file] || []) {
      if (!declared.has(id)) fail(`${file}: 缺少关键 DOM id="${id}"`)
    }
  }
}

function checkTimers(hub) {
  hub.split(/\r?\n/).forEach((line, index) => {
    if (!/\b(?:setTimeout|setInterval)\s*\(/.test(line)) return
    if (!/\baddTimer\s*\(\s*(?:setTimeout|setInterval)\s*\(/.test(line)) {
      fail(`1.html:${index + 1}: 定时器未通过 addTimer 注册`)
    }
  })
}

function checkPwa() {
  const required = [
    'manifest.webmanifest',
    'sw.js',
    'icons/icon.svg',
    'icons/icon-maskable.svg'
  ]
  for (const file of required) {
    if (!existsSync(join(root, file))) fail(`缺少 PWA 文件: ${file}`)
  }
  const hub = read(hubFile)
  if (!/rel=["']manifest["']/i.test(hub)) fail('1.html: 未引用 manifest.webmanifest')
  if (!/serviceWorker/.test(hub)) fail('1.html: 未注册 service worker')
  const manifest = JSON.parse(read('manifest.webmanifest'))
  if (!manifest.start_url || !manifest.icons || manifest.icons.length === 0) {
    fail('manifest.webmanifest: 缺少 start_url 或 icons')
  }
}

const files = htmlFiles()
const hub = read(hubFile)
checkGameEntries(hub)
checkSyntax(files)
checkDomIds(files)
checkTimers(hub)
checkPwa()

if (errors.length) {
  console.error('校验失败:')
  errors.forEach((error) => console.error(' ✗ ' + error))
  process.exit(1)
}

console.log(`✓ ${files.length} 个 HTML 文件内联脚本语法正常`)
console.log('✓ 20 个游戏入口与实现齐全')
console.log('✓ 关键 DOM id 与 getElementById 引用一致')
console.log('✓ 1.html 定时器均已通过 addTimer 管理')
console.log('✓ PWA 清单、Service Worker 与图标齐全')
