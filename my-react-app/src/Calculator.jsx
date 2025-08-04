import { useState, useEffect } from 'react';

const buttons = [
  'C', '±', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '='
];

export default function Calculator() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calc-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  const handleClick = (value) => {
    if (value === 'C') {
      setInput('');
      return;
    }

    if (value === '=') {
      try {
        const result = eval(input).toString();
        const entry = `${input} = ${result}`;
        setHistory([entry, ...history]);
        setInput(result);
      } catch {
        setInput('Error');
      }
      return;
    }

    if (value === '±') {
      if (!input) return;
      setInput(input.startsWith('-') ? input.slice(1) : '-' + input);
      return;
    }

    setInput((prev) => prev + value);
  };

  const clearHistory = () => setHistory([]);

  const reuseHistoryItem = (entry) => {
    const expression = entry.split('=')[0].trim();
    setInput(expression);
  };

  return (
    <div className="w-80 bg-gray-800 text-white rounded-lg shadow-lg p-4">
      <div className="mb-4 text-right text-2xl bg-gray-700 p-4 rounded-md break-words">
        {input || '0'}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`py-4 rounded-md text-lg font-semibold 
              ${btn === '=' ? 'bg-green-500' :
                btn === 'C' ? 'bg-red-500' :
                ['+', '-', '*', '/', '%'].includes(btn) ? 'bg-yellow-500' :
                'bg-gray-600 hover:bg-gray-500'}`}
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="bg-gray-700 p-2 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">History</h2>
            <button
              className="text-sm text-red-400 hover:text-red-200"
              onClick={clearHistory}
            >
              Clear
            </button>
          </div>
          <ul className="max-h-40 overflow-y-auto space-y-1 text-sm">
            {history.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-green-300"
                onClick={() => reuseHistoryItem(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
