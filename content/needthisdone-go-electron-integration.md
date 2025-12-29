# NeedThisDone.com: Go & Electron Integration Guide

*A comprehensive handoff document for extending the platform with Go backend services and an Electron desktop application.*

---

## Executive Summary

This document outlines how to integrate Go and Electron into the existing needthisdone.com architecture. Neither technology requires rewriting what exists. Both extend the platform's capabilities in specific, valuable ways.

```
CURRENT STATE                          FUTURE STATE
─────────────────────────────────────────────────────────────────
Next.js handles everything       →     Next.js handles UI + most API
                                       Go handles background jobs
                                       Electron provides desktop access
```

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      needthisdone.com                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   FRONTEND                          BACKEND                      │
│   ├── Next.js 14 + React 18        ├── Next.js API Routes (47)  │
│   ├── 96 React components          ├── Supabase (auth + DB)     │
│   ├── 15 public pages              ├── Stripe (payments)        │
│   ├── 13 admin pages               ├── OpenAI GPT (chatbot)     │
│   ├── Page builder (28 blocks)     ├── Google Calendar          │
│   └── Tailwind CSS                 ├── Resend (email)           │
│                                    └── Upstash Redis (cache)    │
│                                                                  │
│   INFRASTRUCTURE                                                 │
│   └── Medusa (e-commerce engine)                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# PART 1: GO INTEGRATION

## Why Go for NeedThisDone

| Current Limitation | How Go Solves It |
|--------------------|------------------|
| AI chatbot can bottleneck under load | Go handles thousands of concurrent requests efficiently |
| Background jobs (emails, webhooks) block main thread | Go workers process jobs independently |
| No CLI tools for admin tasks | Go compiles to single binary, zero dependencies |
| Node.js memory usage spikes | Go uses significantly less memory |

---

## Go Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      needthisdone.com                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   NEXT.JS (existing)                                            │
│   ├── All UI pages                                              │
│   ├── Most API routes                                           │
│   └── Real-time features (if any)                               │
│                                                                  │
│              │                    │                    │         │
│              ▼                    ▼                    ▼         │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │  GO SERVICE  │    │  GO SERVICE  │    │   GO CLI     │      │
│   │  ai-worker   │    │  job-runner  │    │   ntd-cli    │      │
│   ├──────────────┤    ├──────────────┤    ├──────────────┤      │
│   │ • Chat queue │    │ • Email jobs │    │ • Deploy     │      │
│   │ • LLM calls  │    │ • Webhooks   │    │ • DB backup  │      │
│   │ • Rate limit │    │ • Scheduling │    │ • Health     │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│          │                   │                                   │
│          ▼                   ▼                                   │
│   ┌─────────────────────────────────────────────────────┐       │
│   │              SHARED INFRASTRUCTURE                   │       │
│   │  Supabase (DB)  │  Upstash Redis  │  OpenAI API    │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Go Service 1: AI Worker

### Purpose
Handle chatbot requests asynchronously, preventing load spikes from affecting the main application.

### How It Works

```
USER SENDS MESSAGE
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────►│    Redis     │────►│  Go Worker   │
│   API Route  │     │    Queue     │     │  ai-worker   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       │                                         ▼
       │                                  ┌──────────────┐
       │                                  │  OpenAI API  │
       │                                  └──────────────┘
       │                                         │
       ▼                                         ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │◄────│    Redis     │◄────│   Response   │
│   (polling)  │     │   Pub/Sub    │     │   stored     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Implementation

**Directory Structure:**
```
services/
└── ai-worker/
    ├── main.go
    ├── go.mod
    ├── go.sum
    ├── internal/
    │   ├── queue/
    │   │   └── redis.go
    │   ├── llm/
    │   │   └── openai.go
    │   └── handlers/
    │       └── chat.go
    ├── Dockerfile
    └── README.md
```

**main.go (skeleton):**
```go
package main

import (
    "context"
    "log"
    "os"
    "os/signal"
    "syscall"

    "ai-worker/internal/queue"
    "ai-worker/internal/handlers"
)

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Initialize Redis connection
    redisClient := queue.NewRedisClient(os.Getenv("UPSTASH_REDIS_URL"))

    // Initialize worker
    worker := handlers.NewChatWorker(redisClient, os.Getenv("OPENAI_API_KEY"))

    // Start processing
    go worker.Start(ctx)

    // Graceful shutdown
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
    <-sigCh

    log.Println("Shutting down...")
    cancel()
}
```

**Next.js Integration:**
```typescript
// app/api/chat/route.ts

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

export async function POST(request: Request) {
  const { message, conversationId } = await request.json()

  // Push to queue instead of calling OpenAI directly
  const jobId = crypto.randomUUID()

  await redis.lpush('chat:queue', JSON.stringify({
    jobId,
    conversationId,
    message,
    createdAt: Date.now(),
  }))

  // Return job ID for polling
  return Response.json({ jobId, status: 'queued' })
}

// Separate endpoint for polling results
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  const result = await redis.get(`chat:result:${jobId}`)

  if (!result) {
    return Response.json({ status: 'processing' })
  }

  return Response.json({ status: 'complete', result })
}
```

---

## Go Service 2: Job Runner

### Purpose
Process background jobs: emails, webhook handling, scheduled tasks.

### Job Types

| Job Type | Trigger | What It Does |
|----------|---------|--------------|
| `email:welcome` | User signup | Send welcome email via Resend |
| `email:order` | Order placed | Send confirmation + receipt |
| `email:appointment` | Booking made | Send calendar invite |
| `webhook:stripe` | Stripe event | Process payment events |
| `schedule:reminder` | Cron (15 min before) | Send appointment reminders |

### Implementation

**Directory Structure:**
```
services/
└── job-runner/
    ├── main.go
    ├── go.mod
    ├── internal/
    │   ├── jobs/
    │   │   ├── email.go
    │   │   ├── webhook.go
    │   │   └── scheduler.go
    │   └── services/
    │       ├── resend.go
    │       └── supabase.go
    ├── Dockerfile
    └── README.md
```

**Job Processing Pattern:**
```go
// internal/jobs/processor.go

package jobs

import (
    "context"
    "encoding/json"
    "log"
)

type Job struct {
    Type    string          `json:"type"`
    Payload json.RawMessage `json:"payload"`
}

type Processor struct {
    handlers map[string]JobHandler
}

type JobHandler func(ctx context.Context, payload json.RawMessage) error

func (p *Processor) Register(jobType string, handler JobHandler) {
    p.handlers[jobType] = handler
}

func (p *Processor) Process(ctx context.Context, job Job) error {
    handler, exists := p.handlers[job.Type]
    if !exists {
        log.Printf("Unknown job type: %s", job.Type)
        return nil
    }

    return handler(ctx, job.Payload)
}
```

**Email Job Handler:**
```go
// internal/jobs/email.go

package jobs

import (
    "context"
    "encoding/json"

    "job-runner/internal/services"
)

type WelcomeEmailPayload struct {
    UserID string `json:"userId"`
    Email  string `json:"email"`
    Name   string `json:"name"`
}

func HandleWelcomeEmail(resend *services.ResendClient) JobHandler {
    return func(ctx context.Context, payload json.RawMessage) error {
        var p WelcomeEmailPayload
        if err := json.Unmarshal(payload, &p); err != nil {
            return err
        }

        return resend.Send(ctx, services.Email{
            To:       p.Email,
            Subject:  "Welcome to NeedThisDone!",
            Template: "welcome",
            Data: map[string]string{
                "name": p.Name,
            },
        })
    }
}
```

---

## Go CLI Tool: ntd-cli

### Purpose
Administrative tasks without opening browser or SSH.

### Commands

```bash
# Health check
ntd health

# Database operations
ntd db backup
ntd db stats

# Deployment
ntd deploy staging
ntd deploy production

# Cache management
ntd cache clear
ntd cache stats

# User management
ntd users list --limit 10
ntd users search "email@example.com"
```

### Implementation

**Using Cobra (standard Go CLI library):**
```go
// cmd/root.go

package cmd

import (
    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:   "ntd",
    Short: "NeedThisDone CLI administration tool",
}

func Execute() error {
    return rootCmd.Execute()
}

func init() {
    rootCmd.AddCommand(healthCmd)
    rootCmd.AddCommand(dbCmd)
    rootCmd.AddCommand(deployCmd)
    rootCmd.AddCommand(cacheCmd)
    rootCmd.AddCommand(usersCmd)
}
```

**Health Check Command:**
```go
// cmd/health.go

package cmd

import (
    "fmt"
    "net/http"
    "time"

    "github.com/spf13/cobra"
)

var healthCmd = &cobra.Command{
    Use:   "health",
    Short: "Check system health",
    Run: func(cmd *cobra.Command, args []string) {
        services := []struct {
            name string
            url  string
        }{
            {"Web App", "https://needthisdone.com/api/health"},
            {"AI Worker", "http://localhost:8081/health"},
            {"Job Runner", "http://localhost:8082/health"},
        }

        for _, svc := range services {
            start := time.Now()
            resp, err := http.Get(svc.url)
            duration := time.Since(start)

            if err != nil {
                fmt.Printf("❌ %s: DOWN (%v)\n", svc.name, err)
                continue
            }
            defer resp.Body.Close()

            if resp.StatusCode == 200 {
                fmt.Printf("✓ %s: OK (%dms)\n", svc.name, duration.Milliseconds())
            } else {
                fmt.Printf("⚠ %s: %d (%dms)\n", svc.name, resp.StatusCode, duration.Milliseconds())
            }
        }
    },
}
```

---

## Go Deployment Strategy

### Option 1: Docker Containers (Recommended)

```yaml
# docker-compose.yml

version: '3.8'

services:
  ai-worker:
    build: ./services/ai-worker
    environment:
      - UPSTASH_REDIS_URL=${UPSTASH_REDIS_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

  job-runner:
    build: ./services/job-runner
    environment:
      - UPSTASH_REDIS_URL=${UPSTASH_REDIS_URL}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    restart: unless-stopped
```

### Option 2: Single Binary Deployment

```bash
# Build for production
GOOS=linux GOARCH=amd64 go build -o ai-worker ./services/ai-worker
GOOS=linux GOARCH=amd64 go build -o job-runner ./services/job-runner

# Copy to server
scp ai-worker user@server:/opt/needthisdone/
scp job-runner user@server:/opt/needthisdone/

# Run with systemd
sudo systemctl start ai-worker
sudo systemctl start job-runner
```

---

# PART 2: ELECTRON INTEGRATION

## Why Electron for NeedThisDone

| Current Limitation | How Electron Solves It |
|--------------------|------------------------|
| Admin must keep browser tab open | Desktop app runs in system tray |
| No notifications unless browser focused | Native OS notifications |
| Can't work during internet outage | Offline mode with local cache |
| Page builder drag-and-drop is finicky | Native app = smoother UX |

---

## Electron Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ELECTRON DESKTOP APP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   RENDERER PROCESS (Your React Components)                      │
│   ├── Admin Dashboard                                           │
│   ├── Order Management                                          │
│   ├── Appointment Calendar                                      │
│   └── Page Builder                                              │
│                                                                  │
│              │ IPC (Inter-Process Communication)                │
│              ▼                                                   │
│   MAIN PROCESS (Node.js)                                        │
│   ├── System tray management                                    │
│   ├── Native notifications                                      │
│   ├── Global keyboard shortcuts                                 │
│   ├── Offline data sync                                         │
│   ├── Auto-updater                                              │
│   └── File system access (exports)                              │
│                                                                  │
│              │ HTTPS                                            │
│              ▼                                                   │
│   ┌─────────────────────────────────────────────────────┐       │
│   │            needthisdone.com API                      │       │
│   │         (same backend, no changes)                   │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Desktop App Features

### Feature 1: System Tray

```
┌────────────────────────────────────────────────────┐
│                    SYSTEM TRAY                      │
├────────────────────────────────────────────────────┤
│                                                     │
│   [NTD Icon]                                        │
│       │                                             │
│       ├── 3 new orders                             │
│       ├── 1 appointment in 30 min                  │
│       │                                             │
│       ├── Open Dashboard                           │
│       ├── Quick Actions ►                          │
│       │       ├── View Orders                      │
│       │       ├── View Appointments                │
│       │       └── Open Page Builder                │
│       ├── ─────────────                            │
│       ├── Settings                                 │
│       └── Quit                                     │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Implementation:**
```typescript
// src/main/tray.ts

import { Tray, Menu, nativeImage } from 'electron'
import path from 'path'

export function createTray(mainWindow: BrowserWindow): Tray {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../assets/tray-icon.png')
  )

  const tray = new Tray(icon)

  const updateMenu = (orderCount: number, upcomingAppointments: number) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: `${orderCount} new orders`,
        enabled: orderCount > 0,
        click: () => mainWindow.webContents.send('navigate', '/admin/orders')
      },
      {
        label: `${upcomingAppointments} upcoming appointments`,
        enabled: upcomingAppointments > 0,
        click: () => mainWindow.webContents.send('navigate', '/admin/appointments')
      },
      { type: 'separator' },
      {
        label: 'Open Dashboard',
        click: () => {
          mainWindow.show()
          mainWindow.focus()
        }
      },
      {
        label: 'Quick Actions',
        submenu: [
          {
            label: 'View Orders',
            click: () => mainWindow.webContents.send('navigate', '/admin/orders')
          },
          {
            label: 'View Appointments',
            click: () => mainWindow.webContents.send('navigate', '/admin/appointments')
          },
          {
            label: 'Open Page Builder',
            click: () => mainWindow.webContents.send('navigate', '/admin/pages')
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => mainWindow.webContents.send('navigate', '/admin/settings')
      },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])

    tray.setContextMenu(contextMenu)
  }

  // Update menu on data changes
  ipcMain.on('update-tray', (_, data) => {
    updateMenu(data.orderCount, data.upcomingAppointments)
  })

  return tray
}
```

---

### Feature 2: Native Notifications

```
┌────────────────────────────────────────────────────┐
│   NeedThisDone                              ✕      │
├────────────────────────────────────────────────────┤
│                                                     │
│   🛒 New Order Received                            │
│                                                     │
│   John Smith just placed an order for $45.00       │
│                                                     │
│   [View Order]                    [Dismiss]        │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Implementation:**
```typescript
// src/main/notifications.ts

import { Notification, shell } from 'electron'

interface OrderNotification {
  orderId: string
  customerName: string
  total: number
}

export function showOrderNotification(order: OrderNotification) {
  const notification = new Notification({
    title: 'New Order Received',
    body: `${order.customerName} just placed an order for $${order.total.toFixed(2)}`,
    icon: path.join(__dirname, '../assets/order-icon.png'),
    actions: [
      { type: 'button', text: 'View Order' }
    ]
  })

  notification.on('click', () => {
    mainWindow.show()
    mainWindow.webContents.send('navigate', `/admin/orders/${order.orderId}`)
  })

  notification.on('action', (_, index) => {
    if (index === 0) {
      mainWindow.show()
      mainWindow.webContents.send('navigate', `/admin/orders/${order.orderId}`)
    }
  })

  notification.show()
}

interface AppointmentReminder {
  appointmentId: string
  customerName: string
  serviceName: string
  startsIn: number // minutes
}

export function showAppointmentReminder(appointment: AppointmentReminder) {
  const notification = new Notification({
    title: `Appointment in ${appointment.startsIn} minutes`,
    body: `${appointment.customerName} - ${appointment.serviceName}`,
    icon: path.join(__dirname, '../assets/calendar-icon.png'),
    urgency: 'critical'
  })

  notification.on('click', () => {
    mainWindow.show()
    mainWindow.webContents.send('navigate', `/admin/appointments/${appointment.appointmentId}`)
  })

  notification.show()
}
```

---

### Feature 3: Offline Mode

```
ONLINE MODE                           OFFLINE MODE
─────────────────────────────────────────────────────────────

┌──────────┐     ┌──────────┐        ┌──────────┐
│  React   │────►│   API    │        │  React   │
│   UI     │◄────│  Server  │        │   UI     │
└──────────┘     └──────────┘        └────┬─────┘
                                          │
                                          ▼
                                     ┌──────────┐
                                     │  Local   │
                                     │  SQLite  │
                                     └──────────┘
                                          │
                                     When online:
                                          │
                                          ▼
                                     ┌──────────┐
                                     │   Sync   │
                                     │  Queue   │
                                     └──────────┘
```

**Implementation:**
```typescript
// src/main/offline.ts

import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

const dbPath = path.join(app.getPath('userData'), 'offline-cache.db')
const db = new Database(dbPath)

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    data TEXT,
    synced INTEGER DEFAULT 0,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    data TEXT,
    synced INTEGER DEFAULT 0,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    endpoint TEXT,
    payload TEXT,
    created_at INTEGER
  );
`)

export const offlineDB = {
  // Cache data locally
  cacheOrders(orders: Order[]) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO orders (id, data, synced, updated_at)
      VALUES (?, ?, 1, ?)
    `)

    const transaction = db.transaction((orders: Order[]) => {
      for (const order of orders) {
        stmt.run(order.id, JSON.stringify(order), Date.now())
      }
    })

    transaction(orders)
  },

  // Get cached data when offline
  getOrders(): Order[] {
    const rows = db.prepare('SELECT data FROM orders ORDER BY updated_at DESC').all()
    return rows.map((row: any) => JSON.parse(row.data))
  },

  // Queue actions for sync when back online
  queueAction(action: string, endpoint: string, payload: any) {
    db.prepare(`
      INSERT INTO sync_queue (action, endpoint, payload, created_at)
      VALUES (?, ?, ?, ?)
    `).run(action, endpoint, JSON.stringify(payload), Date.now())
  },

  // Sync queued actions
  async syncQueue(apiClient: APIClient) {
    const pending = db.prepare('SELECT * FROM sync_queue ORDER BY created_at ASC').all()

    for (const item of pending) {
      try {
        await apiClient.request(item.action, item.endpoint, JSON.parse(item.payload))
        db.prepare('DELETE FROM sync_queue WHERE id = ?').run(item.id)
      } catch (error) {
        console.error('Sync failed for item:', item.id, error)
        break // Stop on first failure, retry later
      }
    }
  }
}
```

---

### Feature 4: Global Keyboard Shortcuts

```
SHORTCUT                    ACTION
─────────────────────────────────────────────────────────────
Cmd/Ctrl + Shift + N       Open NeedThisDone (from anywhere)
Cmd/Ctrl + Shift + O       Jump to Orders
Cmd/Ctrl + Shift + A       Jump to Appointments
Cmd/Ctrl + Shift + P       Open Page Builder
```

**Implementation:**
```typescript
// src/main/shortcuts.ts

import { globalShortcut, BrowserWindow } from 'electron'

export function registerShortcuts(mainWindow: BrowserWindow) {
  // Open app from anywhere
  globalShortcut.register('CommandOrControl+Shift+N', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  // Quick navigation
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    mainWindow.show()
    mainWindow.webContents.send('navigate', '/admin/orders')
  })

  globalShortcut.register('CommandOrControl+Shift+A', () => {
    mainWindow.show()
    mainWindow.webContents.send('navigate', '/admin/appointments')
  })

  globalShortcut.register('CommandOrControl+Shift+P', () => {
    mainWindow.show()
    mainWindow.webContents.send('navigate', '/admin/pages')
  })
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll()
}
```

---

## Electron Project Structure

```
needthisdone-desktop/
├── package.json
├── electron-builder.yml
├── src/
│   ├── main/
│   │   ├── index.ts              # Main process entry
│   │   ├── tray.ts               # System tray
│   │   ├── notifications.ts      # Native notifications
│   │   ├── shortcuts.ts          # Global shortcuts
│   │   ├── offline.ts            # Offline storage
│   │   ├── updater.ts            # Auto-updates
│   │   └── preload.ts            # Preload script (IPC bridge)
│   │
│   └── renderer/
│       ├── index.html
│       └── ... (your React app, can import from main repo)
│
├── assets/
│   ├── icon.icns                 # macOS icon
│   ├── icon.ico                  # Windows icon
│   ├── icon.png                  # Linux icon
│   ├── tray-icon.png
│   └── tray-icon@2x.png
│
└── dist/                         # Built applications
    ├── NeedThisDone-1.0.0.dmg    # macOS
    ├── NeedThisDone-1.0.0.exe    # Windows
    └── NeedThisDone-1.0.0.AppImage # Linux
```

---

## Sharing React Components

You don't need to duplicate your React code. Options:

### Option A: Monorepo Structure

```
needthisdone/
├── packages/
│   ├── web/                      # Next.js app
│   ├── desktop/                  # Electron app
│   └── shared/                   # Shared React components
│       ├── components/
│       ├── hooks/
│       └── utils/
└── package.json                  # Workspace root
```

### Option B: Git Submodule

```
needthisdone-desktop/
├── src/
│   ├── main/
│   └── renderer/
│       └── shared/               # Git submodule pointing to shared components
```

### Option C: Load Web App in Electron

Simplest approach: just load your deployed web app.

```typescript
// src/main/index.ts

mainWindow.loadURL('https://needthisdone.com/admin')

// Add native features on top
createTray(mainWindow)
registerShortcuts(mainWindow)
startNotificationPolling(mainWindow)
```

---

## Auto-Updates

```typescript
// src/main/updater.ts

import { autoUpdater } from 'electron-updater'
import { dialog, BrowserWindow } from 'electron'

export function initAutoUpdater(mainWindow: BrowserWindow) {
  autoUpdater.autoDownload = false

  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `Version ${info.version} is available. Download now?`,
      buttons: ['Yes', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. Restart to apply?',
      buttons: ['Restart', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  // Check for updates on startup
  autoUpdater.checkForUpdates()

  // Check periodically (every 4 hours)
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 4 * 60 * 60 * 1000)
}
```

---

# PART 3: IMPLEMENTATION ROADMAP

## Phase 1: Go Foundation (Week 1-2)

```
TASKS
─────────────────────────────────────────────────────────────
[x] Set up Go development environment
[ ] Create ntd-cli with health check command
[ ] Add database backup command to CLI
[ ] Deploy CLI to personal machine for testing
```

**Deliverables:**
- Working CLI tool with 2-3 useful commands
- Familiarity with Go project structure

---

## Phase 2: Go Background Worker (Week 3-4)

```
TASKS
─────────────────────────────────────────────────────────────
[ ] Create job-runner service structure
[ ] Implement Redis queue consumer
[ ] Add email job handler (welcome emails)
[ ] Add webhook handler (Stripe events)
[ ] Docker setup for local development
[ ] Update Next.js to push to queue instead of inline processing
```

**Deliverables:**
- Background job processor handling emails
- Webhook processing moved out of main app

---

## Phase 3: Electron Foundation (Week 5-6)

```
TASKS
─────────────────────────────────────────────────────────────
[ ] Set up Electron project with electron-vite
[ ] Load needthisdone.com/admin in Electron window
[ ] Add system tray with basic menu
[ ] Implement "minimize to tray" behavior
[ ] Build for macOS (your dev machine)
```

**Deliverables:**
- Desktop app that wraps admin dashboard
- System tray presence

---

## Phase 4: Electron Native Features (Week 7-8)

```
TASKS
─────────────────────────────────────────────────────────────
[ ] Add native notifications for new orders
[ ] Add native notifications for upcoming appointments
[ ] Implement global keyboard shortcuts
[ ] Add offline indicator in UI
[ ] Set up auto-updater
[ ] Build for Windows + Linux
```

**Deliverables:**
- Full-featured desktop app
- Distributable builds for all platforms

---

## Phase 5: Go AI Worker (Week 9-10)

```
TASKS
─────────────────────────────────────────────────────────────
[ ] Create ai-worker service
[ ] Implement chat queue consumer
[ ] Add rate limiting and retry logic
[ ] Update chatbot to use async pattern
[ ] Load testing under concurrent requests
```

**Deliverables:**
- Chatbot handles high load gracefully
- Main app performance improved

---

# PART 4: TESTING STRATEGY

## Go Services

```go
// internal/jobs/email_test.go

func TestHandleWelcomeEmail(t *testing.T) {
    // Mock Resend client
    mockResend := &MockResendClient{}

    handler := HandleWelcomeEmail(mockResend)

    payload := []byte(`{"userId":"123","email":"test@example.com","name":"Test"}`)

    err := handler(context.Background(), payload)

    assert.NoError(t, err)
    assert.Equal(t, "test@example.com", mockResend.LastEmail.To)
    assert.Equal(t, "welcome", mockResend.LastEmail.Template)
}
```

## Electron

```typescript
// tests/notifications.test.ts

import { showOrderNotification } from '../src/main/notifications'

describe('Notifications', () => {
  it('creates notification with correct content', () => {
    const mockNotification = jest.spyOn(Notification.prototype, 'show')

    showOrderNotification({
      orderId: '123',
      customerName: 'John',
      total: 45.00
    })

    expect(mockNotification).toHaveBeenCalled()
  })
})
```

---

# PART 5: DECISION LOG

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Go HTTP framework | Standard library `net/http` | No external dependencies, sufficient for simple services |
| Go CLI framework | Cobra | Industry standard, good docs |
| Electron build tool | electron-vite | Modern, fast, good React support |
| Offline storage | SQLite (better-sqlite3) | Simple, no server needed, good enough for cache |
| Update distribution | GitHub Releases + electron-updater | Free, integrates well |
| Component sharing | Load web app in Electron (Option C) | Fastest path, no code duplication |

---

# PART 6: ENVIRONMENT VARIABLES

## Go Services

```env
# .env.go-services

# Shared
UPSTASH_REDIS_URL=redis://...
SUPABASE_URL=https://...
SUPABASE_KEY=...

# AI Worker
OPENAI_API_KEY=sk-...

# Job Runner
RESEND_API_KEY=re_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Electron

```env
# .env.electron

API_BASE_URL=https://needthisdone.com
SENTRY_DSN=... (optional, for error tracking)
```

---

# PART 7: RESOURCES

## Go

- [A Tour of Go](https://go.dev/tour/) - Interactive basics
- [Go by Example](https://gobyexample.com/) - Pattern reference
- [Effective Go](https://go.dev/doc/effective_go) - Idiomatic patterns
- [Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests/) - TDD approach

## Electron

- [Electron Docs](https://www.electronjs.org/docs/latest/)
- [electron-vite](https://electron-vite.org/) - Build tooling
- [electron-builder](https://www.electron.build/) - Packaging
- [Electron Fiddle](https://www.electronjs.org/fiddle) - Playground

---

*Last updated: 2025-12-29*
