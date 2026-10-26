import { Avatar, Card } from "@/components/ui";
import { me } from "@/lib/data";

const people = [
  ["Tomi W.", 1, 5381, 5], ["Collins A.", 0, 4462, 5], ["Bolu E.", 6, 4313, 5], ["Samad K.", 1, 2967, 2], ["Paula N.", 9, 1437, 3],
  ["Kanyin O.", 0, 1262, 5], ["Josh E.", 1, 1124, 5], ["Mike B.", 1, 1000, 5], ["Eddy F.", 8, 861, 2], ["Nonso Z.", 3, 859, 2],
].map(([name, solved, pts, agentCount]) => ({ name: name as string, solved: solved as number, pts: pts as number, agents: agentCount as number }));

export default function Ranking() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.02em]">Ranking</h1>
        <p className="mt-1 text-sm text-zk-muted">Points for solving, reporting and reviewing issues. The goal is 500 points.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {people.slice(0, 3).map((p, n) => (
          <Card key={p.name} className="p-5">
            <p className="text-xs font-bold text-zk-muted">#{n + 1}</p>
            <p className="mt-2 flex items-center gap-2 font-semibold"><Avatar name={p.name} /> {p.name}</p>
            <p className="mt-3 text-2xl font-extrabold">{p.pts.toLocaleString()} <span className="text-sm font-medium text-zk-muted">pts</span></p>
            <p className="text-xs text-zk-ok-fg">Goal reached · +{(p.pts - 500).toLocaleString()}</p>
          </Card>
        ))}
        <Card className="bg-zk-tint p-5">
          <p className="text-[11px] font-bold tracking-[0.08em] text-zk-accent uppercase">Your standing</p>
          <p className="mt-2 text-2xl font-extrabold">#41 <span className="text-sm font-medium text-zk-muted">of 174 people</span></p>
          <p className="mt-1 text-sm">{me.points} / 500 pts</p>
          <p className="text-xs text-zk-ok-fg">Goal reached · +{me.points - 500}</p>
        </Card>
      </div>
      <Card className="overflow-x-auto p-5">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead><tr className="text-[11px] font-bold tracking-[0.06em] text-zk-muted uppercase"><th className="py-2">#</th><th>Person</th><th>Progress to 500</th><th>Solved</th><th>Points</th><th>Agents</th></tr></thead>
          <tbody>
            {people.map((p, n) => (
              <tr key={p.name} className="border-t border-zk-divider">
                <td className="py-3 text-zk-muted">{n + 1}</td>
                <td><span className="flex items-center gap-2 font-semibold"><Avatar name={p.name} size="h-6 w-6 text-[9px]" />{p.name}</span></td>
                <td><span className="inline-block h-1.5 w-24 rounded-full bg-electric-blue" /> 100%</td>
                <td>{p.solved}</td><td className="font-semibold">{p.pts.toLocaleString()} pts</td><td className="text-zk-muted">{p.agents} agents</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
