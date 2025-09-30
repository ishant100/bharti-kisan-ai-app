import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Contacts() {
  const { t } = useTranslation("common");

  const contacts = [
    { name: t("contacts.list.kcc.name"), phone: "1800-180-1551", info: t("contacts.list.kcc.info") },
    { name: t("contacts.list.icar.name"), phone: "011-25843301", info: t("contacts.list.icar.info") },
    { name: t("contacts.list.pmkisan.name"), phone: "155261 / 1800-115-526", info: t("contacts.list.pmkisan.info") },
    { name: t("contacts.list.soil.name"), phone: "011-24305520", info: t("contacts.list.soil.info") },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold">{t("contacts.pageTitle")}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <Card key={c.name}><CardContent className="p-6">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.info}</div>
            <a href={`tel:${c.phone}`} className="text-primary underline mt-1 inline-block">{c.phone}</a>
          </CardContent></Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t("contacts.note")}</p>
    </div>
  );
}