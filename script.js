// İkon yerine basit bir SVG kullanacağız
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const SlackCommandConfigurator = () => {
  // Komut yapılandırma datası
  const [commands, setCommands] = React.useState([
    {
      command: '',
      sub_command: false,
      sub_command_list: [],
      incident_type: '',
      incident_name: '',
      add_command_details_to_incident_name: false,
      whitelist: [],
      blacklist: []
    }
  ]);
  
  // Kullanıcı giriş değerleri için geçici state
  const [tempInputs, setTempInputs] = React.useState({});
  
  const [jsonOutput, setJsonOutput] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Update JSON output whenever commands change
    setJsonOutput(JSON.stringify(commands, null, 2));
  }, [commands]);

  const handleCommandChange = (index, field, value) => {
    const newCommands = [...commands];
    newCommands[index][field] = value;
    setCommands(newCommands);
  };

  // Geçici input değerini ayarla (whitelist/blacklist için)
  const handleTempInputChange = (commandIndex, subCommandIndex, field, value) => {
    const key = subCommandIndex !== undefined 
      ? `cmd_${commandIndex}_sub_${subCommandIndex}_${field}`
      : `cmd_${commandIndex}_${field}`;

    setTempInputs({
      ...tempInputs,
      [key]: value
    });
  };

  // Değere göre geçici input değerini al
  const getTempInputValue = (commandIndex, subCommandIndex, field) => {
    const key = subCommandIndex !== undefined 
      ? `cmd_${commandIndex}_sub_${subCommandIndex}_${field}`
      : `cmd_${commandIndex}_${field}`;

    // Eğer geçici bir değer varsa onu kullan, yoksa dizideki değerleri göster
    if (tempInputs[key] !== undefined) {
      return tempInputs[key];
    }

    // Dizideki değeri göster
    if (subCommandIndex !== undefined) {
      const value = commands[commandIndex]?.sub_command_list[subCommandIndex]?.[field];
      return Array.isArray(value) ? value.join(', ') : '';
    } else {
      const value = commands[commandIndex]?.[field];
      return Array.isArray(value) ? value.join(', ') : '';
    }
  };

  // Özel tuş işleme - virgül veya Enter tuşuna basıldığında dizi güncellenecek
  const handleKeyDown = (e, commandIndex, subCommandIndex, field) => {
    // Enter veya Tab tuşuna basıldığında, güncelleme yap
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      updateArrayFromInput(commandIndex, subCommandIndex, field);
    }
  };

  // Blur olayında (input focus kaybettiğinde) dizi güncelle
  const handleBlur = (commandIndex, subCommandIndex, field) => {
    updateArrayFromInput(commandIndex, subCommandIndex, field);
  };

  // Input değerini diziye dönüştür ve güncelle
  const updateArrayFromInput = (commandIndex, subCommandIndex, field) => {
    const inputValue = getTempInputValue(commandIndex, subCommandIndex, field);
    
    // Virgülle ayrılmış değerleri diziye çevir
    const items = inputValue.split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    console.log(`${field} dizisini güncelleme: `, items);
    
    // Komutlar dizisini güncelle
    const newCommands = JSON.parse(JSON.stringify(commands));
    
    if (subCommandIndex !== undefined) {
      newCommands[commandIndex].sub_command_list[subCommandIndex][field] = items;
    } else {
      newCommands[commandIndex][field] = items;
    }
    
    setCommands(newCommands);
    
    // Temizlik: geçici girişleri sıfırla
    const key = subCommandIndex !== undefined 
      ? `cmd_${commandIndex}_sub_${subCommandIndex}_${field}`
      : `cmd_${commandIndex}_${field}`;
    setTempInputs(prev => ({...prev, [key]: items.join(', ')}));
  };

  const addCommand = () => {
    setCommands([
      ...commands,
      {
        command: '',
        sub_command: false,
        sub_command_list: [],
        incident_type: '',
        incident_name: '',
        add_command_details_to_incident_name: false,
        whitelist: [],
        blacklist: []
      }
    ]);
  };

  const removeCommand = (index) => {
    const newCommands = [...commands];
    newCommands.splice(index, 1);
    setCommands(newCommands);
  };

  const addSubCommand = (commandIndex) => {
    const newCommands = [...commands];
    newCommands[commandIndex].sub_command_list.push({
      sub_command_name: '',
      incident_type: '',
      incident_name: '',
      add_command_details_to_incident_name: false,
      whitelist: [],
      blacklist: []
    });
    setCommands(newCommands);
  };

  const removeSubCommand = (commandIndex, subCommandIndex) => {
    const newCommands = [...commands];
    newCommands[commandIndex].sub_command_list.splice(subCommandIndex, 1);
    setCommands(newCommands);
  };

  const handleSubCommandChange = (commandIndex, subCommandIndex, field, value) => {
    const newCommands = [...commands];
    newCommands[commandIndex].sub_command_list[subCommandIndex][field] = value;
    setCommands(newCommands);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Slack Slash Command Configurator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {commands.map((command, commandIndex) => (
            <div key={commandIndex} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Command #{commandIndex + 1}</h2>
                <button 
                  onClick={() => removeCommand(commandIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={commands.length === 1}
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Command Name*</label>
                  <input
                    type="text"
                    value={command.command || ''}
                    onChange={(e) => handleCommandChange(commandIndex, 'command', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., hunt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Enable Sub Commands</label>
                  <select
                    value={command.sub_command ? "true" : "false"}
                    onChange={(e) => handleCommandChange(commandIndex, 'sub_command', e.target.value === "true")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Incident Type*</label>
                  <input
                    type="text"
                    value={command.incident_type || ''}
                    onChange={(e) => handleCommandChange(commandIndex, 'incident_type', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., User Hunting"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Incident Name*</label>
                  <input
                    type="text"
                    value={command.incident_name || ''}
                    onChange={(e) => handleCommandChange(commandIndex, 'incident_name', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., The user hunt started"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`addDetails-${commandIndex}`}
                    checked={command.add_command_details_to_incident_name || false}
                    onChange={(e) => handleCommandChange(commandIndex, 'add_command_details_to_incident_name', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`addDetails-${commandIndex}`} className="text-sm font-medium">
                    Add Command Details to Incident Name
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Whitelist (comma separated)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={getTempInputValue(commandIndex, undefined, 'whitelist')}
                      onChange={(e) => handleTempInputChange(commandIndex, undefined, 'whitelist', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, commandIndex, undefined, 'whitelist')}
                      onBlur={() => handleBlur(commandIndex, undefined, 'whitelist')}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., user1@example.com, user2@example.com"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Enter email, press tab/enter or click outside to add
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Blacklist (comma separated)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={getTempInputValue(commandIndex, undefined, 'blacklist')}
                      onChange={(e) => handleTempInputChange(commandIndex, undefined, 'blacklist', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, commandIndex, undefined, 'blacklist')}
                      onBlur={() => handleBlur(commandIndex, undefined, 'blacklist')}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., user3@example.com, user4@example.com"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Enter email, press tab/enter or click outside to add
                    </div>
                  </div>
                </div>
              </div>

              {command.sub_command && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Sub Commands</h3>
                    <button 
                      onClick={() => addSubCommand(commandIndex)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Sub Command
                    </button>
                  </div>
                  
                  {command.sub_command_list.map((subCommand, subCommandIndex) => (
                    <div key={subCommandIndex} className="border-l-4 border-blue-500 pl-4 mb-4 py-2">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium">Sub Command #{subCommandIndex + 1}</h4>
                        <button 
                          onClick={() => removeSubCommand(commandIndex, subCommandIndex)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Sub Command Name*</label>
                          <input
                            type="text"
                            value={subCommand.sub_command_name || ''}
                            onChange={(e) => handleSubCommandChange(commandIndex, subCommandIndex, 'sub_command_name', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="e.g., user"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Incident Type*</label>
                            <input
                              type="text"
                              value={subCommand.incident_type || ''}
                              onChange={(e) => handleSubCommandChange(commandIndex, subCommandIndex, 'incident_type', e.target.value)}
                              className="w-full p-2 border rounded"
                              placeholder="e.g., User Hunting Specific"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Incident Name*</label>
                            <input
                              type="text"
                              value={subCommand.incident_name || ''}
                              onChange={(e) => handleSubCommandChange(commandIndex, subCommandIndex, 'incident_name', e.target.value)}
                              className="w-full p-2 border rounded"
                              placeholder="e.g., User specific hunt started"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`subAddDetails-${commandIndex}-${subCommandIndex}`}
                              checked={subCommand.add_command_details_to_incident_name || false}
                              onChange={(e) => handleSubCommandChange(commandIndex, subCommandIndex, 'add_command_details_to_incident_name', e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor={`subAddDetails-${commandIndex}-${subCommandIndex}`} className="text-sm font-medium">
                              Add Command Details to Incident Name
                            </label>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Whitelist (comma separated)</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={getTempInputValue(commandIndex, subCommandIndex, 'whitelist')}
                                onChange={(e) => handleTempInputChange(commandIndex, subCommandIndex, 'whitelist', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, commandIndex, subCommandIndex, 'whitelist')}
                                onBlur={() => handleBlur(commandIndex, subCommandIndex, 'whitelist')}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., user1@example.com, user2@example.com"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Enter email, press tab/enter or click outside to add
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Blacklist (comma separated)</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={getTempInputValue(commandIndex, subCommandIndex, 'blacklist')}
                                onChange={(e) => handleTempInputChange(commandIndex, subCommandIndex, 'blacklist', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, commandIndex, subCommandIndex, 'blacklist')}
                                onBlur={() => handleBlur(commandIndex, subCommandIndex, 'blacklist')}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., user3@example.com, user4@example.com"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Enter email, press tab/enter or click outside to add
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {command.sub_command_list.length === 0 && (
                    <div className="text-gray-500 italic text-sm">
                      No sub commands added yet. Click "Add Sub Command" to create one.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="text-center">
            <button 
              onClick={addCommand}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add New Command
            </button>
          </div>
        </div>
        
        <div className="sticky top-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white">JSON Output</h2>
              <button 
                onClick={copyToClipboard}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                <CopyIcon /> <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded overflow-auto max-h-screen">
              <pre className="text-green-400 whitespace-pre-wrap">{jsonOutput}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Created for XSOAR Slack Integration Configuration by İsmail Yavuz for Community.</p>
      </footer>
    </div>
  );
};

// React 18 uyumlu createRoot kullanımı
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SlackCommandConfigurator />);
