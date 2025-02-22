const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BLOG_POSTS_DIR = './blog_posts';
const app = express();

if (!fs.existsSync(BLOG_POSTS_DIR)) fs.mkdirSync(BLOG_POSTS_DIR);

app.use(express.json());

app.post('/blogs', (req, res) => {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ message: '⛔️ Title is required.' });
  if (!content) return res.status(400).json({ message: '⛔️ Content is required.' });

  const postFilePath = path.join(BLOG_POSTS_DIR, `${title}.txt`);

  if (fs.existsSync(postFilePath)) {
    return res.status(400).json({ message: '⛔️ Post with such title already exists.' });
  }

  try {
    fs.writeFileSync(postFilePath, content, 'utf8');
    res.status(201).json({ message: '✅ Post created successfully.' });
  } catch (error) {
    res.status(500).json({ message: '⛔️ Server-side error while creating file.' });
  }
});

app.get('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const postFilePath = path.join(BLOG_POSTS_DIR, `${title}.txt`);

  if (!fs.existsSync(postFilePath)) {
    return res.status(404).json({ message: `⛔️ This post doesn't exist.` });
  }

  try {
    const content = fs.readFileSync(postFilePath, 'utf8');
    res.json({ title, content });
  } catch (error) {
    res.status(500).json({ message: '⛔️ Server-side error while reading file.' });
  }
});

app.put('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: '⛔️ Content is required.' });

  const postFilePath = path.join(BLOG_POSTS_DIR, `${title}.txt`);

  if (!fs.existsSync(postFilePath)) {
    return res.status(404).json({ message: `⛔️ This post doesn't exist.` });
  }

  try {
    fs.writeFileSync(postFilePath, content, 'utf8');
    res.json({ message: '✅ Post updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: '⛔️ Server-side error while updating file.' });
  }
});

app.delete('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const postFilePath = path.join(BLOG_POSTS_DIR, `${title}.txt`);

  if (!fs.existsSync(postFilePath)) {
    return res.status(404).json({ message: `⛔️ This post doesn't exist.` });
  }

  try {
    fs.unlinkSync(postFilePath);
    res.json({ message: '✅ Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: '⛔️ Server-side error while deleting file.' });
  }
});

app.get('/blogs', (req, res) => {
  try {
    const files = fs.readdirSync(BLOG_POSTS_DIR);
    if(!files.length) return res.status(200).json({ message: '❎ No blog posts have been created yet.' });
    const posts = files.map(file => ({ title: path.basename(file, '.txt') }));
    res.json(posts);
  } catch(error) {
    res.status(500).json({message: '⛔️ Server-side error while reading posts.'})
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));