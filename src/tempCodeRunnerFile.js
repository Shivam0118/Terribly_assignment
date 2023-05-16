import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

function App() {
  const [wordFrequencies, setWordFrequencies] = useState(null);

  const fetchWordFrequencies = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const words = response.data.split(/\s+/);
      const frequencyMap = {};

      words.forEach(word => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      });

      setWordFrequencies(frequencyMap);
    } catch (error) {
      console.error('Error fetching word frequencies:', error);
    }
  };

  const exportToCSV = () => {
    if (wordFrequencies) {
      const csvContent = Object.entries(wordFrequencies)
        .map(([word, frequency]) => `${word},${frequency}`)
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'word_frequencies.csv');
    }
  };

  return (
    <div>
      <button onClick={fetchWordFrequencies}>Submit</button>
      {wordFrequencies && (
        <div>
          <h2>Word Frequencies:</h2>
          <ul>
            {Object.entries(wordFrequencies).map(([word, frequency]) => (
              <li key={word}>
                {word}: {frequency}
              </li>
            ))}
          </ul>
          <button onClick={exportToCSV}>Export</button>
        </div>
      )}
    </div>
  );
}

export default App;
