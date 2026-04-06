import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-ink text-white">
        <div className="text-xs uppercase tracking-[0.3em] text-teal-200">Architecture</div>
        <div className="mt-3 text-2xl font-semibold">Next.js 全栈主应用</div>
        <p className="mt-2 text-sm text-slate-300">页面、鉴权、内部 API 和 Prisma 业务层集中在一个应用内。</p>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-[0.3em] text-accent">Data</div>
        <div className="mt-3 text-2xl font-semibold">PostgreSQL + Prisma</div>
        <p className="mt-2 text-sm text-slate-500">领域模型统一为 User、Category、Unit、Commodity、Order、OrderItem。</p>
      </Card>
      <Card>
        <div className="text-xs uppercase tracking-[0.3em] text-accent">Delivery</div>
        <div className="mt-3 text-2xl font-semibold">pnpm workspace + Docker</div>
        <p className="mt-2 text-sm text-slate-500">本地开发与交付按单仓多包和单 Web 容器组织。</p>
      </Card>
    </div>
  );
}
