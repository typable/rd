const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL('src/main.js');
document.body.appendChild(script);

const style = document.createElement('style');
style.innerHTML = `
  body.rd-mode {
    overflow: hidden !important;
  }
`;
document.body.appendChild(style);

const use = (deps) => {
  return Promise.all(deps.map(async (dep) => {
    return await import(dep);
  }));
}

const init = async () => {
  const [useReact, useReactDOM, useTlx, useUtils] = await use([
    './lib/react.js',
    './lib/react-dom.js',
    './lib/tlx.js',
    './utils.js'
  ]);
  const {useState, useEffect, useMemo, createElement} = useReact;
  const {render} = useReactDOM;
  const {createTlx, css, style} = useTlx;
  const {parseDOM, useSource} = useUtils;

  const tlx = createTlx(createElement);

  const FONTS = [
    { type: 'Serif', family: 'Source Serif Pro' },
    { type: 'Sans-Serif', family: 'Noto Sans' },
    { type: 'Display', family: 'Inter' },
    { type: 'Monospace', family: 'Noto Sans Mono' }
  ];

  const port = chrome.runtime.connect();

  const useStore = (name, initial) => {
    const [value, setValue] = useState(initial);
    useEffect(() => {
      chrome.storage.local.get([name], (values) => {
        if(values[name]) {
          setValue(values[name]);
        }
      });
    }, []);
    const setStore = (value) => {
      setValue(value);
      chrome.storage.local.set({ [name]: value }, console.log);
    }
    return [value, setStore];
  }

  const App = () => {
    const [visible, setVisible] = useStore('rd.visible.' + window.location.origin, false);
    const [font, setFont] = useStore('rd.font', FONTS[0]);
    const [darkMode, setDarkMode] = useStore('rd.dark-mode', false);
    const [showImages, setShowImages] = useStore('rd.show-images', false);
    const [showSettings, setShowSettings] = useState(false);
    
    useEffect(() => {
      const handler = (message) => {
        const {action} = message;
        if(action === 'clicked') {
          setVisible(!visible);
        }
      }
      document.body.classList[visible ? 'add' : 'remove']('rd-mode');
      port.onMessage.addListener(handler);
      return () => port.onMessage.removeListener(handler);
    }, [visible]);
  
    const nodes = useMemo(() => {
      return parseDOM(document.body, { showImages });
    }, [visible, showImages]);
  
    const styles = useMemo(() => {
      return css`
      
        .rd-app {
          ${visible ? '' : 'display: none !important;'}
          position: fixed;
          top: 0px;
          left: 0px;
          right: 0px;
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          background-color: ${ darkMode ?  '#222' : '#EEE' };
          z-index: 9999;
        }
        
        .rd-app::-webkit-scrollbar {
          width: 20px;
        }
        
        .rd-app::-webkit-scrollbar-track {
          background-color: ${ darkMode ? '#222' : '#EEE' };
        }
        
        .rd-app::-webkit-scrollbar-thumb {
          border: 6px solid ${ darkMode ? '#222' : '#EEE' };
          background-color: ${ darkMode ? '#444' : '#CCC' };
          border-radius: 10px;
        }
        
        .rd-app::-webkit-scrollbar-thumb:hover {
          background-color: ${ darkMode ? '#555' : '#BBB' };
        }
    
        .rd-app .settings {
          position: fixed;
          top: 30px;
          right: 40px;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          cursor: pointer;
          outline: none;
          z-index: 10000;
          background-color: ${ darkMode ?  '#333' : '#FFF' };
          color: ${ darkMode ?  '#777' : '#666' };
          border: 1px solid ${ darkMode ?  '#555' : '#CCC' };
          user-select: none;
        }

        .rd-app .settings:hover {
          background-color: ${ darkMode ?  '#444' : '#EEE' };
          border: 1px solid ${ darkMode ?  '#666' : '#BBB' };
        }
        
        .rd-app .overlay {
          ${showSettings ? '' : 'display: none !important;'}
          position: fixed;
          top: 0px;
          left: 0xp;
          width: 100%;
          height: 100%;
          z-index: 10000;
          background-color: ${ darkMode ?  '#222' : '#EEE' };
          opacity: 0.8;
        }

        .rd-app .window {
          ${showSettings ? '' : 'display: none !important;'}
          position: fixed;
          top: 50%;
          left: 50%;
          border-radius: 4px;
          z-index: 10000;
          padding: 30px;
          padding-right: 31px;
          box-sizing: border-box;
          transform: translate(-50%, -50%);
          background-color: ${ darkMode ?  '#333' : '#FFF' };
          border: 1px solid ${ darkMode ?  '#555' : '#CCC' };
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          gap: 15px;
        }
        
        .rd-app .option {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .rd-app .option label {
          color: ${ darkMode ? '#EEE' : '#444' };
          padding-top: 3px;
        }
  
        .rd-app .option .option--dark-mode {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #CCC;
          cursor: pointer;
          outline: none;
        }
  
        .rd-app .option .option--show-image {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #CCC;
          cursor: pointer;
          outline: none;
        }
  
        .rd-app .option .option--select-font {
          font-size: 16px;
          height: 46px;
          display: flex;
          border: 1px solid ${ darkMode ?  '#555' : '#CCC' };
          outline: none;
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 6px;
        }
      
        .rd-app .option .option--select-font .option-item {
          background-color: ${ darkMode ?  '#333' : '#FFF' };
          display: flex;
          align-items: baseline;
          line-height: 46px;
          padding: 0 16px;
          color: ${ darkMode ?  '#777' : '#666' };
          border-right: 1px solid ${ darkMode ?  '#555' : '#CCC' };
          user-select: none;
        }

        .rd-app .option .option--select-font .option-item:last-of-type {
          border: none;
        }

        .rd-app .option .option--select-font .option-item.active {
          background-color: ${ darkMode ?  '#252525' : '#F5F5F5' };
          color: ${ darkMode ?  '#EEE' : '#222' };
        }

        .rd-app .content {
          width: 800px;
          padding: 50px;
          margin: 100px auto;
          position: relative;
          background-color: ${ darkMode ?  '#333' : '#FFF' };
          border: 1px solid ${ darkMode ?  '#555' : '#CCC' };
          box-sizing: border-box;
          overflow: hidden;
          font-family: ${font.family};
        }
      
        .rd-app .content > * {
          max-width: 100%;
          height: auto;
        }
  
        .rd-app .content p,
        .rd-app .content span,
        .rd-app .content li {
          color: ${ darkMode ? '#EEE' : '#444' };
          line-height: 32px;
          font-size: ${font.family === 'Source Serif Pro' ? 20 : 18}px;
        }
      
        .rd-app .content li {
          padding-bottom: 1px;
        }
      
        .rd-app .content a,
        .rd-app .content a * {
          color: ${ darkMode ?  '#818CF8' : '#4F46E5' };
          text-decoration: none;
        }
      
        .rd-app .content a:hover {
          text-decoration: underline;
        }
      
        .rd-app .content h1 {
          margin: 0px;
          padding-top: 64px;
          padding-bottom: 20px;
          border-bottom: 1px solid ${ darkMode ? '#666' : '#CCC' };
        }
      
        .rd-app .content h2 {
          margin: 0px;
          padding-top: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid ${ darkMode ? '#666' : '#CCC' };
        }
      
        .rd-app .content h3 {
          margin: 0px;
          padding-top: 24px;
        }
      
        .rd-app .content h1,
        .rd-app .content h1 * {
          color: ${ darkMode ? '#FFF' : '#333' };
          font-size: ${font.family === 'Source Serif Pro' ? 42 : 40}px;
          line-height: 56px;
        }

        .rd-app .content h2,
        .rd-app .content h2 * {
          color: ${ darkMode ? '#FFF' : '#333' };
          font-size: ${font.family === 'Source Serif Pro' ? 32 : 30}px;
        }
      
        .rd-app .content h3,
        .rd-app .content h3 * {
          color: ${ darkMode ? '#FFF' : '#333' };
          font-size: ${font.family === 'Source Serif Pro' ? 26 : 24}px;
        }
      
        .rd-app .content pre {
          background-color: ${ darkMode ?  '#222' : '#EEE' };
          border-radius: 4px;
          padding: 14px 16px;
          overflow-x: auto;
        }
      
        .rd-app .content pre,
        .rd-app .content pre *,
        .rd-app .content code,
        .rd-app .content code * {
          font-size: 16px;
          line-height: 24px;
          font-family: JetBrains Mono;
          color: ${ darkMode ?  '#CCC' : '#333' };
        }
      
        .rd-app .content img {
          ${showImages ? '' : 'display: none !important;'}
          border-radius: 6px;
        }
      
        .rd-app .content button {
          display: none !important;
        }

      `;
    }, [visible, font, darkMode, showImages, showSettings]);
  
    return tlx`
      <div class="rd-app">
        ${styles}
        <button
          class="settings"
          @click="${() => setShowSettings(true)}"
        >
          ⚙️
        </button>
        <div
          class="overlay"
          @click="${() => setShowSettings(false)}"
        ></div>
        <div class="window">
          <div class="option">
            <input
              class="option--dark-mode"
              type="checkbox"
              @change="${(event) => setDarkMode(event.target.checked)}"
              checked="${darkMode}"
            >
            <label>Dark mode</label>
          </div>
          <div class="option">
            <input
              class="option--show-image"
              type="checkbox"
              @change="${(event) => setShowImages(event.target.checked)}"
              checked="${showImages}"
            >
            <label>Show images</label>
          </div>
          <div class="option">
            <div class="option--select-font">
              ${FONTS.map((ft) => tlx`
                <div
                  class="option-item ${font.type === ft.type ? 'active' : ''}" style="${style`font-family: ${ft.family}; font-size: ${ft.family === 'Source Serif Pro' ? 26 : 24}px;`}"
                  title="${ft.type}"
                  @click="${() => setFont(ft)}"
                >
                  Aa
                </div>
              `)}
            </div>
          </div>
        </div>
        <div class="content">
          ${nodes.map((node) => tlx(node.outerHTML))}
        </div>
      </div>
    `;
  }

  useSource('css', `https://fonts.googleapis.com/css2?${FONTS.map((font) => `family=${font.family.replace(/\s+/g, '+')}`).join('&')}&family=JetBrains+Mono&display=swap`);

  const el = document.querySelector('rd-app');
  render(createElement(App), el.shadowRoot);
  document.body.appendChild(el);
}

init();
