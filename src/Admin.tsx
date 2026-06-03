import React, { useState, useEffect } from 'react';
import { Save, LogIn, FileJson, LogOut, ChevronRight, ChevronDown } from 'lucide-react';

// Recursive Editor Component
const JsonEditor = ({ data, onChange, path = [] }: { data: any, onChange: (path: string[], value: any) => void, path?: string[] }) => {
  if (data === null || data === undefined) return null;

  if (Array.isArray(data)) {
    return (
      <div className="pl-4 border-l border-slate-200 mt-2 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-md">
            <h4 className="font-semibold text-slate-500 mb-2 font-mono text-sm">Item {index + 1}</h4>
            <JsonEditor data={item} path={[...path, index.toString()]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="space-y-4 mt-2">
        {Object.keys(data).map((key) => (
          <div key={key} className="pl-4 border-l-2 border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <JsonEditor data={data[key]} path={[...path, key]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-2">
      <label className="block text-xs font-mono text-slate-500 mb-1">{path[path.length - 1]}</label>
      {typeof data === 'boolean' ? (
        <select 
          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={data ? 'true' : 'false'}
          onChange={(e) => onChange(path, e.target.value === 'true')}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : (
        typeof data === 'number' ? (
          <input
            type="number"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={data}
            onChange={(e) => onChange(path, parseFloat(e.target.value))}
          />
        ) : (
          <textarea
            className="w-full p-2 border border-slate-300 rounded min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={data}
            onChange={(e) => onChange(path, e.target.value)}
          />
        )
      )}
    </div>
  );
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const authHeader = () => `Basic ${btoa(`${username}:${password}`)}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsLoggedIn(true);
        fetchFiles();
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (e) {
      setLoginError('Server error. Ensure backend is running.');
    }
  };

  const fetchFiles = async () => {
    const res = await fetch('/api/files', { headers: { Authorization: authHeader() } });
    if (res.ok) {
      setFiles(await res.json());
    }
  };

  const loadFile = async (f: string) => {
    if (saveStatus === 'saving') return;
    setSaveStatus('idle');
    setSelectedFile(f);
    const res = await fetch(`/api/files/${f}`, { headers: { Authorization: authHeader() } });
    if (res.ok) {
      setFileContent(await res.json());
    }
  };

  const updateValue = (path: string[], value: any) => {
    setFileContent((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/files/${selectedFile}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
        body: JSON.stringify(fileContent)
      });
      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    
    // Clear session cache and cookies
    sessionStorage.clear();
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to main page
    window.location.href = '/';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <LogIn className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Admin Login</h1>
          {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 h-auto md:h-screen sticky top-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center">
            <FileJson className="w-5 h-5 mr-2 text-blue-600" />
            Content Files
          </h2>
          <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 space-y-1">
          {files.map(f => (
            <button
              key={f}
              onClick={() => loadFile(f)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedFile === f ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {f}
            </button>
          ))}
          {files.length === 0 && <p className="text-slate-400 p-2 text-sm">No JSON files found.</p>}
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 overflow-y-auto h-screen relative">
        {selectedFile ? (
          <div className="max-w-4xl mx-auto pb-24">
            <div className="p-6 md:p-8 border-b border-slate-200 bg-white sticky top-0 z-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Edit {selectedFile}</h1>
                <p className="text-slate-500 text-sm mt-1">Make changes below and click save.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <JsonEditor data={fileContent} onChange={updateValue} />
              </div>
            </div>

            {/* Floating Action Button for Save */}
            <div className="fixed bottom-8 right-8 z-50">
              <button
                onClick={saveFile}
                disabled={saveStatus === 'saving'}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all ${
                  saveStatus === 'saved' ? 'bg-green-500 text-white' : 
                  saveStatus === 'error' ? 'bg-red-500 text-white' :
                  saveStatus === 'saving' ? 'bg-blue-400 text-white cursor-not-allowed' :
                  'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>
                  {saveStatus === 'saved' ? 'Saved!' : 
                   saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'error' ? 'Error. Retry?' : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 p-8 text-center">
            <div>
              <FileJson className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Select a file from the sidebar to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
