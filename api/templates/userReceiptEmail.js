// userReceiptEmail.js
// Generates a poster-style, soft-blue receipt email (HTML + text fallback)

function escapeHtml(input = "") {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHeartSentence() {
  // The repeated sentence you specified
  return "Thank you for being here, always. May you be happy, safe, and loved";
}

function buildUserReceiptEmail({
  // user-facing fields
  userName = "there",
  topic = "",
  message = "",

  // your branding / settings
  brandName = "Xiang Li",
  replyTime = "within 24 hours on weekdays",
  signatureLine = "With love",
  footerNote = "You're receiving this email because you sent a message via my portfolio contact form.",

  // optional links
  portfolioUrl = "", // e.g. "https://your-domain.com"
  heartImageUrl = "https://res.cloudinary.com/dm6endo9v/image/upload/v1771651737/WechatIMG384_sviftz.png",
} = {}) {
  const safeName = escapeHtml(userName.trim() || "there");
  const safeTopic = escapeHtml(topic.trim());
  const safeMessage = escapeHtml(message.trim());

  const sentence = buildHeartSentence();

  // Colors (soft blue gradient + warm pink text)
  const bg1 = "rgba(244, 248, 255, 1)";
  const bg2 = "rgba(246, 249, 255, 1)";
  const bg3 = "rgba(134, 156, 208, 0.35)";
  const ink = "rgba(42, 52, 86, 0.9)";
  const muted = "rgba(42, 52, 86, 0.65)";
  const pink = "rgba(214, 92, 108, 0.92)"; // slightly red-pink
  const pinkSoft = "rgba(214, 92, 108, 0.45)";
  const ribbon = "rgba(214, 92, 108, 0.95)";
  const white = "rgba(255, 255, 255, 1)";

  const subject = "Thanks — I received your message";

  const preheader =
    "Thanks for reaching out — I received your message and will reply soon.";

  // Heart image
  const heartImage = `
  <div style="text-align:center; padding: 12px 0 2px;">
    <img src="${escapeHtml(heartImageUrl)}" alt="Heart" style="max-width: 520px; width: 100%; height: auto; display: block; margin: 0 auto;" />
  </div>
  `;

  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <title>${subject}</title>
    </head>
    <body style="margin:0; padding:0; background:${bg1};">
      <!-- Preheader (hidden) -->
      <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
        ${escapeHtml(preheader)}
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="background: linear-gradient(135deg, ${bg1} 0%, ${bg2} 55%, ${bg3} 100%);">
        <tr>
          <td align="center" style="padding: 36px 14px;">
            <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0"
              style="width:680px; max-width: 100%; border-radius: 22px; overflow:hidden;
                box-shadow: 0 18px 50px rgba(17, 24, 39, 0.10);
                border: 1px solid rgba(120, 140, 200, 0.22);
                background: radial-gradient(ellipse at center, rgba(248, 251, 255, 0.80) 0%, rgba(240, 247, 255, 0.85) 25%, rgba(230, 242, 255, 0.92) 60%, rgba(220, 235, 255, 1) 100%);
                backdrop-filter: blur(10px);">
              <tr>
                <td style="padding: 26px 22px 10px; text-align:center;">
                  <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                    font-size: 34px; line-height: 1.15; font-weight: 700; color: ${ink}; letter-spacing: -0.5px;">
                    Thank you for your message
                  </div>

                  <div style="margin-top: 10px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                    font-size: 15px; line-height: 1.6; color: ${muted};">
                    Hi ${safeName}, I received your note via my portfolio and I’ll reply ${escapeHtml(replyTime)}.
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 6px 22px 0;">
                  ${heartImage}
                  
                  <!-- Separator line -->
                  <div style="text-align:center; margin: 12px auto 0;">
                    <div style="width: 64px; height: 1px; margin: 0 auto; 
                      background: rgba(214, 92, 108, 0.25); border-radius: 999px;"></div>
                  </div>
                  
                  <!-- Quote-style blessing -->
                  <div style="text-align:center; margin: 10px auto 0; max-width: 560px; padding: 0 20px;">
                    <p style="margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                      font-size: 15px; font-weight: 600; font-style: italic; line-height: 1.7;
                      color: rgba(180, 100, 110, 0.70); letter-spacing: 0.01em;">
                      "${escapeHtml(sentence)}"
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 18px 22px 6px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="border-radius: 18px; overflow:hidden; background: rgba(255,255,255,0.70);
                      border: 1px solid rgba(120, 140, 200, 0.20);">
                    <tr>
                      <td style="padding: 16px 16px 8px;">
                        <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                          font-size: 13px; color: ${muted}; text-transform: uppercase; letter-spacing: 0.12em;">
                          Your message copy
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 16px 16px;">
                        ${safeTopic ? `
                          <div style="margin: 6px 0 10px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                            font-size: 14px; color: ${ink};">
                            <span style="color:${muted};">Topic:</span> <span style="font-weight:600;">${safeTopic}</span>
                          </div>
                        ` : ""}

                        <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                          font-size: 14px; line-height: 1.7; color: ${ink};
                          white-space: pre-wrap;">
                          ${safeMessage || "<span style='color: rgba(42, 52, 86, 0.55);'>(No message content)</span>"}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <div style="text-align:center; padding: 16px 0 0;">
                    <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                      font-size: 14px; color:${muted};">
                      ${escapeHtml(signatureLine)}, <span style="font-weight:700; color:${ink};">${escapeHtml(brandName)}</span>
                    </div>

                    ${portfolioUrl ? `
                      <div style="margin-top: 10px;">
                        <a href="${escapeHtml(portfolioUrl)}" style="display:inline-block; text-decoration:none;
                          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                          font-size: 13px; color: ${ink};
                          padding: 10px 14px; border-radius: 999px;
                          border: 1px solid rgba(120, 140, 200, 0.26);
                          background: rgba(255,255,255,0.65);">
                          Visit my portfolio
                        </a>
                      </div>
                    ` : ""}
                  </div>

                  <div style="margin-top: 22px; text-align:center; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
                    font-size: 12px; line-height: 1.6; color: rgba(42, 52, 86, 0.55);">
                    ${escapeHtml(footerNote)}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="height: 18px;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const text =
`Thanks — I received your message

Hi ${userName || "there"},
I received your message via my portfolio. Expected reply time: ${replyTime}.

${topic ? `Topic: ${topic}\n` : ""}Your message copy:
${message || "(No message content)"}

${signatureLine},
${brandName}
`;

  return { subject, html, text };
}

export { buildUserReceiptEmail };
