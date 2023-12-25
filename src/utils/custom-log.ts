const SHOWLOG = () => Boolean(window.SHOWLOG)

function stack() {
  const e = new Error()
  const lines = e.stack?.split('\n')
  lines?.shift()
  const result: any[] = []
  lines?.forEach(function (line) {
    result.push(line)
  })
  return result.length > 3 ? result.slice(3) : []
}
function getDateString() {
  const d = new Date()
  let str = d.getHours().toString()
  let timeStr = ''
  timeStr += (str.length === 1 ? '0' + str : str) + ':'
  str = d.getMinutes().toString()
  timeStr += (str.length === 1 ? '0' + str : str) + ':'
  str = d.getSeconds().toString()
  timeStr += (str.length === 1 ? '0' + str : str) + ':'
  str = d.getMilliseconds().toString()
  if (str.length === 1) str = '00' + str
  if (str.length === 2) str = '0' + str
  timeStr += str
  timeStr = '[' + timeStr + ']'
  return timeStr
}
function addStack(args: any[]) {
  const info = SHOWLOG() ? '\n' + getDateString() + '\n' : ''
  return [...args, info, { stack: stack() }]
}

export function log(...args) {
  if (!SHOWLOG()) {
    return
  }
  const backLog = (...params) => {
    const [tag, ...others] = params
    console.log(`%c ${tag}`, 'color: #84cc16;', ...others)
  }

  backLog.apply(console.log, addStack(args))
}

export function info(...args) {
  if (!SHOWLOG()) {
    return
  }
  const backLog = (...params) => {
    const [tag, ...others] = params
    console.info(
      `%c ${tag}`,
      'color: #06b6d4;border: 2px solid #0891b2;padding: 2px;margin: 2px;',
      ...others,
    )
  }
  backLog.apply(backLog, addStack(args))
}

export function warn(...args) {
  if (!SHOWLOG()) {
    return
  }
  const backLog = (...params) => {
    const [tag, ...others] = params
    console.warn(`%c ${tag}`, 'color: #0ea5e9;', ...others)
  }
  backLog.apply(backLog, addStack(args))
}
export function err(...args) {
  if (!SHOWLOG()) {
    return
  }
  const backLog = (...params) => {
    const [tag, ...others] = params
    console.log(`%c ${tag}`, 'color: #dc2626;', ...others)
  }
  backLog.apply(backLog, addStack(args))
}
