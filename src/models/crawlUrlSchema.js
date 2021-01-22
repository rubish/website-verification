import mongoose from 'mongoose';

import { CRAWL_MODEL } from './constants.js';

const STATUS_INIT = 'INIT';
const STATUS_FAILED = 'FAILED';
const STATUS_COMPLETED = 'COMPLETED';

const crawlUrlSchema = new mongoose.Schema(
  {
    crawl: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: CRAWL_MODEL,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [STATUS_INIT, STATUS_FAILED, STATUS_COMPLETED],
      required: true,
      default: STATUS_INIT,
    },
    depth: {
      type: Number,
      default: 0,
    },
    extractedData: {
      urls: [
        {
          url: String,
          text: String,
        },
      ],
    },
    response: {
      redirected: Boolean,
      redirectUrl: String,
      failed: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default crawlUrlSchema;
export { STATUS_INIT, STATUS_FAILED, STATUS_COMPLETED };
