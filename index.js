const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'rrule-rust.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.android-arm64.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'rrule-rust.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.android-arm-eabi.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'rrule-rust.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'rrule-rust.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'rrule-rust.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'rrule-rust.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./rrule-rust.darwin-universal.node')
      } else {
        nativeBinding = require('@rrule-rust/lib-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'rrule-rust.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.darwin-x64.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'rrule-rust.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.darwin-arm64.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'rrule-rust.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./rrule-rust.freebsd-x64.node')
      } else {
        nativeBinding = require('@rrule-rust/lib-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'rrule-rust.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./rrule-rust.linux-x64-musl.node')
            } else {
              nativeBinding = require('@rrule-rust/lib-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'rrule-rust.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./rrule-rust.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@rrule-rust/lib-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'rrule-rust.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./rrule-rust.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@rrule-rust/lib-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'rrule-rust.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./rrule-rust.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@rrule-rust/lib-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'rrule-rust.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./rrule-rust.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@rrule-rust/lib-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { Frequency, Weekday, Month, RRule, RRuleSet } = nativeBinding

module.exports.Frequency = Frequency
module.exports.Weekday = Weekday
module.exports.Month = Month
module.exports.RRule = RRule
module.exports.RRuleSet = RRuleSet
