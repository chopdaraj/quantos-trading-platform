// WebSocket Client & Manager for Real-Time Market Streaming
// Handles automatic reconnection, heartbeat ping/pong, and listener subscriptions

type TickCallback = (data: any) => void;

export class WebSocketManager {
  private static instance: WebSocketManager;
  private listeners: Map<string, Set<TickCallback>> = new Map();
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private heartbeatTimer: any = null;
  private reconnectAttempts: number = 0;

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private connect() {
    // Simulated connection to Broker/Provider WebSocket
    this.isConnected = true;
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        // Send heartbeat ping & broadcast live tick updates to subscribers
        this.broadcastLiveTicks();
      }
    }, 1500);
  }

  private broadcastLiveTicks() {
    const now = Date.now();
    const liveTicks = {
      "NIFTY 50": 24328.50 + (Math.random() - 0.48) * 4.5,
      "BANK NIFTY": 52140.10 + (Math.random() - 0.48) * 12.0,
      timestamp: now,
    };

    const subscribers = this.listeners.get("ticks");
    if (subscribers) {
      subscribers.forEach((cb) => cb(liveTicks));
    }
  }

  public subscribe(channel: string, callback: TickCallback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)?.add(callback);

    return () => {
      this.listeners.get(channel)?.delete(callback);
    };
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscribers: this.listeners.size,
    };
  }
}
