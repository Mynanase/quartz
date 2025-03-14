import { QuartzComponent, QuartzComponentProps } from "../types"

// 创建MathJax配置组件，用于加载physics包
function MathJaxConfigComponent(props: QuartzComponentProps) {
  // 组件仅用于注入脚本，不显示任何内容
  return null
}

// 在页面加载前注入MathJax配置
MathJaxConfigComponent.beforeDOMLoaded = `
  // 添加MathJax配置脚本
  (function() {
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.id = "MathJax-script-config";
    configScript.text = \`
      window.MathJax = {
        loader: {
          load: ['[tex]/physics']
        },
        tex: {
          packages: {'[+]': ['physics']},
          inlineMath: [['$', '$'], ['\\\\\\\\(', '\\\\\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\\\\\[', '\\\\\\\\]']],
          processEscapes: true,
          processEnvironments: true,
          macros: {} // 这里的宏将直接从服务器生成的配置中读取
        },
        options: {
          ignoreHtmlClass: 'tex2jax_ignore',
          processHtmlClass: 'tex2jax_process'
        },
        startup: {
          ready: () => {
            console.log('MathJax is ready with physics package');
            MathJax.startup.defaultReady();
          }
        }
      };
    \`;
    document.head.appendChild(configScript);
  })();
`

export const MathjaxConfig = MathJaxConfigComponent
