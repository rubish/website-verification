import mongoose from 'mongoose';

const websiteVerificationSchema = new mongoose.Schema(
  {
    url: String,
  },
  {
    timestamps: true,
  }
);

const WebsiteVerificationEntity = mongoose.model(
  'WebsiteVerification',
  websiteVerificationSchema,
  'website_verifications'
);

export default WebsiteVerificationEntity;
