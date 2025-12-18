import 'dotenv/config';
import { sendFoundingMemberWelcomeEmail } from '../lib/email/purchase-emails';

async function main() {
  console.log('Sending test founding member email...');
  
  const result = await sendFoundingMemberWelcomeEmail({
    email: 'kerri@bridgmanproperties.com',
    name: 'Kerri',
    tier: 'monthly',
    amountCents: 3300,
  });

  if (result.success) {
    console.log('✅ Founding member email sent successfully!');
  } else {
    console.error('❌ Failed to send email:', result.error);
  }
}

main();
