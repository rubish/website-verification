import mongoose from 'mongoose';

const STATUS_INIT = 'INIT';
const STATUS_CRAWLING = 'CRAWLING';
const STATUS_ENRICHING = 'ENRICHING';
const STATUS_COMPLETED = 'COMPLETED';

const websiteVerificationSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['INIT', 'CRAWLING', 'ENRICHING', 'COMPLETED'],
      required: true,
      default: 'INIT',
    },
    results: {
      homePage: String,
      isRedirecting: Boolean,
      redirectAcceptable: Boolean,
      privacyPage: String,
      contactPage: String,
      termsPage: String,
      refundPolicyPage: String,
      shippingPolicyPage: String,
    },
  },
  {
    timestamps: true,
  }
);

export default websiteVerificationSchema;
export { STATUS_INIT, STATUS_CRAWLING, STATUS_ENRICHING, STATUS_COMPLETED };
