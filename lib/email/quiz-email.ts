import { sendEmail } from './sendgrid';

interface SendQuizResultEmailParams {
  to: string;
  name: string | null;
  archetype: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oceoluxe.com';

type ArchetypeKey = 'muse' | 'world' | 'intimate' | 'editor' | 'populist';

interface ArchetypeContent {
  title: string;
  emoji: string;
  gift: string;
  tricky: string;
  question: string;
}

const archetypeContent: Record<ArchetypeKey, ArchetypeContent> = {
  muse: {
    title: 'The Muse Chaser',
    emoji: '✨',
    gift: `You design with someone specific in mind - and that focus gives your work a soul that trend-followers can't replicate. Every piece you create has intention because it's filtered through a clear vision of who she is.`,
    tricky: `Sometimes that clarity becomes a filter that's almost too fine. You might find yourself second-guessing pieces that don't feel "perfectly her" - or hesitating to expand because it feels like a betrayal of your vision. The muse can become a gatekeeper.`,
    question: `What if you could honor your muse while also creating pathways for women who want to inhabit her energy - even if they're not her exactly?`,
  },
  world: {
    title: 'The World Builder',
    emoji: '🌙',
    gift: `You're not just making clothes - you're creating an entire universe. Your brand has mood, mythology, atmosphere. People don't just want to wear your pieces; they want to step into the world you've built. That's rare and magnetic.`,
    tricky: `Sometimes the world becomes so complete, so intricate, that clients aren't sure how to enter it. They admire from a distance but don't see the door. The very richness that makes your brand special can make it feel inaccessible.`,
    question: `What would it look like to build clear entry points into your world - invitations that welcome people in without diluting the magic?`,
  },
  intimate: {
    title: 'The Intimist',
    emoji: '🤍',
    gift: `You build relationships, not just client lists. The women who wear your work feel known by you - and that creates a loyalty that mass brands will never touch. You're not competing on trends or price; you're irreplaceable because you truly see them.`,
    tricky: `Intimacy can start to feel like a ceiling. Growth might feel like a betrayal of the closeness you've cultivated. You might catch yourself thinking that scaling means losing the personal touch that makes your work meaningful.`,
    question: `What if growth didn't mean losing intimacy - but rather building systems that let you maintain those deep connections while reaching more of the right people?`,
  },
  editor: {
    title: 'The Editor',
    emoji: '✂️',
    gift: `You believe in less, but exceptional. Every piece in your collection earns its place. Buyers and clients trust that if you made it, it matters. Your restraint is your signature - and it commands respect.`,
    tricky: `Editing can become a form of paralysis. The pursuit of "only the essential" can mean collections that never feel finished, launches that keep getting pushed, ideas that stay in your head because they're not perfect yet. The world might be waiting for work you're still refining.`,
    question: `What if you had systems that helped you move from concept to delivery with confidence - so your high standards become a strength, not a bottleneck?`,
  },
  populist: {
    title: 'The Populist',
    emoji: '🌍',
    gift: `You believe exceptional design shouldn't be gatekept. Accessibility isn't a compromise for you - it's part of the vision. You think about your client's actual life, her real needs, what she can actually access. That makes your work wearable in the truest sense.`,
    tricky: `Sometimes the desire to reach more people can pull you toward decisions that dilute what makes your work special. Or you might undervalue exclusivity, not realizing that strategic scarcity can create the desire that funds your ability to serve more people well.`,
    question: `What if you could reach more women without being available to everyone - building sustainable systems that let accessibility and intention coexist?`,
  },
};

export async function sendQuizResultEmail({ to, name, archetype }: SendQuizResultEmailParams) {
  const firstName = name || 'there';
  const content = archetypeContent[archetype as ArchetypeKey];

  if (!content) {
    console.error(`Unknown archetype: ${archetype}`);
    return { success: false, error: 'Unknown archetype' };
  }

  const subject = `Your archetype is in - here's what it means ${content.emoji}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Designer Archetype</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #faf8f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #3B3937; letter-spacing: 2px;">OCEO LUXE</h1>
            </td>
          </tr>

          <!-- Archetype Badge -->
          <tr>
            <td style="padding: 0 40px 20px 40px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%); border-radius: 12px; padding: 20px 32px; border: 1px solid #e8e4e1;">
                <span style="font-size: 32px;">${content.emoji}</span>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #967F71; text-transform: uppercase; letter-spacing: 2px;">Your Archetype</p>
                <p style="margin: 4px 0 0 0; font-size: 22px; color: #3B3937; font-style: italic;">${content.title}</p>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.8; color: #3B3937;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.8; color: #3B3937;">
                You just discovered you're <strong style="color: #CDA7B2;">${content.title}</strong> - and honestly? That says a lot about how you approach your work.
              </p>

              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.8; color: #3B3937;">
                This isn't just a personality label. It's a window into how you naturally create, connect with clients, and build your brand. And there's real power in understanding that.
              </p>

              <!-- Your Gift -->
              <div style="background-color: #faf8f5; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 3px solid #CDA7B2;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #CDA7B2; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                  Your Gift
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #3B3937;">
                  ${content.gift}
                </p>
              </div>

              <!-- Where It Gets Tricky -->
              <div style="background-color: #faf8f5; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 3px solid #967F71;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #967F71; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                  Where It Can Get Tricky
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #3B3937;">
                  ${content.tricky}
                </p>
              </div>

              <!-- The Question -->
              <div style="background-color: #3B3937; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #CDA7B2; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                  The Question Worth Asking
                </p>
                <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #ffffff; font-style: italic;">
                  ${content.question}
                </p>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.8; color: #3B3937;">
                That's what we explore inside Oceo Luxe.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #967F71;">
                If you're curious:
              </p>

              <!-- Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 12px 0;">
                    <a href="${BASE_URL}/products" style="color: #CDA7B2; font-size: 15px; text-decoration: none;">
                      → Explore production tools + templates
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <a href="${BASE_URL}/services" style="color: #CDA7B2; font-size: 15px; text-decoration: none;">
                      → See how I work with designers
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <a href="${BASE_URL}/studio-systems?archetype=${archetype}" style="color: #CDA7B2; font-size: 15px; text-decoration: none;">
                      → Learn about Studio Systems membership
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.8; color: #967F71; font-style: italic;">
                No pressure. No urgency. Just an open door whenever you're ready.
              </p>

              <p style="margin: 32px 0 0 0; font-size: 16px; color: #3B3937;">
                Warmly,
              </p>
              <p style="margin: 4px 0 0 0; font-size: 18px; color: #CDA7B2; font-style: italic;">
                Kerri
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f5f0ea; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #967F71;">
                Oceo Luxe | Structure as Support
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #967F71;">
                <a href="${BASE_URL}" style="color: #967F71; text-decoration: none;">oceoluxe.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `Hi ${firstName},

You just discovered you're ${content.title} - and honestly? That says a lot about how you approach your work.

This isn't just a personality label. It's a window into how you naturally create, connect with clients, and build your brand. And there's real power in understanding that.

---

YOUR GIFT

${content.gift}

---

WHERE IT CAN GET TRICKY

${content.tricky}

---

THE QUESTION WORTH ASKING

${content.question}

---

That's what we explore inside Oceo Luxe.

If you're curious:

→ Explore production tools + templates: ${BASE_URL}/products
→ See how I work with designers: ${BASE_URL}/services
→ Learn about Studio Systems membership: ${BASE_URL}/studio-systems?archetype=${archetype}

No pressure. No urgency. Just an open door whenever you're ready.

Warmly,
Kerri

---
Oceo Luxe | Structure as Support
oceoluxe.com
`;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}
