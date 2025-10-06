# k6 UI Dashboard

A modern web-based dashboard for monitoring and controlling [k6](https://k6.io/) load testing in real-time via the k6 REST API.

## Features

- **Status Monitoring** - View current test status, VUs, and test state (running/paused/stopped)
- **Metrics Display** - Real-time metrics visualization with formatted values for time, data, and rates
- **Test Control** - Adjust VUs, pause/resume, and stop tests during execution
- **Groups & Checks** - View test groups and their check statistics with pass/fail rates

## Prerequisites

- Node.js (v18 or higher)
- npm
- A running k6 instance with REST API enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd k6-ui
```

2. Install dependencies:
```bash
npm install
```

## Usage

### k6 Test Configuration

**Important:** For the Control page to work (adjusting VUs, pause/resume), your k6 test must use the `externally-controlled` executor. Other pages (Status, Metrics, Groups) work with any executor type.

Example k6 test configuration:

```javascript
export const options = {
  scenarios: {
    myScenario: {
      executor: "externally-controlled",
      exec: "myTestFunction",
      vus: 10,
      maxVUs: 100,
      duration: "30m"
    }
  }
};

export function myTestFunction() {
  // Your test logic here
}
```

### Start k6 with REST API

Run your k6 test with the REST API enabled on port 6565:

```bash
k6 run --address localhost:6565 your-test-script.js
```

### Start the Dashboard

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Configuration

The dashboard connects to the k6 REST API via a proxy configured in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:6565',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

To change the k6 API port, modify the `target` in `vite.config.js`.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **k6 REST API** - Data source


## API Endpoints Used

- `GET /v1/status` - Get current test status
- `GET /v1/metrics` - Get all metrics
- `GET /v1/groups` - Get all test groups
- `GET /v1/groups/{id}` - Get specific group details
- `PATCH /v1/status` - Update test configuration (VUs, pause/resume/stop)

## Features Detail

### Status Page
- Current test state (Running/Paused/Stopped)
- Virtual Users (current and max)
- Tainted status
- Manual refresh

### Metrics Page
- All k6 metrics displayed in cards
- Automatic formatting:
  - Time values (ms/s)
  - Data values (B/KB/MB)
  - Rate percentages
- Sorted alphabetically
- Trend metrics (avg, min, max, median, p90, p95)
- Counter and gauge metrics
- Manual refresh

### Groups Page
- List of all test groups
- Check pass/fail statistics
- Pass rate percentages
- Color-coded results
- View individual group details
- Manual refresh

### Control Page
- Set VUs and VUs Max
- Pause/Resume test execution
- Stop test
- Detailed error messages with HTTP response
- Last response viewer

## Development

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## License

Unknown
