import { QuartzComponent, QuartzComponentProps } from "../types"
import { getMathJaxConfigFromPreamble } from "../../util/mathjax-utils"

// 创建MathJax配置组件，用于加载自定义包和环境
function MathJaxConfigComponent(props: QuartzComponentProps) {
  // 组件仅用于注入脚本，不显示任何内容
  return null
}

// 获取preamble.sty中的配置
const config = getMathJaxConfigFromPreamble()

// 在页面加载前注入MathJax配置
MathJaxConfigComponent.beforeDOMLoaded = `
  // 添加MathJax配置脚本
  (function() {
    // 添加CSS样式使公式居中显示
    const mathJaxStyle = document.createElement("style");
    mathJaxStyle.textContent = \`
      /* 通用MathJax 2.x样式 */
      .MathJax_Display {
        text-align: center !important;
        margin: 1em 0 !important;
        width: 100% !important;
      }
      .MathJax {
        text-align: center !important;
      }
      
      /* MathJax 3.x CHTML输出 */
      mjx-container {
        display: inline-block;
        text-align: center !important;
      }
      mjx-container[jax="CHTML"][display="true"] {
        display: block !important;
        text-align: center !important;
        margin: 1em auto !important;
        width: 100% !important;
      }
      
      /* 确保行间公式容器居中 */
      .math-display, div.math-display {
        display: flex !important;
        justify-content: center !important;
        width: 100% !important;
        margin: 1em 0 !important;
      }
      
      /* 针对rehype-mathjax特定的选择器 */
      .math.math-display {
        display: flex !important;
        justify-content: center !important;
        width: 100% !important;
      }
      
      /* 确保所有行间公式容器都居中 */
      p:has(> mjx-container[display="true"]) {
        display: flex !important;
        justify-content: center !important;
        width: 100% !important;
      }
    \`;
    document.head.appendChild(mathJaxStyle);

    // 添加MathJax配置脚本
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.id = "MathJax-script-config";
    configScript.text = \`
      window.MathJax = {
        loader: {
          load: ${JSON.stringify(config.packages.map(pkg => `[tex]/${pkg}`))}
        },
        tex: {
          packages: {'[+]': ${JSON.stringify(config.packages)}},
          inlineMath: [['$', '$'], ['\\\\\\\\(', '\\\\\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\\\\\[', '\\\\\\\\]']],
          processEscapes: true,
          processEnvironments: true,
          macros: ${JSON.stringify(config.macros)},
          environments: ${JSON.stringify(config.environments)}
        },
        options: {
          ignoreHtmlClass: 'tex2jax_ignore',
          processHtmlClass: 'tex2jax_process',
          renderActions: {
            addMenu: [0, '', ''],  // 移除右键菜单以保持界面简洁
          }
        },
        startup: {
          ready: () => {
            console.log('MathJax is ready with custom configuration');
            MathJax.startup.defaultReady();
            
            // 在MathJax完成渲染后添加额外的处理以确保公式居中
            MathJax.startup.promise.then(() => {
              // 查找所有display模式的公式容器并应用居中样式
              document.querySelectorAll('mjx-container[display="true"]').forEach(el => {
                // 确保父元素样式支持居中显示
                const parent = el.parentElement;
                if (parent && parent.tagName.toLowerCase() === 'p') {
                  parent.style.display = 'flex';
                  parent.style.justifyContent = 'center';
                  parent.style.width = '100%';
                }
              });
            });
          }
        }
      };
    \`;
    document.head.appendChild(configScript);
  })();
`

export const MathjaxConfig = MathJaxConfigComponent
