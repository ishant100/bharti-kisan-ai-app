import { Card, CardContent } from "@/components/ui/card";

const contacts = [
  { name: "Kisan Call Center (KCC)", phone: "1800-180-1551", info: "24x7 toll-free agri advisory, Govt. of India" },
  { name: "ICAR (Indian Council of Agricultural Research)", phone: "011-25843301", info: "Krishi Bhavan, New Delhi" },
  { name: "PM-KISAN Helpdesk", phone: "155261 / 1800-115-526", info: "Farmer income support scheme queries" },
  { name: "Soil Health Card Scheme", phone: "011-24305520", info: "Dept. of Agriculture & Farmers Welfare" },
];

export default function Contacts() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold">Important Agriculture Contacts (India)</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <Card key={c.name}><CardContent className="p-6">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.info}</div>
            <a href={`tel:${c.phone}`} className="text-primary underline mt-1 inline-block">{c.phone}</a>
          </CardContent></Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Verify numbers locally; regional KVK contacts vary by district.</p>
    </div>
  );
}
