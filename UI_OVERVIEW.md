# Spottymy UI Overview

This document provides a visual description of the Spottymy user interface.

## Home Page

The landing page features:
- **Animated Background**: Floating gradient circles that move smoothly across the screen
- **Large Spottymy Logo**: Spotify icon in green (#1DB954)
- **Gradient Title**: "Spottymy" text with a gradient effect (pink to red)
- **Subtitle**: "The Ultimate Party Playlist Experience"
- **Feature Icons**: Three icons showing key features:
  - 🎵 Vote on Songs
  - 👥 Party Together  
  - 🟢 Spotify Powered
- **Action Buttons**: Two large rounded buttons:
  - "Host a Party" (primary green button)
  - "Join a Party" (outlined button)

**Color Scheme**: Dark theme (#121212 background) with vibrant accents

## Create Party Flow

### Step 1: Host Information
- Dark card with rounded corners
- Input field for host name
- Green "Create Party" button
- "Back to Home" link

### Step 2: Party Created
- Large "🎉 Party Created!" heading
- **Party Code**: Large monospace font in green
- **QR Code**: White background, black QR code (250x250px)
- "Scan to Join" label above QR code
- Two action buttons:
  - "Open Projector View" (primary)
  - "Open Mobile View" (secondary)

## Join Party Flow

- Dark card interface
- Input for Party Code (uppercase, max 8 characters)
- Input for User Name
- Green "Join Party" button
- Validation for both fields required
- Error handling for invalid party codes

## Mobile View

### Header
- Dark gradient background
- Party name: "🎉 [Host]'s Party"
- Party code displayed prominently

### Tab Navigation
Two tabs with smooth transitions:

#### Queue Tab
- **Now Playing Section** (if song is playing):
  - Gradient background (purple to blue)
  - Album artwork (80x80px, rounded corners)
  - Song name and artist
  
- **Up Next Section**:
  - List of queued songs
  - Each song shows:
    - Album artwork (60x60px)
    - Song name and artist
    - "Added by [name]" label in green
    - Vote buttons (up/down arrows)
    - Vote count in the middle
  - Empty state: Music icon with "Add First Song" button

#### Add Songs Tab
- **Search Bar**:
  - Dark background with rounded corners
  - Search icon
  - Text input
  - "Search" button
  
- **Search Results**:
  - Grid of song cards
  - Each card shows:
    - Album artwork (60x60px)
    - Song name and artist
    - Duration
    - "Add" button

**Animations**: Smooth fade-ins, slide transitions between tabs

## Projector View

Full-screen party display optimized for large screens:

### Animated Background
- Multiple floating gradient particles
- Smooth, continuous motion
- Purple/pink gradient theme

### Header Bar
- **Left Side**:
  - Large party title with gradient
  - Stats showing guest count and song count
- **Right Side**:
  - Large digital clock display

### Main Content Area (2-column grid)

#### Left Column: Now Playing
- Large centered display
- **Album Artwork**: 400x400px with glowing shadow effect
- **Song Title**: 3rem font, bold
- **Artist Name**: 2rem font, lighter color
- Pulsing glow animation around album art

#### Right Column: Queue
- "🎵 Up Next" heading
- List of next 5 songs:
  - Queue position number
  - Album artwork (80x80px)
  - Song name and artist
  - Vote count badge
  - Color-coded votes (green for positive, red for negative)
- Smooth slide-in animations for new songs
- Auto-scrolling queue

### Bottom Right: QR Code Corner
- White card with rounded corners
- QR code (150x150px)
- "Scan to Join" text
- Party code in large monospace font
- Subtle shadow effect

**Visual Effects**:
- Animated gradients
- Particle system background
- Smooth transitions when queue updates
- Glowing effects on current song
- Real-time vote count animations

## Design System

### Colors
- **Primary**: #1DB954 (Spotify Green)
- **Background**: #121212 (Dark)
- **Surface**: #282828 (Card background)
- **Text**: #FFFFFF (White)
- **Text Secondary**: #B3B3B3 (Gray)
- **Error**: #E22134 (Red)
- **Gradients**:
  - Purple to Blue: #667eea → #764ba2
  - Pink to Red: #f093fb → #f5576c

### Typography
- **Primary Font**: Circular (Spotify's font), falls back to system fonts
- **Code/Numbers**: Courier New (for party codes)

### Spacing
- Consistent padding and margins
- Rounded corners (10-30px depending on element)
- Cards with subtle shadows

### Animations (Framer Motion)
- Fade in/out: 0.5s ease
- Scale animations on buttons: hover scale 1.05
- Slide transitions: smooth 0.3s
- Staggered list animations: 0.05s delay per item

## Responsive Design

- **Mobile First**: Optimized for phone screens
- **Tablet**: Adjusted layouts with more spacing
- **Desktop/Projector**: Full-screen experience with large text
- **Breakpoint**: 768px for mobile to desktop transition

## Interactive Elements

### Buttons
- **Primary**: Green background, white text, rounded
- **Secondary**: Transparent with green border
- **Hover**: Scale up slightly, darken/lighten color
- **Active**: Scale down slightly

### Inputs
- Dark background
- Green border on focus
- Rounded corners
- Clear placeholder text

### Cards
- Dark surface color
- Subtle shadow
- Rounded corners
- Hover effects on clickable items

## Accessibility Features

- High contrast text
- Clear focus indicators
- Large touch targets (minimum 44px)
- Readable font sizes
- Color is not the only indicator (icons + text)

---

This design creates an engaging, party-appropriate atmosphere with smooth animations and an intuitive interface that works on both mobile devices and large projector displays.
