import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  try {
    const baseProduct = await stripe.products.create({
      name: 'Base',
      description: 'Base subscription plan',
    });

    await stripe.prices.create({
      product: baseProduct.id,
      unit_amount: 800, // $8 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7,
      },
    });

    const plusProduct = await stripe.products.create({
      name: 'Plus',
      description: 'Plus subscription plan',
    });

    await stripe.prices.create({
      product: plusProduct.id,
      unit_amount: 1200, // $12 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7,
      },
    });

    console.log('Stripe products and prices created successfully.');
  } catch (error: any) {
    if (error.code === 'resource_already_exists') {
      console.log('Stripe products already exist, skipping...');
    } else {
      throw error;
    }
  }
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  let user;
  if (existingUser) {
    console.log('User already exists, skipping user creation...');
    user = existingUser;
  } else {
    const [newUser] = await db
      .insert(users)
      .values([
        {
          email: email,
          passwordHash: passwordHash,
          role: "owner",
        },
      ])
      .returning();
    user = newUser;
    console.log('Initial user created.');
  }

  // Check if team already exists
  const existingTeam = await db.query.teams.findFirst({
    where: eq(teams.name, 'Test Team'),
  });

  let team;
  if (existingTeam) {
    console.log('Team already exists, skipping team creation...');
    team = existingTeam;
  } else {
    const [newTeam] = await db
      .insert(teams)
      .values({
        name: 'Test Team',
      })
      .returning();
    team = newTeam;
    console.log('Test team created.');
  }

  // Check if team member already exists
  const existingMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
  });

  if (!existingMember) {
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: user.id,
      role: 'owner',
    });
    console.log('Team member created.');
  } else {
    console.log('Team member already exists, skipping...');
  }

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
