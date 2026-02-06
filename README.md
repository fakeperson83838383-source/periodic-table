# ⚛️ ElementWise - Interactive Periodic Table

An advanced, educational periodic table built with React, Vite, and Tailwind CSS. Designed specifically to help students learn chemistry effectively!

## ✨ Features

### 🔬 Interactive Periodic Table
- All **118 elements** with accurate data
- **Bohr model** atomic structure visualization showing:
  - Correct number of protons (p⁺) and neutrons (n⁰) in nucleus
  - Proper electron shell distribution
  - Clear shell labels with electron counts
- **Color-coded** by element category
- **Mobile-friendly** - works on phones and tablets

### ⚡ Ion Charges (+ and -)
- Toggle to show common ion charges on all elements
- Visual indicators: **+** charges in red, **-** charges in blue
- Ion superscripts (Na⁺, Cl⁻, Fe²⁺/Fe³⁺)

### 📊 Periodic Trends Visualization
- **Electronegativity** - Yellow to red gradient
- **Atomic Radius** - Blue gradient showing size
- **Ionization Energy** - Green gradient
- Educational tooltips explain each trend

### 🔍 Smart Filters
- **Search** by name, symbol, or atomic number
- **Filter by Category** (Alkali metals, Noble gases, etc.)
- **Filter by State** (Solid, Liquid, Gas at room temperature)

### 🌡️ Temperature Visualization
- Adjustable temperature slider (0K - 6000K)
- See elements change state in real-time
- Shows temperature in Kelvin, Celsius, and Fahrenheit

### ⚖️ Comparison Mode
- Compare up to **4 elements** side-by-side
- View atomic structure, ion charges, properties

### 📝 Learning Tools

#### Quiz Mode
- Multiple question types (symbol, name, atomic number, category, ions)
- **3 difficulty levels** (Easy, Medium, Hard)
- Score tracking with streaks

#### Flashcards
- Study elements with flip cards
- Interactive and engaging

#### Memory Game
- Match element symbols with names
- Fun way to memorize elements

### 📖 Element Details
Each element includes:
- **Introduction** - Engaging description for students
- Atomic mass and electron configuration
- Melting and boiling points
- **Bohr model visualization**
- Discovery information
- Common uses and fun facts
- **Ion charges** with visual indicators

---

## 🚀 Deploy to GitHub Pages

### Quick Deploy (3 Steps!)

1. **Create a GitHub repository** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **"GitHub Actions"**

3. **That's it!** The included workflow will automatically build and deploy.
   - Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### The GitHub Actions Workflow

The `.github/workflows/deploy.yml` file is already included and will:
- Trigger on every push to `main`
- Install dependencies
- Build the project
- Deploy to GitHub Pages

### Manual Deploy (Alternative)

```bash
# Build the project
npm install
npm run build

# The dist folder contains your built app
# Upload dist/index.html to any static hosting:
# - Netlify (drag & drop)
# - Vercel
# - Cloudflare Pages
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Tech Stack

- **React 19** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **TypeScript** - Type safety

---

## 📱 Mobile Support

Works great on:
- 💻 Desktop computers
- 📱 Tablets
- 📱 Mobile phones (optimized for touch)

Tip: Rotate your phone to landscape for the best table view!

---

## 🎓 Perfect For

- High school chemistry students
- College chemistry courses
- AP Chemistry preparation
- Self-learners exploring chemistry
- Teachers creating lessons

---

Made with ⚛️ for chemistry students everywhere
