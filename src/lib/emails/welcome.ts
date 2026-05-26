type WelcomeArgs = {
  email: string;
  downloadUrl: string;
};

export function welcomeEmail({ email, downloadUrl }: WelcomeArgs) {
  return {
    to: email,
    subject: "🎉 Deine 3D Man Box ist da — los geht's!",
    html: `
<!doctype html>
<html lang="de"><body style="font-family: Inter, Arial, sans-serif; background:#f4f7fb; padding:32px 0;">
  <table width="600" align="center" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:16px; padding:32px;">
    <tr><td>
      <h1 style="font-family:Georgia, serif; color:#0a1428; margin:0 0 16px;">Willkommen in der 3D Man Box 🎁</h1>
      <p style="color:#11213d; line-height:1.6;">Deine Bestellung ist bestätigt. Hier sind deine ersten drei Schritte:</p>
      <ol style="color:#11213d; line-height:1.7;">
        <li><strong>Master-Box herunterladen</strong> (2,4 GB ZIP):<br/>
          <a href="${downloadUrl}" style="display:inline-block; background:#d9a826; color:#0a1428; padding:12px 24px; border-radius:999px; text-decoration:none; font-weight:600; margin-top:8px;">Box jetzt laden</a>
        </li>
        <li><strong>Im Club einloggen</strong> für KI-Generierungen → <a href="https://3dman.club">3dman.club</a></li>
        <li><strong>Schnellstart-Guide lesen</strong> — wir zeigen dir in 10 Min, wie du sie einsetzt</li>
      </ol>
      <p style="color:#11213d; line-height:1.6;">Wenn du Fragen hast, antworte einfach auf diese Mail — wir sind innerhalb von 24h zurück.</p>
      <p style="color:#11213d; line-height:1.6;">Viel Spaß beim Bauen,<br/>Marco &amp; das 3D Man Team</p>
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;"/>
      <p style="font-size:12px; color:#6b7785;">3D Man · Zürich, Schweiz · <a href="https://3dman.club" style="color:#6b7785;">3dman.club</a></p>
    </td></tr>
  </table>
</body></html>
    `,
  };
}

export function emailSequence() {
  return [
    {
      day: 0,
      name: "Welcome + Quick Start",
      subject: "🎉 Deine 3D Man Box ist da",
      goal: "Download + erste Verwendung sicherstellen",
    },
    {
      day: 1,
      name: "Wie andere die Box einsetzen",
      subject: "3 reale Use Cases (du wirst überrascht sein)",
      goal: "Inspiration + Stories aus der Community",
    },
    {
      day: 3,
      name: "KI-Generator-Tutorial",
      subject: "So baust du eigene Charaktere in 30 Sekunden",
      goal: "Club-Login + erste KI-Generierung",
    },
    {
      day: 7,
      name: "Ergebnis-Check",
      subject: "Hast du dein erstes Visual erstellt?",
      goal: "7-Tage-Garantie aktivieren, Support anbieten",
    },
    {
      day: 14,
      name: "Advanced Tipps",
      subject: "Profi-Tipps für maximalen Impact",
      goal: "Engagement vertiefen, Order Bumps anbieten",
    },
    {
      day: 30,
      name: "Affiliate Einladung",
      subject: "Verdien 30% — empfiehl die Box weiter",
      goal: "Affiliate-Programm aktivieren",
    },
  ];
}
