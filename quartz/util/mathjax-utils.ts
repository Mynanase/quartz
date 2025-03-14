import fs from 'fs'
import path from 'path'

/**
 * 从preamble.sty文件读取LaTeX宏定义，并转换为MathJax可用的格式
 */
export function getMathJaxMacrosFromPreamble(): Record<string, string> {
  const macros: Record<string, string> = {}
  
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
          macros[name] = definition
        } else {
          macros[name] = definition
        }
      }
      
      console.log(`Loaded ${Object.keys(macros).length} macros from preamble.sty`)
    } else {
      console.log('preamble.sty file not found, skipping custom macros')
    }
  } catch (error) {
    console.error('Error loading preamble.sty:', error)
  }
  
  return macros
}
