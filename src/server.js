const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/fetchData', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.terriblytinytales.com/test.txt'
    );
    const text = response.data;
    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    const sortedWords = Object.entries(wordCount).sort(
      (a, b) => b[1] - a[1]
    );
    const top20Words = sortedWords.slice(0, 20);
    const labels = top20Words.map((word) => word[0]);
    const data = top20Words.map((word) => word[1]);

    const result = {
      labels,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
