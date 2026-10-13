import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage(): string {
    const uptime = this.formatUptime(process.uptime());
    return `
 ███╗   ██╗ █████╗  ██████╗██╗  ██╗██╗   ██╗██╗
 ████╗  ██║██╔══██╗██╔════╝██║  ██║██║   ██║██║
 ██╔██╗ ██║███████║██║     ███████║██║   ██║██║
 ██║╚██╗██║██╔══██║██║     ██╔══██║██║   ██║██║
 ██║ ╚████║██║  ██║╚██████╗██║  ██║╚██████╔╝██║
 ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝

  ██████╗ ███████╗ ██████╗ ██╗███████╗████████╗██████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔══██╗╚██╗ ██╔╝
  ██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   ██████╔╝ ╚████╔╝
  ██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══██╗  ╚██╔╝
  ██║  ██║███████╗╚██████╔╝██║███████║   ██║   ██║  ██║   ██║
  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝

──────────────────────────────────────────────────────────────────
  The kernel of your Frontend                        v1.0.0
──────────────────────────────────────────────────────────────────

  "If you think your UI is good, you are probably wrong. Like me"

  NOT a library for weak devs who love 1GB of node_modules.
  It's for people who know how to copy-paste code and OWN IT.

──────────────────────────────────────────────────────────────────
  ENDPOINTS
──────────────────────────────────────────────────────────────────

  GET  /api/v1
  GET  /api/v1/health
  GET  /api/v1/inspiration
  GET  /api/v1/blame
  GET  /api/v1/registry
  GET  /api/v1/registry/:slug
  GET  /api/v1/themes
  POST /api/v1/chat

──────────────────────────────────────────────────────────────────
  STATUS   RUNNING (Unlike your last deploy)
  UPTIME   ${uptime}
  LICENSE  Just don't say you built it yourself.
──────────────────────────────────────────────────────────────────
`;
  }

  getHealthCheck() {
    return {
      status: 'stable',
      engine: 'NestJS + Drizzle',
      database: 'Connected (and judging you)',
      message: 'The registry is alive. Your CSS, however, is a disaster.',
      timestamp: new Date().toISOString(),
      system: {
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        node: process.version,
        platform: process.platform,
      },
    };
  }

  getSecretQuote(): string {
    const quotes = [
      'Most decorators are just a way to hide bad architecture. Use NachUI instead.',
      "Real developers don't need 'npm install'. They need a CLI and a dream.",
      "If it compiles, it's good. If it has NachUI, it's perfect.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getBlameResponse() {
    return {
      error: '404 - Skill Not Found',
      message: 'The component is fine. Your implementation is the bottleneck.',
      suggestion: 'Try reading the documentation or go back to jQuery.',
    };
  }

  private formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0) parts.push(`${s}s`);
    return parts.join(' ') || '0s';
  }
}
