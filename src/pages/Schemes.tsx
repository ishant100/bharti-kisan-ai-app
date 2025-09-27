import { SCHEMES } from "@/services/schemes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SchemesPage(){
  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-4">
      {SCHEMES.map(s=>(
        <Card key={s.title} className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </div>
          <div className="mt-4">
            <a href={s.url} target="_blank" rel="noreferrer">
              <Button>Open</Button>
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
