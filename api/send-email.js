export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const { type, to, employeeName, companyName, code, stipendAmount, notes } = req.body;

  if (!to || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let subject, html;

  if (type === "invite") {
    const link = `${process.env.APP_URL || "https://relo-app-bmcniff17s-projects.vercel.app"}/#/corporate`;
    const stipendFormatted = stipendAmount
      ? `$${parseFloat(stipendAmount).toLocaleString()}`
      : "";

    subject = `${companyName} is covering your relocation — get started on Relo`;
    html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#08080f;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 32px;">

    <div style="font-size:22px;color:#f0ece6;letter-spacing:2px;margin-bottom:8px;">relo<span style="color:#5b8db8;">.</span></div>
    <div style="height:1px;background:#1a1a2a;margin-bottom:40px;"></div>

    <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#4A7FB5;margin-bottom:16px;">Relocation Package</div>
    <div style="font-size:28px;color:#f0ece6;margin-bottom:16px;line-height:1.2;">
      ${companyName} is covering<br/>your relocation.
    </div>
    <p style="font-size:14px;color:rgba(240,236,230,0.55);line-height:1.8;margin:0 0 32px;">
      Hi ${employeeName || "there"}, your employer has set up a relocation package for you on Relo.
      Use the platform to track your stipend, log expenses, and upload receipts — all in one place.
    </p>

    ${stipendFormatted ? `
    <div style="background:#0d1117;border:1px solid #1e2130;padding:20px 24px;margin-bottom:32px;">
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;">Your Relocation Stipend</div>
      <div style="font-size:32px;color:#4A7FB5;font-family:Georgia,serif;">${stipendFormatted}</div>
      ${notes ? `<div style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:8px;">${notes}</div>` : ""}
    </div>
    ` : ""}

    <div style="background:#0a0f1a;border:1px solid #1e2a3a;padding:20px 24px;margin-bottom:32px;text-align:center;">
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:10px;">Your Access Code</div>
      <div style="font-size:32px;letter-spacing:10px;color:#7BAFD4;font-family:Georgia,serif;">${code}</div>
    </div>

    <a href="${link}" style="display:block;background:#4A7FB5;color:#fff;text-align:center;padding:16px 32px;text-decoration:none;font-family:Georgia,serif;font-size:14px;letter-spacing:2px;margin-bottom:32px;">
      GET STARTED →
    </a>

    <p style="font-size:12px;color:rgba(240,236,230,0.25);line-height:1.7;margin:0;">
      Go to <a href="${link}" style="color:#4A7FB5;">${link}</a>, sign in or create a free account,
      click <strong style="color:rgba(255,255,255,0.4);">Employee</strong> in the Corporate section,
      and enter the code above to link your package.
    </p>

    <div style="height:1px;background:#1a1a2a;margin:40px 0 24px;"></div>
    <div style="font-size:11px;color:rgba(240,236,230,0.2);">Sent via Relo · The relocation platform</div>
  </div>
</body>
</html>`;
  } else if (type === "digest") {
    const { totalSpent, remaining, pendingCount, expenses } = req.body;
    subject = `Weekly relocation update — ${companyName}`;
    html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#08080f;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 32px;">
    <div style="font-size:22px;color:#f0ece6;letter-spacing:2px;margin-bottom:8px;">relo<span style="color:#5b8db8;">.</span></div>
    <div style="height:1px;background:#1a1a2a;margin-bottom:40px;"></div>
    <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#4A7FB5;margin-bottom:12px;">Weekly Digest</div>
    <div style="font-size:24px;color:#f0ece6;margin-bottom:24px;">${companyName}</div>
    <div style="display:flex;gap:16px;margin-bottom:32px;">
      <div style="flex:1;background:#0d1117;border:1px solid #1e2130;padding:16px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;">Spent</div>
        <div style="font-size:22px;color:#f5a623;">$${parseFloat(totalSpent||0).toLocaleString()}</div>
      </div>
      <div style="flex:1;background:#0d1117;border:1px solid #1e2130;padding:16px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;">Remaining</div>
        <div style="font-size:22px;color:#4caf50;">$${parseFloat(remaining||0).toLocaleString()}</div>
      </div>
      <div style="flex:1;background:#0d1117;border:1px solid #1e2130;padding:16px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;">Pending</div>
        <div style="font-size:22px;color:#f5a623;">${pendingCount||0}</div>
      </div>
    </div>
    ${pendingCount > 0 ? `
    <a href="${process.env.APP_URL || "https://relo-app-bmcniff17s-projects.vercel.app"}/#/corporate" style="display:block;background:#4A7FB5;color:#fff;text-align:center;padding:14px 32px;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:2px;margin-bottom:32px;">
      REVIEW ${pendingCount} PENDING EXPENSE${pendingCount !== 1 ? "S" : ""} →
    </a>` : ""}
    <div style="height:1px;background:#1a1a2a;margin:32px 0 20px;"></div>
    <div style="font-size:11px;color:rgba(240,236,230,0.2);">Relo weekly digest · Unsubscribe anytime</div>
  </div>
</body>
</html>`;
  } else {
    return res.status(400).json({ error: "Unknown email type" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || "Relo <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.message || "Email failed" });
    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
