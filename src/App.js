import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';

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

  useEffect(() => {
    if (wordFrequencies) {
      const sortedFrequencies = Object.entries(wordFrequencies)
        .sort(([, frequencyA], [, frequencyB]) => frequencyB - frequencyA)
        .slice(0, 20);

      const labels = sortedFrequencies.map(([word]) => word);
      const data = sortedFrequencies.map(([, frequency]) => frequency);

      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Word Frequency',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 5)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      });
    }
  }, [wordFrequencies]);

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
          <canvas id="chart" width="400" height="200"></canvas>
        </div>
      )}
    </div>
  );
}

export default App;
