import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./style/index.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import "./i18n";

// Polyfill for Electron APIs in web environment
if (typeof window !== 'undefined' && !window.electronAPI) {
  window.electronAPI = {
    getPlatform: () => 'web',
    closeWindow: () => {},
    showWebview: () => {},
    hideAllWebview: () => {},
    setSize: () => {},
    isFullScreen: () => Promise.resolve(false),
    onWebviewNavigated: () => {},
    onInstallDependenciesStart: () => {},
    onInstallDependenciesLog: () => {},
    onInstallDependenciesComplete: () => {},
    frontendReady: () => Promise.resolve(),
    onUpdateNotification: () => {},
    removeAllListeners: () => {},
    envRemove: () => Promise.resolve(),
    envWrite: () => Promise.resolve(),
    exportLog: () => Promise.resolve(),
    installDependencies: () => Promise.resolve(),
    minimizeWindow: () => {},
    selectFile: () => Promise.resolve([]),
    toggleMaximizeWindow: () => {},
    uploadLog: () => Promise.resolve(),
    webviewDestroy: () => {}
  };
}

if (typeof window !== 'undefined' && !window.ipcRenderer) {
  const mockIpcRenderer = {
    on: () => mockIpcRenderer,
    off: () => mockIpcRenderer,
    removeAllListeners: () => mockIpcRenderer,
    invoke: (channel: string, ..._args: any[]) => {
      // Return appropriate responses based on channel
      switch (channel) {
        case 'check-tool-installed':
          return Promise.resolve({ success: true, isInstalled: true });
        case 'get-files':
          return Promise.resolve([]);
        case 'get-project-files':
          return Promise.resolve([]);
        default:
          return Promise.resolve({ success: false });
      }
    }
  };
  window.ipcRenderer = mockIpcRenderer as any;
}

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	<Suspense fallback={<div></div>}>
		<HashRouter>
			<ThemeProvider>
				<TooltipProvider>
					<App />
				</TooltipProvider>
			</ThemeProvider>
		</HashRouter>
	</Suspense>
	// </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
