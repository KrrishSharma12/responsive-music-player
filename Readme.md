# Spotify Clone 🎵

A responsive Spotify-like web player built with **HTML**, **CSS**, and **JavaScript**—no frameworks required!

---

## 🚀 Live Preview / Demo

Open `index.html` in your browser to try the app locally.

---

## Features

- ✅ Play, pause, skip (next & previous) music files  
- ✅ Real-time song progress bar with click-to-seek functionality  
- ✅ Dynamic display of current song title and elapsed/total time  
- ✅ Volume control and mute/unmute toggle  
- ✅ Responsive design that adapts seamlessly to desktop and mobile layouts  
- ✅ Clickable playlists (albums) load songs dynamically using folder structure & `info.json`

---

## 🧱 Tech Stack

- **HTML5** – Semantic layout of interface  
- **CSS3** – Styling, layout, and responsive behavior  
- **JavaScript** – Audio playback logic, event handling, DOM updates  
- Optionally fetches song list & playlist metadata using local HTTP server (e.g. `127.0.0.1:3000`)

---

## 📁 Project Structure

project-root/
│
├── index.html
├── CSS/
│ ├── style.css
│ └── utility.css
├── Js/
│ └── script.js
├── Songs/
│ ├── <playlist-folder>/
│ │ ├── track1.mp3
│ │ ├── track2.mp3
│ │ └── info.json ← contains title & description
│ └── ...
└── Img/
└── UI icons and cover art