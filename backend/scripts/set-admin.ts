import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/portfolio';

async function updateAdmin() {
  const args = process.argv.slice(2);
  const targetEmail = args[0] || process.env.ADMIN_EMAIL || process.env.INITIAL_ADMIN_EMAIL;
  const targetPassword = args[1] || process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD;

  if (!targetEmail) {
    console.error('❌ Error: Please provide an email address.');
    console.log('Usage: npm run set-admin -- <your-real-email@example.com> [optional-new-password]');
    process.exit(1);
  }

  console.log(`Connecting to database at ${databaseUrl}...`);
  await mongoose.connect(databaseUrl);

  const usersCollection = mongoose.connection.collection('users');
  const existingAdmin = await usersCollection.findOne({ role: 'admin' });

  const updateFields: Record<string, unknown> = {
    email: targetEmail.toLowerCase().trim(),
    updatedAt: new Date(),
  };

  if (targetPassword) {
    const salt = await bcrypt.genSalt(12);
    updateFields['password'] = await bcrypt.hash(targetPassword, salt);
  }

  if (existingAdmin) {
    await usersCollection.updateOne({ _id: existingAdmin._id }, { $set: updateFields });
    console.log(`✅ Successfully updated Administrator account:`);
    console.log(`   Email:    ${targetEmail}`);
    if (targetPassword) {
      console.log(`   Password: (Updated to new password)`);
    } else {
      console.log(`   Password: (Unchanged)`);
    }
  } else {
    // If no admin user exists, create one
    if (!targetPassword) {
      console.error('❌ No admin exists in database, so a password is required.');
      process.exit(1);
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(targetPassword, salt);
    await usersCollection.insertOne({
      email: targetEmail.toLowerCase().trim(),
      password: hashedPassword,
      fullName: 'Dim Sareach',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Successfully created Administrator account:`);
    console.log(`   Email: ${targetEmail}`);
  }

  console.log('\n🎉 You can now sign in at http://localhost:4200/admin/login with this email!');
  await mongoose.disconnect();
}

updateAdmin().catch((err) => {
  console.error('❌ Failed to update admin:', err.message);
  process.exit(1);
});
