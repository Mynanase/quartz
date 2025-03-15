import fs from 'fs'
import path from 'path'

interface MathJaxConfig {
  macros: Record<string, string>;
  packages: string[];
  environments: Record<string, { begin: string; end: string }>;
}

/**
 * 从preamble.sty文件读取LaTeX宏定义、环境和包，并转换为MathJax可用的格式
 */
export function getMathJaxConfigFromPreamble(): MathJaxConfig {
  const config: MathJaxConfig = {
    macros: {},
    packages: ['physics'], // 默认包含physics包
    environments: {}
  }
  
  try {
    // 从根目录读取preamble.sty文件，您可以根据实际存放位置调整路径
    const preamblePath = path.join(process.cwd(), 'preamble.sty')
    
    if (fs.existsSync(preamblePath)) {
      const content = fs.readFileSync(preamblePath, 'utf-8')
      
      // 解析\newcommand和\renewcommand定义
      const commandRegex = /\\(?:new|renew)command{\\(\w+)}(?:\[(\d+)\])?{(.+?)}/g
      let match
      
      while ((match = commandRegex.exec(content)) !== null) {
        const name = match[1]
        const numArgs = match[2] ? parseInt(match[2], 10) : 0
        let definition = match[3]
        
        // 转换为MathJax格式
        if (numArgs > 0) {
          // 对于带参数的命令，需要转换#1, #2等为MathJax的#1, #2
          config.macros[name] = definition
        } else {
          config.macros[name] = definition
        }
      }
      
      // 解析\usepackage命令
      const packageRegex = /\\usepackage(?:\[.*?\])?{([^}]+)}/g
      while ((match = packageRegex.exec(content)) !== null) {
        const packages = match[1].split(',').map(pkg => pkg.trim())
        config.packages.push(...packages)
      }
      
      // 解析\newenvironment定义
      const envRegex = /\\newenvironment{(\w+)}(?:\[\d+\])?{([^}]*)}(?:{([^}]*)})*/g
      while ((match = envRegex.exec(content)) !== null) {
        const envName = match[1]
        const beginDef = match[2] || ''
        const endDef = match[3] || ''
        
        config.environments[envName] = {
          begin: beginDef,
          end: endDef
        }
      }
      
      console.log(`Loaded from preamble.sty: ${Object.keys(config.macros).length} macros, ${config.packages.length} packages, ${Object.keys(config.environments).length} environments`)
    } else {
      console.log('preamble.sty file not found, using default configuration')
    }
  } catch (error) {
    console.error('Error loading preamble.sty:', error)
  }
  
  return config
}
