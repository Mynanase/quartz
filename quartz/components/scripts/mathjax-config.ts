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
      .MathJax_Display {
        text-align: center !important;
        margin: 1em 0 !important;
      }
      .MathJax {
        text-align: center !important;
      }
      mjx-container[jax="CHTML"][display="true"] {
        display: flex !important;
        justify-content: center !important;
        margin: 1em 0 !important;
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
          }
        }
      };
    \`;
    document.head.appendChild(configScript);
  })();
`

export const MathjaxConfig = MathJaxConfigComponent
